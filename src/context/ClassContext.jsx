import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { triggerConfetti, playSoundEffect } from '../lib/helpers';

const ClassContext = createContext();

// Initial Realistic Classroom Students (Lớp 3A1 - 24 Học Sinh)
const INITIAL_STUDENTS = [
  { id: 's2222222-2222-2222-2222-222222222222', student_code: 'HS2026-001', full_name: 'Trần Minh An', nickname: 'Bé Bông', avatar_color: '#10B981', seat: 1, stars: 45, parent_name: 'Trần Văn Nam', parent_phone: '0903 888 999' },
  { id: 's-002', student_code: 'HS2026-002', full_name: 'Nguyễn Hoàng Bảo', nickname: 'Bảo Bảo', avatar_color: '#F59E0B', seat: 2, stars: 38, parent_name: 'Nguyễn Thanh Tùng', parent_phone: '0912 111 222' },
  { id: 's-003', student_code: 'HS2026-003', full_name: 'Lê Thảo Chi', nickname: 'Chi Chi', avatar_color: '#EC4899', seat: 3, stars: 52, parent_name: 'Lê Thị Thu', parent_phone: '0988 333 444' },
  { id: 's-004', student_code: 'HS2026-004', full_name: 'Phạm Đức Duy', nickname: 'Duy Mập', avatar_color: '#0284C7', seat: 4, stars: 29, parent_name: 'Phạm Văn Hùng', parent_phone: '0977 555 666' },
  { id: 's-005', student_code: 'HS2026-005', full_name: 'Đỗ Hải Đăng', nickname: 'Hải Đăng', avatar_color: '#8B5CF6', seat: 5, stars: 41, parent_name: 'Đỗ Văn Thành', parent_phone: '0933 777 888' },
  { id: 's-006', student_code: 'HS2026-006', full_name: 'Vũ Ngân Hà', nickname: 'Hà Hà', avatar_color: '#EF4444', seat: 6, stars: 48, parent_name: 'Vũ Thị Phương', parent_phone: '0944 999 000' },
  { id: 's-007', student_code: 'HS2026-007', full_name: 'Hoàng Gia Huy', nickname: 'Bi', avatar_color: '#14B8A6', seat: 7, stars: 33, parent_name: 'Hoàng Quốc Việt', parent_phone: '0966 222 333' },
  { id: 's-008', student_code: 'HS2026-008', full_name: 'Bùi Mai Chi', nickname: 'Thỏ Mít', avatar_color: '#F43F5E', seat: 8, stars: 36, parent_name: 'Bùi Thị Hà', parent_phone: '0922 444 555' },
  { id: 's-009', student_code: 'HS2026-009', full_name: 'Đặng Tuấn Kiệt', nickname: 'Kiệt Sức', avatar_color: '#6366F1', seat: 9, stars: 22, parent_name: 'Đặng Văn Khoa', parent_phone: '0911 666 777' },
  { id: 's-010', student_code: 'HS2026-010', full_name: 'Nông Linh Nhi', nickname: 'Nhi Nhi', avatar_color: '#10B981', seat: 10, stars: 44, parent_name: 'Nông Văn Phúc', parent_phone: '0988 888 999' },
  { id: 's-011', student_code: 'HS2026-011', full_name: 'Trịnh Nhật Minh', nickname: 'Minh Xoăn', avatar_color: '#F59E0B', seat: 11, stars: 31, parent_name: 'Trịnh Thị Nga', parent_phone: '0977 123 456' },
  { id: 's-012', student_code: 'HS2026-012', full_name: 'Cao Khánh Ngọc', nickname: 'Ngọc Bích', avatar_color: '#EC4899', seat: 12, stars: 55, parent_name: 'Cao Văn Sơn', parent_phone: '0933 654 321' }
];

// Initial Attendance today
const TODAY_STR = new Date().toISOString().split('T')[0];

const INITIAL_ATTENDANCE = {
  [TODAY_STR]: {
    's2222222-2222-2222-2222-222222222222': { status: 'present', note: '' },
    's-002': { status: 'present', note: '' },
    's-003': { status: 'present', note: '' },
    's-004': { status: 'late', note: 'Đi khám răng đến 8h15' },
    's-005': { status: 'present', note: '' },
    's-006': { status: 'excused', note: 'Phụ huynh xin nghỉ sốt nhẹ' },
    's-007': { status: 'present', note: '' },
    's-008': { status: 'present', note: '' },
    's-009': { status: 'present', note: '' },
    's-010': { status: 'present', note: '' },
    's-011': { status: 'present', note: '' },
    's-012': { status: 'present', note: '' }
  }
};

