import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClass } from '../context/ClassContext';
import { RewardSystem } from '../components/features/RewardSystem';
import { ParentChat } from '../components/features/ParentChat';
import { ClassDiary } from '../components/features/ClassDiary';
import { 
  UserCheck, 
  Star, 
  MessageCircle, 
  Home, 
  Calendar, 
  Award, 
  Camera, 
  PlusCircle,
  Phone
} from 'lucide-react';
import { formatDateVN } from '../lib/helpers';

export const ParentPortal = () => {
  const { profile } = useAuth();
  const { students, attendance, currentClass } = useClass();
  const [activeTab, setActiveTab] = useState('home_chores'); // 'home_chores' | 'chat' | 'attendance' | 'diary'

  // Student linked to parent
  const student = students.find(s => s.id === 's2222222-2222-2222-2222-222222222222') || students[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance[todayStr]?.[student.id] || { status: 'present', note: '' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Parent Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black uppercase">
              CỔNG PHỤ HUYNH HỌC SINH
            </span>
            <span className="text-sky-100 text-xs font-extrabold">• {currentClass.name}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">
            Theo Dõi Tiến Độ: {student?.full_name} ({student?.nickname})
          </h2>
          <p className="text-sky-100 text-xs sm:text-sm font-semibold mt-1">
            Tài khoản Phụ huynh: {profile?.full_name} • Mã HS: {student?.student_code}
          </p>
        </div>

        {/* Live Attendance Status Card */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[200px]">
          <span className="text-[11px] text-sky-200 font-bold uppercase">Chuyên Cần Hôm Nay</span>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            {todayAttendance.status === 'present' && (
              <span className="bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                ✅ Có mặt đúng giờ
              </span>
            )}
            {todayAttendance.status === 'late' && (
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                ⚠️ Đi muộn ({todayAttendance.note})
              </span>
            )}
            {todayAttendance.status === 'excused' && (
              <span className="bg-sky-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1">
                📝 Nghỉ có phép ({todayAttendance.note})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('home_chores')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'home_chores' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Home size={16} /> Tích Điểm Mẹ Vui (Việc Nhà)
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'chat' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle size={16} /> Bảng Tin & Chat GVCN
        </button>

        <button
          onClick={() => setActiveTab('diary')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'diary' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Camera size={16} /> Nhật Ký Hoạt Động Lớp
        </button>
      </div>

      {/* SUB-TAB CONTENTS */}
      {activeTab === 'home_chores' && <RewardSystem />}
      {activeTab === 'chat' && <ParentChat />}
      {activeTab === 'diary' && <ClassDiary />}
    </div>
  );
};
