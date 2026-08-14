import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

// Pre-configured primary school demo accounts
export const DEMO_ACCOUNTS = {
  teacher: {
    id: 't1111111-1111-1111-1111-111111111111',
    email: 'co.hoa@tieuhoc.edu.vn',
    full_name: 'Cô Nguyễn Thị Hoa',
    role: 'teacher',
    phone: '0912 345 678',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'GVCN Lớp 3A1'
  },
  student: {
    id: 's2222222-2222-2222-2222-222222222222',
    email: 'be.bong@tieuhoc.edu.vn',
    full_name: 'Trần Minh An (Bé Bông)',
    role: 'student',
    student_code: 'HS2026-001',
    phone: '0988 111 222',
    avatar_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    class_name: 'Lớp 3A1'
  },
  parent: {
    id: 'p3333333-3333-3333-3333-333333333333',
    email: 'phuhuynh.an@gmail.com',
    full_name: 'Phụ huynh Trần Văn Nam (Bố bé Minh An)',
    role: 'parent',
    phone: '0903 888 999',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    linked_student_id: 's2222222-2222-2222-2222-222222222222'
  },
  admin: {
    id: 'a4444444-4444-4444-4444-444444444444',
    email: 'admin@tieuhoc.edu.vn',
    full_name: 'Thầy Lê Văn Hoàng (Ban Giám Hiệu)',
    role: 'admin',
    phone: '0901 000 111',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(DEMO_ACCOUNTS.teacher);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      // Check active Supabase session
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setUser(session.user);
          fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user);
          fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(DEMO_ACCOUNTS.teacher);
          setLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      // Demo Mode Default
      setProfile(DEMO_ACCOUNTS.teacher);
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email, password) => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setLoading(false);
        throw error;
      }
      return data;
    } else {
      // Match demo account or default teacher
      const matchedKey = Object.keys(DEMO_ACCOUNTS).find(
        (key) => DEMO_ACCOUNTS[key].email.toLowerCase() === email.toLowerCase()
      );
      const chosen = matchedKey ? DEMO_ACCOUNTS[matchedKey] : DEMO_ACCOUNTS.teacher;
      setProfile(chosen);
      setLoading(false);
      return { user: { id: chosen.id, email: chosen.email } };
    }
  };

  const registerUser = async (email, password, fullName, role) => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      if (error) {
        setLoading(false);
        throw error;
      }
      return data;
    } else {
      const newAcc = {
        id: `user-${Date.now()}`,
        email,
        full_name: fullName,
        role: role,
        avatar_url: ''
      };
      setProfile(newAcc);
      setLoading(false);
      return { user: newAcc };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(DEMO_ACCOUNTS.teacher);
  };

  // Switch active role instantly in Demo Mode for fast testing
  const switchDemoRole = (roleKey) => {
    if (DEMO_ACCOUNTS[roleKey]) {
      setProfile(DEMO_ACCOUNTS[roleKey]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginWithEmail,
        registerUser,
        logout,
        switchDemoRole,
        isDemo: !isSupabaseConfigured()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
