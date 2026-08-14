import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { useClass } from '../context/ClassContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { ShieldAlert, Users, Database, Sparkles, CheckCircle2, PlusCircle, UserCheck } from 'lucide-react';
import { CreateClassModal } from '../components/features/CreateClassModal';

export const AdminPanel = () => {
  const { switchDemoRole } = useAuth();
  const { currentClass, students } = useClass();
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);

  const [classList, setClassList] = useState([
    { id: 'c1', name: 'Lớp 4A', grade: 3, teacher: 'Cô Lê Thị Thanh Hương', count: 24, code: 'L4A-8899' },
    { id: 'c2', name: 'Lớp 1A2', grade: 1, teacher: 'Thầy Trần Văn Đức', count: 28, code: 'L1A2-1122' },
    { id: 'c3', name: 'Lớp 5A3', grade: 5, teacher: 'Cô Lê Thị Mai', count: 26, code: 'L5A3-5566' }
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black uppercase">
              BAN GIÁM HIỆU & ADMIN QUẢN TRỊ
            </span>
            <span className="text-purple-200 text-xs font-extrabold">• Hệ Thống Toàn Trường</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Quản Lý Hệ Thống Lớp Học Tiểu Học</h2>
          <p className="text-purple-200 text-xs sm:text-sm font-semibold mt-1">
            Quản trị tài khoản, danh sách lớp chủ nhiệm, cấu hình cơ sở dữ liệu Supabase & phân quyền RLS.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold flex items-center gap-2">
          <Database size={16} className="text-purple-300" />
          <span>Cơ sở dữ liệu: </span>
          <strong className={isSupabaseConfigured() ? 'text-emerald-400' : 'text-amber-300'}>
            {isSupabaseConfigured() ? 'Supabase DB Live' : 'Demo State Mode (Sẵn sàng chạy)'}
          </strong>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Tổng Lớp Chủ Nhiệm</span>
          <p className="text-3xl font-black text-slate-800 mt-1">{classList.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Tổng Học Sinh</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">78</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Giáo Viên Chủ Nhiệm</span>
          <p className="text-3xl font-black text-amber-500 mt-1">12</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Tài Khoản Phụ Huynh</span>
          <p className="text-3xl font-black text-sky-600 mt-1">75</p>
        </div>
      </div>

      {/* Quick Role Experience Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm">
        <h3 className="font-black text-slate-800 text-lg mb-2 flex items-center gap-2">
          <Sparkles className="text-purple-600" size={20} /> Thử Nghiệm Nhanh Giao Diện Theo Vai Trò
        </h3>
        <p className="text-xs text-slate-500 mb-4">Click để đóng vai các thành viên trong hệ thống để trải nghiệm thực tế:</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => switchDemoRole('teacher')}
            className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-left transition flex items-center gap-3"
          >
            <span className="text-3xl">👩‍🏫</span>
            <div>
              <h4 className="font-black text-sm text-emerald-900">Giáo Viên Chủ Nhiệm</h4>
              <p className="text-xs text-emerald-700">Điểm danh, chấm sao, trả lời "Cô ơi!"</p>
            </div>
          </button>

          <button
            onClick={() => switchDemoRole('student')}
            className="p-4 rounded-2xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-left transition flex items-center gap-3"
          >
            <span className="text-3xl">🎒</span>
            <div>
              <h4 className="font-black text-sm text-amber-900">Học Sinh (Bé Minh An)</h4>
              <p className="text-xs text-amber-700">Icon to, trò chơi quay thưởng, gửi tâm sự</p>
            </div>
          </button>

          <button
            onClick={() => switchDemoRole('parent')}
            className="p-4 rounded-2xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-left transition flex items-center gap-3"
          >
            <span className="text-3xl">👨‍👩‍👧</span>
            <div>
              <h4 className="font-black text-sm text-sky-900">Phụ Huynh Học Sinh</h4>
              <p className="text-xs text-sky-700">Theo dõi chuyên cần & gửi việc nhà</p>
            </div>
          </button>
        </div>
      </div>

      {/* Class List Management Table */}
      <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-slate-800 text-lg">Danh Sách Lớp Chủ Nhiệm Khối 1 - 5</h3>
          <button
            onClick={() => setShowCreateClassModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow transition"
          >
            <PlusCircle size={16} /> Khởi Tạo Lớp Mới & Sinh Mã QR
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-purple-50 text-purple-900 font-extrabold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3">Tên Lớp</th>
                <th className="p-3">Khối</th>
                <th className="p-3">GVCN</th>
                <th className="p-3">Sĩ Số</th>
                <th className="p-3">Mã Gia Nhập (Join Code)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {classList.map(cls => (
                <tr key={cls.id} className="hover:bg-purple-50/30">
                  <td className="p-3 font-extrabold text-slate-800">{cls.name}</td>
                  <td className="p-3">Khối {cls.grade}</td>
                  <td className="p-3 font-bold text-purple-700">{cls.teacher}</td>
                  <td className="p-3 font-bold">{cls.count} Học sinh</td>
                  <td className="p-3 font-mono font-bold text-amber-600">{cls.code}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateClassModal && (
        <CreateClassModal onClose={() => setShowCreateClassModal(false)} />
      )}
    </div>
  );
};
