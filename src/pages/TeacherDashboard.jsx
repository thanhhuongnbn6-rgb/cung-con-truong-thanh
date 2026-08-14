import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClass } from '../context/ClassContext';
import { Sidebar } from '../components/common/Sidebar';
import { AttendanceBoard } from '../components/features/AttendanceBoard';
import { RewardSystem } from '../components/features/RewardSystem';
import { CoOiInbox } from '../components/features/CoOiInbox';
import { ParentChat } from '../components/features/ParentChat';
import { ClassDiary } from '../components/features/ClassDiary';
import { InteractiveGames } from '../components/features/InteractiveGames';
import { AnalyticsReport } from '../components/features/AnalyticsReport';
import { Heart, Home, UserCheck, Award, Sparkles, Bell } from 'lucide-react';

export const TeacherDashboard = () => {
  const { profile } = useAuth();
  const { coOiMessages, rewards, currentClass } = useClass();
  const [activeTab, setActiveTab] = useState('attendance');

  // Count unread alerts
  const pendingCoOi = coOiMessages.filter(m => !m.is_resolved).length;
  const pendingRewards = rewards.filter(r => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Alert Banner for Teacher */}
      {(pendingCoOi > 0 || pendingRewards > 0) && (
        <div className="mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 p-4 rounded-3xl shadow-md flex flex-wrap items-center justify-between gap-4 animate-pop-in">
          <div className="flex items-center gap-3 font-bold text-xs sm:text-sm">
            <Bell size={20} className="animate-bounce" />
            <span>
              Cô Hoa ơi! Lớp {currentClass.name} có{' '}
              {pendingCoOi > 0 && <strong className="underline">{pendingCoOi} lời nhắn "Cô ơi!" mới</strong>}
              {pendingCoOi > 0 && pendingRewards > 0 && ' và '}
              {pendingRewards > 0 && <strong className="underline">{pendingRewards} đề xuất tích điểm việc nhà từ Phụ huynh</strong>}.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {pendingCoOi > 0 && (
              <button
                onClick={() => setActiveTab('co_oi')}
                className="bg-slate-950 text-amber-300 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow hover:bg-slate-800 transition"
              >
                Xem Hòm Thư
              </button>
            )}
            {pendingRewards > 0 && (
              <button
                onClick={() => setActiveTab('rewards')}
                className="bg-slate-950 text-amber-300 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow hover:bg-slate-800 transition"
              >
                Duyệt Việc Nhà
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Sidebar Navigation */}
        <div className="md:col-span-1">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={profile?.role || 'teacher'} />
        </div>

        {/* Right Active Content Area */}
        <main className="md:col-span-3">
          {activeTab === 'attendance' && <AttendanceBoard />}
          {activeTab === 'rewards' && <RewardSystem />}
          {activeTab === 'co_oi' && <CoOiInbox />}
          {activeTab === 'chat' && <ParentChat />}
          {activeTab === 'diary' && <ClassDiary />}
          {activeTab === 'games' && <InteractiveGames />}
          {activeTab === 'analytics' && <AnalyticsReport />}
        </main>
      </div>
    </div>
  );
};
