import React from 'react';
import { 
  UserCheck, 
  Award, 
  Heart, 
  MessageCircle, 
  Camera, 
  Gamepad2, 
  BarChart3, 
  ShieldCheck 
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, role }) => {
  const navItems = [
    { id: 'attendance', label: 'Điểm Danh Lớp Học', icon: UserCheck, roles: ['teacher', 'admin'] },
    { id: 'rewards', label: 'Tích Điểm Mẹ Vui', icon: Award, roles: ['teacher', 'student', 'parent', 'admin'] },
    { id: 'co_oi', label: 'Hộp Thư "Cô Ơi!"', icon: Heart, roles: ['teacher', 'student', 'admin'], badge: '1-1' },
    { id: 'chat', label: 'Bảng Tin & Trò Chuyện', icon: MessageCircle, roles: ['teacher', 'parent', 'admin'] },
    { id: 'diary', label: 'Nhật Ký Lớp Tôi', icon: Camera, roles: ['teacher', 'student', 'parent', 'admin'] },
    { id: 'games', label: 'Trò Chơi Đầu Giờ', icon: Gamepad2, roles: ['teacher', 'student', 'admin'] },
    { id: 'analytics', label: 'Thống Kê & Báo Cáo', icon: BarChart3, roles: ['teacher', 'parent', 'admin'] },
  ];

  const visibleItems = navItems.filter(item => item.roles.includes(role));

  return (
    <nav className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-3 flex flex-row md:flex-col gap-1.5 overflow-x-auto scrollbar-none sticky top-20">
      {visibleItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 translate-x-1'
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-white' : 'text-emerald-600'} />
            <span>{item.label}</span>
            {item.badge && (
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                isActive ? 'bg-emerald-800 text-amber-300' : 'bg-amber-100 text-amber-800'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