// Initial Reward Log
const INITIAL_REWARDS = [
  { id: 'r1', student_id: 's2222222-2222-2222-2222-222222222222', points: 5, category: 'academic', reason: 'Phát biểu hăng hái môn Toán bài Phép nhân', awarded_by: 'Cô Nguyễn Thị Hoa', status: 'approved', created_at: new Date(Date.now() - 3600000 * 4).toISOString() },
  { id: 'r2', student_id: 's2222222-2222-2222-2222-222222222222', points: 3, category: 'home_chore', reason: 'Tự giác gấp chăn màn & dọn góc học tập', awarded_by: 'Bố Trần Văn Nam', status: 'approved', created_at: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'r3', student_id: 's-003', points: 5, category: 'behavior', reason: 'Giúp đỡ bạn lau bảng sau giờ học', awarded_by: 'Cô Nguyễn Thị Hoa', status: 'approved', created_at: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'r4', student_id: 's2222222-2222-2222-2222-222222222222', points: 4, category: 'home_chore', reason: 'Lễ phép chào ông bà và rửa bát giúp mẹ', awarded_by: 'Bố Trần Văn Nam', status: 'pending', created_at: new Date(Date.now() - 3600000 * 2).toISOString() },
];

// Initial Secret "Cô ơi!" Box
const INITIAL_CO_OI = [
  {
    id: 'co-1',
    student_id: 's2222222-2222-2222-2222-222222222222',
    student_name: 'Trần Minh An',
    emotion_tag: 'Lo lắng',
    message_text: 'Cô ơi, hôm nay con chưa học thuộc hết bài thơ Đồng hồ. Lúc lên bảng con sợ bị điểm xấu ạ...',
    teacher_reply: 'Cô khen Minh An đã dũng cảm chia sẻ với cô nhé! Giờ ra chơi cô sẽ cùng ôn lại với con, không phải lo lắng đâu con yêu nhé! ❤️',
    is_resolved: true,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    replied_at: new Date(Date.now() - 3600000 * 16).toISOString()
  },
  {
    id: 'co-2',
    student_id: 's-004',
    student_name: 'Phạm Đức Duy',
    emotion_tag: 'Bị bạn trêu',
    message_text: 'Cô ơi giờ ra chơi bạn Kiệt cứ bảo con mập. Con buồn lắm cô ạ.',
    teacher_reply: '',
    is_resolved: false,
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

// Initial Chat Messages & Class Announcements
const INITIAL_CHAT = [
  {
    id: 'msg-1',
    class_id: 'c1',
    sender_id: 't1111111-1111-1111-1111-111111111111',
    sender_name: 'Cô Nguyễn Thị Hoa (GVCN)',
    receiver_id: null, // Class Announcement
    type: 'announcement',
    content: '📢 THÔNG BÁO TỚI PHỤ HUYNH LỚP 3A1:\nThứ 6 tuần này lớp mình sẽ tham gia hoạt động trải nghiệm "Em làm họa sĩ nhí". Kính mời phụ huynh nhắc các con chuẩn bị màu vẽ và bút chì ạ!',
    created_at: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    id: 'msg-2',
    class_id: 'c1',
    sender_id: 'p3333333-3333-3333-3333-333333333333',
    sender_name: 'Phụ huynh Trần Văn Nam (Bố bé Minh An)',
    receiver_id: 't1111111-1111-1111-1111-111111111111',
    type: 'direct',
    content: 'Dạ thưa cô Hoa, sáng nay gia đình cho bé Minh An đi khám răng nên đến muộn 15 phút ạ. Nhờ cô đón cháu ở cổng trường giúp ạ!',
    created_at: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'msg-3',
    class_id: 'c1',
    sender_id: 't1111111-1111-1111-1111-111111111111',
    sender_name: 'Cô Nguyễn Thị Hoa (GVCN)',
    receiver_id: 'p3333333-3333-3333-3333-333333333333',
    type: 'direct',
    content: 'Dạ chào anh Nam, cô đã đón bé Minh An vào lớp an toàn rồi nhé! Anh yên tâm ạ.',
    created_at: new Date(Date.now() - 3600000 * 9).toISOString()
  }
];

// Initial Class Diary Feed ("Nhật ký lớp tôi")
const INITIAL_DIARY = [
  {
    id: 'd1',
    title: '🎉 Lớp 3A1 đạt Giải Nhất Hội thi "Văn nghệ Khối 3"',
    content: 'Hôm nay các bạn học sinh Lớp 3A1 đã hoàn thành xuất sắc tiết mục múa "Bông hoa mừng cô". Cô khen tinh thần đoàn kết và tập luyện hăng hái của cả lớp!',
    author_name: 'Cô Nguyễn Thị Hoa',
    media_urls: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'
    ],
    likes_count: 24,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 'd2',
    title: '🌱 Giờ sinh hoạt lớp: "Tập làm người bạn tốt"',
    content: 'Cùng ngắm nhìn những nụ cười rạng rỡ của các con trong giờ sinh hoạt chủ đề tình bạn thân thiết. Bạn nào cũng hứa sẽ luôn giúp đỡ và yêu thương nhau.',
    author_name: 'Cô Nguyễn Thị Hoa',
    media_urls: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80'
    ],
    likes_count: 18,
    created_at: new Date(Date.now() - 3600000 * 96).toISOString()
  }
];

