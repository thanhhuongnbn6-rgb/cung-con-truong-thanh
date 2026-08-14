import React from 'react';
import { useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { StudentHome } from './pages/StudentHome';
import { ParentPortal } from './pages/ParentPortal';
import { AdminPanel } from './pages/AdminPanel';
import { AuthPage } from './pages/AuthPage';

export default function App() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-extrabold text-emerald-800 text-sm">Đang tải Lớp Học Hạnh Phúc...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-[#f0fdf4] text-slate-800 pb-12">
      <Header />
      {profile.role === 'teacher' && <TeacherDashboard />}
      {profile.role === 'student' && <StudentHome />}
      {profile.role === 'parent' && <ParentPortal />}
      {profile.role === 'admin' && <AdminPanel />}
    </div>
  );
}
