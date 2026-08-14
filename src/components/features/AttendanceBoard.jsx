import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Users, 
  UserCheck, 
  Send, 
  Search, 
  Grid, 
  List,
  FileText,
  PlusCircle,
  FileSpreadsheet,
  QrCode
} from 'lucide-react';
import { formatDateVN } from '../../lib/helpers';
import { CreateClassModal } from './CreateClassModal';
import { ImportStudentsModal } from './ImportStudentsModal';

export const AttendanceBoard = () => {
  const { students, attendance, markAttendance, currentClass } = useClass();
  const { profile } = useAuth();

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' seating chart or 'list'
  const [activeNoteModal, setActiveNoteModal] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showImportStudentsModal, setShowImportStudentsModal] = useState(false);

  const dayAttendance = attendance[selectedDate] || {};

  // Filter students
  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const totalStudents = students.length;
  const presentCount = students.filter(s => (dayAttendance[s.id]?.status || 'present') === 'present').length;
  const lateCount = students.filter(s => dayAttendance[s.id]?.status === 'late').length;
  const excusedCount = students.filter(s => dayAttendance[s.id]?.status === 'excused').length;
  const unexcusedCount = students.filter(s => dayAttendance[s.id]?.status === 'unexcused').length;

  const handleStatusChange = (studentId, newStatus) => {
    const currentNote = dayAttendance[studentId]?.note || '';
    markAttendance(studentId, newStatus, currentNote);
  };

  const handleOpenNote = (student) => {
    setActiveNoteModal(student);
    setNoteText(dayAttendance[student.id]?.note || '');
  };

  const handleSaveNote = () => {
    if (activeNoteModal) {
      const currentStatus = dayAttendance[activeNoteModal.id]?.status || 'present';
      markAttendance(activeNoteModal.id, currentStatus, noteText);
      setActiveNoteModal(null);
    }
  };

  const handleSendParentNotification = () => {
    setNotifySuccess(true);
    setTimeout(() => setNotifySuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Live Stats */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-10 font-black text-9xl">🏫</div>
        
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full text-xs font-black uppercase">
                BẢNG ĐIỂM DANH HẰNG NGÀY
              </span>
              <span className="text-emerald-200 text-xs font-bold">• {formatDateVN(selectedDate)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Sơ Đồ & Chuyên Cần Lớp {currentClass.name}</h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              Điểm danh trực quan theo sơ đồ bàn học, tự động cập nhật đến ứng dụng Phụ huynh.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCreateClassModal(true)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition"
            >
              <PlusCircle size={15} /> Tạo Lớp Mới (QR)
            </button>
            <button
              onClick={() => setShowImportStudentsModal(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow border border-white/30 transition"
            >
              <FileSpreadsheet size={15} /> Import Excel Học Sinh
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-emerald-900/60 border border-emerald-400/40 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none"
            />
            <button
              onClick={handleSendParentNotification}
              className="bg-emerald-950 hover:bg-emerald-900 text-amber-300 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition"
            >
              <Send size={15} /> Gửi Thông Báo Phụ Huynh
            </button>
          </div>
        </div>

        {/* Realtime Attendance Cards Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 relative z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center">
            <span className="text-xs text-emerald-200 font-semibold">Tổng Sĩ Số</span>
            <p className="text-2xl font-black text-white">{totalStudents}</p>
          </div>
          <div className="bg-emerald-500/30 backdrop-blur-md rounded-2xl p-3 border border-emerald-400/30 text-center">
            <span className="text-xs text-emerald-200 font-semibold">Có Mặt</span>
            <p className="text-2xl font-black text-emerald-300">{presentCount}</p>
          </div>
          <div className="bg-amber-500/30 backdrop-blur-md rounded-2xl p-3 border border-amber-400/30 text-center">
            <span className="text-xs text-amber-200 font-semibold">Đi Muộn</span>
            <p className="text-2xl font-black text-amber-300">{lateCount}</p>
          </div>
          <div className="bg-sky-500/30 backdrop-blur-md rounded-2xl p-3 border border-sky-400/30 text-center">
            <span className="text-xs text-sky-200 font-semibold">Nghỉ Có Phép</span>
            <p className="text-2xl font-black text-sky-300">{excusedCount}</p>
          </div>
          <div className="bg-red-500/30 backdrop-blur-md rounded-2xl p-3 border border-red-400/30 text-center col-span-2 sm:col-span-1">
            <span className="text-xs text-red-200 font-semibold">Nghỉ Không Phép</span>
            <p className="text-2xl font-black text-red-300">{unexcusedCount}</p>
          </div>
        </div>

        {notifySuccess && (
          <div className="mt-3 bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-between animate-pop-in">
            <span>✅ Đã gửi thông báo tình trạng chuyên cần tới toàn bộ Phụ huynh qua ứng dụng!</span>
          </div>
        )}
      </div>

      {/* Control Bar: Search & View Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh, biệt danh, mã HS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Grid size={16} /> Sơ Đồ Bàn Học
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <List size={16} /> Danh Sách Cụ Thể
          </button>
        </div>
      </div>

      {/* SEATING CHART GRID VIEW */}
      {viewMode === 'grid' ? (
        <div>
          {/* Black Board Classroom Header Simulation */}
          <div className="bg-emerald-950 text-emerald-200 rounded-t-2xl py-3 text-center text-xs font-extrabold uppercase tracking-widest border-b-4 border-amber-400">
            🟩 BẢNG LỚP HỌC (BÀN GIÁO VIÊN BÊN TRÊN)
          </div>

          <div className="bg-emerald-50/40 p-6 rounded-b-2xl border border-emerald-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStudents.map((student) => {
              const currentAtt = dayAttendance[student.id] || { status: 'present', note: '' };
              const status = currentAtt.status;

              return (
                <div
                  key={student.id}
                  className={`bg-white rounded-2xl p-4 border-2 transition-all shadow-sm hover:shadow-md relative flex flex-col justify-between ${
                    status === 'present'
                      ? 'border-emerald-400 bg-emerald-50/20'
                      : status === 'late'
                      ? 'border-amber-400 bg-amber-50/30'
                      : status === 'excused'
                      ? 'border-sky-400 bg-sky-50/30'
                      : 'border-red-400 bg-red-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      Bàn #{student.seat}
                    </span>

                    <button
                      onClick={() => handleOpenNote(student)}
                      className={`text-xs p-1 rounded-lg transition ${
                        currentAtt.note ? 'text-amber-600 bg-amber-100' : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={currentAtt.note || 'Thêm ghi chú điểm danh'}
                    >
                      <FileText size={14} />
                    </button>
                  </div>

                  {/* Student Info */}
                  <div className="text-center my-3">
                    <div
                      className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white font-black text-base shadow-sm mb-2"
                      style={{ backgroundColor: student.avatar_color }}
                    >
                      {student.full_name.charAt(0)}
                    </div>
                    <h4 className="font-extrabold text-sm text-slate-800 line-clamp-1">{student.full_name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">"{student.nickname}" • {student.student_code}</p>
                    {currentAtt.note && (
                      <p className="text-[11px] text-amber-700 italic mt-1 line-clamp-1 bg-amber-100/60 rounded px-1">
                        📝 {currentAtt.note}
                      </p>
                    )}
                  </div>

                  {/* Status Toggle Bar */}
                  <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => handleStatusChange(student.id, 'present')}
                      className={`py-1 rounded-lg text-[10px] font-black transition ${
                        status === 'present' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:bg-white'
                      }`}
                      title="Có mặt"
                    >
                      Có mặt
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'late')}
                      className={`py-1 rounded-lg text-[10px] font-black transition ${
                        status === 'late' ? 'bg-amber-500 text-white shadow' : 'text-slate-600 hover:bg-white'
                      }`}
                      title="Đi muộn"
                    >
                      Muộn
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'excused')}
                      className={`py-1 rounded-lg text-[10px] font-black transition ${
                        status === 'excused' ? 'bg-sky-500 text-white shadow' : 'text-slate-600 hover:bg-white'
                      }`}
                      title="Có phép"
                    >
                      Có phép
                    </button>
                    <button
                      onClick={() => handleStatusChange(student.id, 'unexcused')}
                      className={`py-1 rounded-lg text-[10px] font-black transition ${
                        status === 'unexcused' ? 'bg-red-500 text-white shadow' : 'text-slate-600 hover:bg-white'
                      }`}
                      title="Không phép"
                    >
                      K.Phép
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-emerald-50 text-emerald-900 font-extrabold uppercase text-[11px] tracking-wider border-b border-emerald-100">
                <tr>
                  <th className="p-3">Mã HS</th>
                  <th className="p-3">Họ Và Tên</th>
                  <th className="p-3">Biệt Danh</th>
                  <th className="p-3 text-center">Trạng Thái Điểm Danh</th>
                  <th className="p-3">Ghi Chú Chi Tiết</th>
                  <th className="p-3 text-right">Phụ Huynh Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => {
                  const currentAtt = dayAttendance[student.id] || { status: 'present', note: '' };
                  return (
                    <tr key={student.id} className="hover:bg-emerald-50/30 transition">
                      <td className="p-3 font-mono font-bold text-slate-600">{student.student_code}</td>
                      <td className="p-3 font-extrabold text-slate-800">{student.full_name}</td>
                      <td className="p-3 text-slate-600">{student.nickname}</td>
                      <td className="p-3 text-center">
                        <div className="inline-flex gap-1 bg-slate-100 p-1 rounded-xl">
                          <button
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              currentAtt.status === 'present' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                            }`}
                          >
                            Có mặt
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              currentAtt.status === 'late' ? 'bg-amber-500 text-white' : 'text-slate-600'
                            }`}
                          >
                            Đi muộn
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'excused')}
                            className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              currentAtt.status === 'excused' ? 'bg-sky-500 text-white' : 'text-slate-600'
                            }`}
                          >
                            Có phép
                          </button>
                          <button
                            onClick={() => handleStatusChange(student.id, 'unexcused')}
                            className={`px-2 py-1 rounded-lg text-xs font-bold ${
                              currentAtt.status === 'unexcused' ? 'bg-red-500 text-white' : 'text-slate-600'
                            }`}
                          >
                            K.Phép
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleOpenNote(student)}
                          className="text-xs text-amber-700 font-medium hover:underline flex items-center gap-1"
                        >
                          <FileText size={13} /> {currentAtt.note || 'Thêm ghi chú...'}
                        </button>
                      </td>
                      <td className="p-3 text-right text-xs text-slate-600">
                        {student.parent_name} ({student.parent_phone})
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {activeNoteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-pop-in">
            <h3 className="font-extrabold text-slate-800 text-base mb-1">
              Ghi Chú Điểm Danh: {activeNoteModal.full_name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">Nhập lý do đi muộn / nghỉ học để gửi cho Phụ huynh:</p>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="VD: Đi khám răng đến 8h15; Gia đình xin nghỉ sốt nhẹ..."
              className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 h-28"
            ></textarea>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setActiveNoteModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md"
              >
                Lưu Ghi Chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Class Modal */}
      {showCreateClassModal && (
        <CreateClassModal onClose={() => setShowCreateClassModal(false)} />
      )}

      {/* Import Students Modal */}
      {showImportStudentsModal && (
        <ImportStudentsModal onClose={() => setShowImportStudentsModal(false)} />
      )}
    </div>
  );
};
