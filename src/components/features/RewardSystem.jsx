import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { useAuth } from '../../context/AuthContext';
import { HONOR_BADGES } from '../../lib/helpers';
import { 
  Star, 
  Award, 
  Trophy, 
  CheckCircle, 
  PlusCircle, 
  Home, 
  BookOpen, 
  Smile, 
  Gift, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export const RewardSystem = () => {
  const { students, rewards, awardPoints, approveParentReward, currentClass } = useClass();
  const { profile } = useAuth();

  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'award' | 'parent_requests' | 'badges'
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [starPoints, setStarPoints] = useState(5);
  const [category, setCategory] = useState('academic');
  const [reason, setReason] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Pending parent requests
  const pendingRequests = rewards.filter(r => r.status === 'pending');

  // Sorted leaderboard
  const leaderboard = [...students].sort((a, b) => b.stars - a.stars);

  const handleAwardSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const isParentRole = profile?.role === 'parent';
    const recipientId = isParentRole ? (profile.linked_student_id || selectedStudentId) : selectedStudentId;

    awardPoints(
      recipientId,
      starPoints,
      category,
      reason,
      profile?.full_name || 'GVCN',
      isParentRole
    );

    setSuccessToast(
      isParentRole
        ? '🎉 Đã gửi đề xuất tích điểm tại nhà cho Cô giáo phê duyệt!'
        : '⭐ Đã cộng hoa điểm tốt cho học sinh thành công!'
    );
    setReason('');
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-950 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 font-black">⭐</div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-amber-300 px-3 py-0.5 rounded-full text-xs font-black uppercase">
                TÍCH ĐIỂM MẸ VUI & HOA ĐIỂM TỐT
              </span>
              <span className="text-slate-900 text-xs font-extrabold">• Lớp {currentClass.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Đổi Điểm Thưởng & Vinh Danh Rèn Luyện</h2>
            <p className="text-slate-900 text-xs sm:text-sm font-semibold mt-1">
              Hệ thống động viên học sinh tích lũy hoa điểm tốt tại lớp và ghi nhận việc nhà ngoan ngoãn từ phụ huynh.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('award')}
            className="bg-slate-950 hover:bg-slate-800 text-amber-300 px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition"
          >
            <PlusCircle size={18} /> {profile?.role === 'parent' ? 'Gửi Đề Xuất Tại Nhà' : 'Cộng Hoa Điểm Tốt'}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'leaderboard' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Trophy size={16} /> Bảng Xếp Hạng Vàng
        </button>

        <button
          onClick={() => setActiveTab('award')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'award' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Star size={16} /> {profile?.role === 'parent' ? 'Tích Điểm Mẹ Vui (Tại Nhà)' : 'Chấm Điểm Rèn Luyện'}
        </button>

        {(profile?.role === 'teacher' || profile?.role === 'admin') && (
          <button
            onClick={() => setActiveTab('parent_requests')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 relative transition ${
              activeTab === 'parent_requests' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Home size={16} /> Đề Xuất Phụ Huynh
            {pendingRequests.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>
        )}

        <button
          onClick={() => setActiveTab('badges')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'badges' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gift size={16} /> Kho Huy Hiệu & Đổi Quà
        </button>
      </div>

      {successToast && (
        <div className="bg-emerald-500 text-white font-bold p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between shadow-lg animate-pop-in">
          <span>{successToast}</span>
        </div>
      )}

      {/* TAB 1: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top 3 Podium Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {leaderboard.slice(0, 3).map((st, idx) => {
              const medals = ['🥇 Hạng 1 (Bạch Kim)', '🥈 Hạng 2 (Vàng)', '🥉 Hạng 3 (Bạc)'];
              const borders = ['border-amber-400 bg-amber-50/50', 'border-slate-300 bg-slate-50', 'border-amber-600/30 bg-amber-50/20'];
              return (
                <div key={st.id} className={`rounded-3xl p-5 border-2 ${borders[idx]} shadow-md text-center relative overflow-hidden`}>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-900 text-amber-300 inline-block mb-3">
                    {medals[idx]}
                  </span>
                  <div
                    className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white font-black text-2xl shadow-md mb-2"
                    style={{ backgroundColor: st.avatar_color }}
                  >
                    {st.full_name.charAt(0)}
                  </div>
                  <h4 className="font-black text-slate-900 text-base">{st.full_name}</h4>
                  <p className="text-xs text-slate-500 font-bold">"{st.nickname}" • {st.student_code}</p>
                  <div className="mt-3 bg-amber-400/90 text-slate-950 font-black py-1.5 px-4 rounded-2xl inline-flex items-center gap-1.5 shadow">
                    <Star size={16} className="fill-slate-950" /> {st.stars} Hoa Điểm Tốt
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Class Ranking Table */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
            <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
              <Trophy className="text-amber-500" size={20} /> Bảng Vinh Danh Chăm Ngoan Cả Lớp
            </h3>

            <div className="divide-y divide-slate-100">
              {leaderboard.map((student, rank) => (
                <div key={student.id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 rounded-xl px-2 transition">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      rank < 3 ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                    }`}>
                      #{rank + 1}
                    </span>

                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: student.avatar_color }}
                    >
                      {student.full_name.charAt(0)}
                    </div>

                    <div>
                      <h5 className="font-extrabold text-sm text-slate-800">{student.full_name} ({student.nickname})</h5>
                      <p className="text-xs text-slate-400">Mã: {student.student_code}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-black text-amber-500 text-base flex items-center gap-1">
                      {student.stars} ⭐
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AWARD FORM */}
      {activeTab === 'award' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm max-w-2xl mx-auto">
          <h3 className="font-black text-slate-800 text-xl mb-1 flex items-center gap-2">
            <Star className="text-amber-500" size={24} /> 
            {profile?.role === 'parent' ? 'Gửi Đề Xuất Tích Điểm Tại Nhà ("Tích Điểm Mẹ Vui")' : 'Chấm Hoa Điểm Tốt Cho Học Sinh'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {profile?.role === 'parent' 
              ? 'Phụ huynh chọn hoạt động làm việc nhà, tự học bài để gửi đề xuất cho Cô giáo xác nhận.'
              : 'Giáo viên thưởng hoa điểm tốt khen ngợi tinh thần học tập và rèn luyện của học sinh.'}
          </p>

          <form onSubmit={handleAwardSubmit} className="space-y-4">
            {/* Student Picker (If Teacher or Admin) */}
            {profile?.role !== 'parent' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chọn Học Sinh Nhận Thưởng</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold bg-slate-50 focus:outline-none focus:border-amber-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.full_name} ({s.nickname}) - Mã: {s.student_code} (Hiện có: {s.stars} ⭐)
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900 font-bold">
                👧 Áp dụng tích điểm tại nhà cho học sinh: <strong>Trần Minh An (Bé Bông)</strong>
              </div>
            )}

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Danh Mục Đóng Góp</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('academic')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                    category === 'academic' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <BookOpen size={18} className="text-amber-500" />
                  <span>Học Tập Xấu Hoắc</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('behavior')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                    category === 'behavior' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Smile size={18} className="text-amber-500" />
                  <span>Ngoan Ngoãn/Vệ Sinh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('home_chore')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                    category === 'home_chore' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Home size={18} className="text-amber-500" />
                  <span>Việc Nhà Tại Gia</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('custom')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition ${
                    category === 'custom' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <Sparkles size={18} className="text-amber-500" />
                  <span>Khen Khác</span>
                </button>
              </div>
            </div>

            {/* Star Points count selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Số Hoa Điểm Tốt Thưởng (+)</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5, 10].map(pt => (
                  <button
                    key={pt}
                    type="button"
                    onClick={() => setStarPoints(pt)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition ${
                      starPoints === pt ? 'bg-amber-400 text-slate-950 border-amber-400 shadow' : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    +{pt} ⭐
                  </button>
                ))}
              </div>
            </div>

            {/* Reason text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lý Do Thưởng Cụ Thể</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="VD: Tự giác học bài, giúp mẹ dọn nhà, phát biểu hăng hái..."
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-amber-500 bg-slate-50"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-black py-3 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <Star size={18} className="fill-slate-950" /> 
              {profile?.role === 'parent' ? 'Gửi Đề Xuất Cho Cô Giáo' : 'Xác Nhận Thưởng Hoa Điểm Tốt'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: PARENT PENDING REQUESTS REVIEW */}
      {activeTab === 'parent_requests' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
          <h3 className="font-black text-slate-800 text-lg mb-4 flex items-center gap-2">
            <Home className="text-amber-500" size={20} /> Duyệt Đề Xuất "Tích Điểm Mẹ Vui" Từ Phụ Huynh
          </h3>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle size={48} className="mx-auto mb-2 opacity-30 text-emerald-600" />
              <p className="font-bold text-sm">Hiện không có đề xuất điểm thưởng nào chờ phê duyệt.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map(req => {
                const targetStudent = students.find(s => s.id === req.student_id);
                return (
                  <div key={req.id} className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">
                          +{req.points} ⭐ Mẹ gửi
                        </span>
                        <span className="font-bold text-xs text-slate-700">Học sinh: <strong>{targetStudent?.full_name}</strong></span>
                      </div>
                      <p className="font-extrabold text-sm text-slate-800 mt-1">{req.reason}</p>
                      <p className="text-[11px] text-slate-400">Đề xuất bởi: {req.awarded_by}</p>
                    </div>

                    <button
                      onClick={() => approveParentReward(req.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition"
                    >
                      Duyệt Cộng ⭐
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BADGES KIOSK */}
      {activeTab === 'badges' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
          <h3 className="font-black text-slate-800 text-lg mb-1 flex items-center gap-2">
            <Gift className="text-amber-500" size={20} /> Kho Huy Hiệu Danh Dự & Phiếu Đổi Quà
          </h3>
          <p className="text-xs text-slate-500 mb-6">Các mốc huy hiệu tự động mở khóa khi học sinh đạt đủ số hoa điểm tốt.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HONOR_BADGES.map(badge => (
              <div key={badge.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <div className="text-4xl">{badge.icon}</div>
                <div>
                  <h4 className="font-black text-slate-800 text-sm">{badge.name}</h4>
                  <p className="text-xs text-slate-500">{badge.desc}</p>
                  <span className="inline-block mt-2 bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    Cần {badge.minStars} ⭐ Hoa điểm tốt
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
