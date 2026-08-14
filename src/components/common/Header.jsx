import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClass } from '../../context/ClassContext';
import { formatDateVN } from '../../lib/helpers';
import { 
  GraduationCap, 
  Sparkles, 
  UserCheck, 
  Heart, 
  MessageCircle, 
  Award, 
  Gamepad2, 
  LogOut, 
  Users, 
  ShieldAlert,
  ChevronDown,
  Calendar
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const { profile, logout, switchDemoRole, isDemo } = useAuth();
  const { currentClass } = useClass();
  const location = useLocation();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const getRoleLabel = (role) => {
    switch (role) {
      case 'teacher': return { text: 'GVCN Lớp 4A', bg: 'bg-amber-400 text-slate-900', icon: '👩‍🏫' };
      case 'student': return { text: 'Học sinh', bg: 'bg-emerald-400 text-slate-900', icon: '🎒' };
      case 'parent': return { text: 'Phụ huynh', bg: 'bg-sky-400 text-slate-900', icon: '👨‍👩‍👧' };
      case 'admin': return { text: 'Quản trị viên', bg: 'bg-purple-400 text-slate-900', icon: '⚡' };
      default: return { text: 'Thành viên', bg: 'bg-slate-300 text-slate-800', icon: '👤' };
    }
  };

  const roleInfo = getRoleLabel(profile?.role);

  return (
    <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600 text-white shadow-lg sticky top-0 z-50">
      {/* Top Banner Bar - EdTech Reference Design */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between border-b border-emerald-600/50 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <span className="bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full font-bold text-xs flex items-center gap-1">
            <Sparkles size={13} /> TRƯỜNG TIỂU HỌC NGUYỄN BÁ NGỌC
          </span>
          <span className="hidden md:flex items-center gap-1 text-emerald-100">
            <Calendar size={13} /> {formatDateVN(new Date().toISOString())}
          </span>
        </div>

        {/* Live Role Switcher (For testing all perspectives seamlessly) */}
        <div className="flex items-center gap-2">
          {isDemo && (
            <div className="relative">
              <button 
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-400/40 text-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5 transition text-xs font-semibold"
              >
                <span className="text-sm">{roleInfo.icon}</span>
                <span>Chế độ: <strong className="text-amber-300">{roleInfo.text}</strong></span>
                <ChevronDown size={14} />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-pop-in">
                  <div className="px-3 py-1.5 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Chuyển đổi vai trò trải nghiệm
                  </div>
                  <button
                    onClick={() => { switchDemoRole('teacher'); setShowRoleMenu(false); }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold"
                  >
                    👩‍🏫 <span>Giáo viên (GVCN Cô Hoa)</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('student'); setShowRoleMenu(false); }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold"
                  >
                    🎒 <span>Học sinh (Bé Minh An)</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('parent'); setShowRoleMenu(false); }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold"
                  >
                    👨‍👩‍👧 <span>Phụ huynh (Bố Trần Nam)</span>
                  </button>
                  <button
                    onClick={() => { switchDemoRole('admin'); setShowRoleMenu(false); }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-semibold border-t border-slate-100"
                  >
                    ⚡ <span>Quản trị viên (Ban Giám Hiệu)</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 ml-2">
            <span className="font-semibold hidden lg:inline text-emerald-100">{profile?.full_name}</span>
            <button 
              onClick={logout}
              className="bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full transition"
              title="Đăng xuất"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Brand Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo & Class Info */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-white text-emerald-700 rounded-2xl flex items-center justify-center font-black text-2xl shadow-md transform group-hover:scale-105 transition">
            🏫
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              CÙNG CON TRƯỞNG THÀNH
              <span className="bg-amber-400 text-emerald-950 text-xs px-2 py-0.5 rounded-md font-extrabold uppercase">
                {currentClass.name}
              </span>
            </h1>
            <p className="text-xs text-emerald-200 font-medium">
              Hệ thống Quản lý Công tác Chủ nhiệm & Tương tác Lớp học Tiểu học
            </p>
          </div>
        </Link>

        {/* Quick Nav Badges */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-900/40 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Mã Lớp: <strong className="text-amber-300 font-mono">{currentClass.join_code}</strong></span>
          </div>
        </div>
      </div>
    </header>
  );
};
