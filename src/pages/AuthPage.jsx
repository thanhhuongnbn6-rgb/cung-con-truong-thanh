import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { GraduationCap, Mail, Lock, User, Shield, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AuthPage = () => {
  const { loginWithEmail, registerUser, switchDemoRole } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('teacher');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await registerUser(email, password, fullName, role);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Thao tác không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (roleKey) => {
    switchDemoRole(roleKey);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden border border-emerald-400/30">
        
        {/* Left Branding Banner */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl font-black">🏫</div>

          <div>
            <div className="w-14 h-14 bg-white text-emerald-700 rounded-3xl flex items-center justify-center font-black text-3xl shadow-lg mb-6">
              🏫
            </div>
            <span className="bg-amber-400 text-slate-950 text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider">
              EDTECH TIỂU HỌC 2026
            </span>
            <h1 className="text-3xl font-black mt-3 leading-tight">CÙNG CON TRƯỞNG THÀNH</h1>
            <p className="text-xs sm:text-sm text-emerald-100 mt-2 leading-relaxed">
              Hệ thống Quản lý Công tác Chủ nhiệm & Tương tác Lớp học Tiểu học Thông minh (Lớp 1 đến Lớp 5).
            </p>
          </div>

          <div className="space-y-3 my-6 border-t border-emerald-500/40 pt-6">
            <div className="flex items-center gap-2.5 text-xs text-emerald-100 font-bold">
              <CheckCircle2 size={16} className="text-amber-400" /> Bảng điểm danh sơ đồ bàn học thời gian thực
            </div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-100 font-bold">
              <CheckCircle2 size={16} className="text-amber-400" /> Hệ thống Tích điểm mẹ vui & Hoa điểm tốt
            </div>
            <div className="flex items-center gap-2.5 text-xs text-emerald-100 font-bold">
              <CheckCircle2 size={16} className="text-amber-400" /> Hòm thư bí mật "Cô ơi!" bảo mật 1-1
            </div>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-400/30 text-xs">
            <p className="text-amber-300 font-extrabold mb-2 flex items-center gap-1">
              <Sparkles size={14} /> Truy cập nhanh không cần tạo tài khoản:
            </p>
            <div className="grid grid-cols-2 gap-1.5 font-bold">
              <button
                onClick={() => handleQuickDemoLogin('teacher')}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-2.5 py-1.5 rounded-xl transition text-left text-[11px] truncate"
              >
                👩‍🏫 GVCN Cô Hoa
              </button>
              <button
                onClick={() => handleQuickDemoLogin('student')}
                className="bg-emerald-400 hover:bg-emerald-500 text-slate-950 px-2.5 py-1.5 rounded-xl transition text-left text-[11px] truncate"
              >
                🎒 Học sinh Minh An
              </button>
              <button
                onClick={() => handleQuickDemoLogin('parent')}
                className="bg-sky-400 hover:bg-sky-500 text-slate-950 px-2.5 py-1.5 rounded-xl transition text-left text-[11px] truncate"
              >
                👨‍👩‍👧 Phụ huynh Trần Nam
              </button>
              <button
                onClick={() => handleQuickDemoLogin('admin')}
                className="bg-purple-400 hover:bg-purple-500 text-slate-950 px-2.5 py-1.5 rounded-xl transition text-left text-[11px] truncate"
              >
                ⚡ Admin BGH
              </button>
            </div>
          </div>
        </div>

        {/* Right Auth Form */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-black text-slate-800">
            {isRegister ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập Hệ Thống'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Vui lòng đăng nhập tài khoản Supabase Auth hoặc sử dụng nút truy cập nhanh.
          </p>

          {errorMsg && (
            <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-bold">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Họ Và Tên</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Cô Lê Thị Thanh Hương / Trần Minh An"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 bg-slate-50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Đăng Nhập</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="co.hoa@tieuhoc.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mật Khẩu</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vai Trò Hệ Thống</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-slate-50 focus:outline-none focus:border-emerald-500"
                >
                  <option value="teacher">👩‍🏫 Giáo viên chủ nhiệm (GVCN)</option>
                  <option value="student">🎒 Học sinh (Khối 1 - 5)</option>
                  <option value="parent">👨‍👩‍👧 Phụ huynh học sinh</option>
                  <option value="admin">⚡ Quản trị viên (Admin BGH)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm mt-2"
            >
              {loading ? 'Đang xử lý...' : isRegister ? 'Đăng Ký Tài Khoản' : 'Đăng Nhập'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center border-t pt-4">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              {isRegister ? 'Đã có tài khoản? Đăng nhập ngay' : 'Chưa có tài khoản? Đăng ký tại đây'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
