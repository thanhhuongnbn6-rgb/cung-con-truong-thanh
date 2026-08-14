import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useClass } from '../context/ClassContext';
import { HONOR_BADGES } from '../lib/helpers';
import { CoOiInbox } from '../components/features/CoOiInbox';
import { RewardSystem } from '../components/features/RewardSystem';
import { InteractiveGames } from '../components/features/InteractiveGames';
import { ClassDiary } from '../components/features/ClassDiary';
import { Star, Heart, Gamepad2, Trophy, Camera, Award, Sparkles } from 'lucide-react';

export const StudentHome = () => {
  const { profile } = useAuth();
  const { students, currentClass } = useClass();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'co_oi' | 'games' | 'rewards' | 'diary'

  // Student profile match
  const student = students.find(s => s.id === profile?.id) || students[0];
  const stars = student?.stars || 45;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Student Welcome Banner with Big Star Badge */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-3xl shadow-lg border-4 border-white"
            style={{ backgroundColor: student?.avatar_color || '#10B981' }}
          >
            {student?.full_name?.charAt(0) || 'B'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black uppercase">
                HỌC SINH CHĂM NGOAN
              </span>
              <span className="text-emerald-100 text-xs font-bold">• Lớp {currentClass.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Chào con yêu: {student?.full_name} ({student?.nickname})!
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-semibold mt-1">
              Hôm nay con hãy tích cực phát biểu và rèn luyện thật ngoan nhé!
            </p>
          </div>
        </div>

        {/* Big Star Point Display */}
        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-3xl border border-white/30 text-center shadow-lg">
          <span className="text-xs font-extrabold uppercase text-amber-200">Hoa Điểm Tốt Của Con</span>
          <div className="text-3xl sm:text-4xl font-black text-amber-300 flex items-center justify-center gap-1.5 mt-0.5">
            <Star className="fill-amber-300" size={32} /> {stars} ⭐
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={16} /> Trang Chủ Của Con
        </button>
        <button
          onClick={() => setActiveTab('co_oi')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'co_oi' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart size={16} /> Hòm Thư "Cô Ơi!"
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'games' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gamepad2 size={16} /> Vòng Quay & Trò Chơi
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'rewards' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trophy size={16} /> Bảng Vàng Khen Thưởng
        </button>
        <button
          onClick={() => setActiveTab('diary')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'diary' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Camera size={16} /> Nhật Ký Lớp Tôi
        </button>
      </div>

      {/* OVERVIEW TAB CONTENT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Action Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setActiveTab('co_oi')}
              className="bg-gradient-to-br from-rose-400 to-pink-500 text-white p-6 rounded-3xl shadow-lg text-left hover:scale-105 transition border-2 border-white group"
            >
              <span className="text-4xl group-hover:rotate-12 transition inline-block">💌</span>
              <h3 className="text-lg font-black mt-2">Hòm Thư "Cô Ơi!"</h3>
              <p className="text-xs text-rose-100 mt-1 font-semibold">Tâm sự riêng tư 1-1 với Cô giáo</p>
            </button>

            <button
              onClick={() => setActiveTab('games')}
              className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-3xl shadow-lg text-left hover:scale-105 transition border-2 border-white group"
            >
              <span className="text-4xl group-hover:rotate-12 transition inline-block">🎡</span>
              <h3 className="text-lg font-black mt-2">Quay May Mắn</h3>
              <p className="text-xs text-purple-100 mt-1 font-semibold">Vòng quay chọn học sinh & hộp quà</p>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className="bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 p-6 rounded-3xl shadow-lg text-left hover:scale-105 transition border-2 border-white group"
            >
              <span className="text-4xl group-hover:rotate-12 transition inline-block">⭐</span>
              <h3 className="text-lg font-black mt-2">Bảng Vàng Thi Đua</h3>
              <p className="text-xs text-slate-800 mt-1 font-semibold">Xem tổng số sao & danh hiệu</p>
            </button>

            <button
              onClick={() => setActiveTab('diary')}
              className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-6 rounded-3xl shadow-lg text-left hover:scale-105 transition border-2 border-white group"
            >
              <span className="text-4xl group-hover:rotate-12 transition inline-block">📸</span>
              <h3 className="text-lg font-black mt-2">Nhật Ký Lớp</h3>
              <p className="text-xs text-teal-100 mt-1 font-semibold">Thả tim ảnh sinh hoạt lớp mình</p>
            </button>
          </div>

          {/* Honor Badges Progress Box */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
            <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
              <Award className="text-amber-500" size={22} /> Huy Hiệu Danh Dự Đã Đạt Được
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {HONOR_BADGES.map(badge => {
                const unlocked = stars >= badge.minStars;
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border text-center transition ${
                      unlocked
                        ? 'border-amber-300 bg-amber-50/60 shadow-sm'
                        : 'border-slate-200 bg-slate-50 opacity-40 grayscale'
                    }`}
                  >
                    <span className="text-4xl">{badge.icon}</span>
                    <h4 className="font-extrabold text-xs text-slate-800 mt-2">{badge.name}</h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full inline-block mt-1 ${
                      unlocked ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {unlocked ? 'Đã đạt' : `Cần ${badge.minStars} ⭐`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB CONTENTS */}
      {activeTab === 'co_oi' && <CoOiInbox />}
      {activeTab === 'games' && <InteractiveGames />}
      {activeTab === 'rewards' && <RewardSystem />}
      {activeTab === 'diary' && <ClassDiary />}
    </div>
  );
};