export const ClassProvider = ({ children }) => {
  const { profile } = useAuth();
  
  const [currentClass] = useState({
    id: 'c1',
    name: 'Lớp 3A1',
    grade_level: 3,
    academic_year: '2025-2026',
    join_code: 'L3A1-8899',
    teacher_name: 'Cô Nguyễn Thị Hoa'
  });

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [rewards, setRewards] = useState(INITIAL_REWARDS);
  const [coOiMessages, setCoOiMessages] = useState(INITIAL_CO_OI);
  const [chatMessages, setChatMessages] = useState(INITIAL_CHAT);
  const [diaryFeed, setDiaryFeed] = useState(INITIAL_DIARY);

  // Synchronize with Supabase if backend configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchClassDataFromSupabase();

      // Subscribe to Realtime Chat & Secret Messages
      const channel = supabase
        .channel('class-updates')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
          setChatMessages(prev => [payload.new, ...prev]);
        })
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'co_oi_messages' }, payload => {
          setCoOiMessages(prev => [payload.new, ...prev]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const fetchClassDataFromSupabase = async () => {
    try {
      const { data: stData } = await supabase.from('class_students').select('*');
      if (stData && stData.length > 0) {
        setStudents(stData);
      }
    } catch (err) {
      console.warn('Using live state fallback for ClassContext');
    }
  };

  // --- 1. ATTENDANCE MANAGEMENT ---
  const markAttendance = (studentId, status, note = '') => {
    const today = new Date().toISOString().split('T')[0];
    setAttendance(prev => {
      const dayData = prev[today] || {};
      return {
        ...prev,
        [today]: {
          ...dayData,
          [studentId]: { status, note }
        }
      };
    });
    playSoundEffect('click');
  };

  // --- 2. REWARD POINTS MANAGEMENT ---
  const awardPoints = (studentId, points, category, reason, awardedBy = profile?.full_name || 'GVCN', isParentRequest = false) => {
    const newReward = {
      id: `r-${Date.now()}`,
      student_id: studentId,
      points: Number(points),
      category,
      reason,
      awarded_by: awardedBy,
      status: isParentRequest ? 'pending' : 'approved',
      created_at: new Date().toISOString()
    };

    setRewards(prev => [newReward, ...prev]);

    if (!isParentRequest) {
      // Update student star counter
      setStudents(prev =>
        prev.map(s => (s.id === studentId ? { ...s, stars: Math.max(0, s.stars + Number(points)) } : s))
      );
      triggerConfetti();
      playSoundEffect('win');
    }
  };

  const approveParentReward = (rewardId) => {
    setRewards(prev =>
      prev.map(r => {
        if (r.id === rewardId) {
          // Add stars to student
          setStudents(st =>
            st.map(s => (s.id === r.student_id ? { ...s, stars: s.stars + r.points } : s))
          );
          return { ...r, status: 'approved' };
        }
        return r;
      })
    );
    triggerConfetti();
    playSoundEffect('win');
  };

  // --- 3. CONFESSION "CÔ ƠI!" MANAGEMENT ---
  const sendCoOiMessage = (studentId, studentName, emotionTag, messageText) => {
    const newMsg = {
      id: `co-${Date.now()}`,
      student_id: studentId,
      student_name: studentName,
      emotion_tag: emotionTag,
      message_text: messageText,
      teacher_reply: '',
      is_resolved: false,
      created_at: new Date().toISOString()
    };
    setCoOiMessages(prev => [newMsg, ...prev]);
    playSoundEffect('click');
  };

  const replyCoOiMessage = (msgId, replyText) => {
    setCoOiMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, teacher_reply: replyText, is_resolved: true, replied_at: new Date().toISOString() } : m))
    );
    playSoundEffect('click');
  };

  // --- 4. CHAT MANAGEMENT ---
  const sendChatMessage = (receiverId, content, type = 'direct') => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      class_id: currentClass.id,
      sender_id: profile.id,
      sender_name: profile.full_name,
      receiver_id: receiverId,
      type,
      content,
      created_at: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, newMsg]);
    playSoundEffect('click');
  };

  // --- 5. CLASS DIARY MANAGEMENT ---
  const addDiaryPost = (title, content, mediaUrls = []) => {
    const newPost = {
      id: `d-${Date.now()}`,
      title,
      content,
      author_name: profile.full_name,
      media_urls: mediaUrls.length > 0 ? mediaUrls : ['https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80'],
      likes_count: 0,
      created_at: new Date().toISOString()
    };
    setDiaryFeed(prev => [newPost, ...prev]);
    triggerConfetti();
  };

  const likeDiaryPost = (postId) => {
    setDiaryFeed(prev =>
      prev.map(p => (p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p))
    );
    playSoundEffect('click');
  };

  return (
    <ClassContext.Provider
      value={{
        currentClass,
        students,
        setStudents,
        attendance,
        markAttendance,
        rewards,
        awardPoints,
        approveParentReward,
        coOiMessages,
        sendCoOiMessage,
        replyCoOiMessage,
        chatMessages,
        sendChatMessage,
        diaryFeed,
        addDiaryPost,
        likeDiaryPost
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClass = () => useContext(ClassContext);
