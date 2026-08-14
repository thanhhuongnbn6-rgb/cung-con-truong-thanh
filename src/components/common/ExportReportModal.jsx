import React from 'react';
import { calculateBehaviorEvaluation, formatDateVN } from '../../lib/helpers';
import { Printer, X, Award, CheckCircle, Calendar, Star } from 'lucide-react';

export const ExportReportModal = ({ student, classInfo, attendanceRecords = [], rewards = [], onClose }) => {
  if (!student) return null;

  const totalStars = student.stars || 0;

  // Calculate attendance statistics
  const studentAttendance = attendanceRecords.filter(a => a.student_id === student.id);
  const presentCount = studentAttendance.filter(a => a.status === 'present').length;
  const lateCount = studentAttendance.filter(a => a.status === 'late').length;
  const excusedCount = studentAttendance.filter(a => a.status === 'excused').length;
  const unexcusedCount = studentAttendance.filter(a => a.status === 'unexcused').length;
  const totalDays = studentAttendance.length || 1;
  const attendanceRate = Math.round(((presentCount + lateCount) / totalDays) * 100);

  const evaluation = calculateBehaviorEvaluation(totalStars, attendanceRate);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative border border-slate-200 my-8">
        {/* Header Action Bar */}
        <div className="flex items-center justify-between border-b pb-4 mb-4 no-print">
          <div className="flex items-center gap-2">
            <Award className="text-amber-500" size={24} />
            <h3 className="font-black text-lg text-slate-800">Phiếu Đánh Giá Rèn Luyện Định Kỳ</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md transition"
            >
              <Printer size={16} /> In Phiếu / Xuất PDF
            </button>
            <button
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-xl transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE CONTENT AREA */}
        <div id="printable-report" className="space-y-6">
          {/* School Header */}
          <div className="text-center border-b-2 border-emerald-600 pb-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Trường Tiểu Học Phú Thọ - Năm Học 2025-2026</p>
            <h2 className="text-2xl font-black text-emerald-800 mt-1 uppercase">PHIẾU NHẬN XÉT RÈN LUYỆN HỌC SINH</h2>
            <p className="text-xs text-slate-600 italic">Theo Thông tư 27/2020/TT-BGDĐT Đánh giá Học sinh Tiểu học</p>
          </div>

          {/* Student Info Box */}
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 font-medium">Họ và tên học sinh:</span>
              <p className="font-extrabold text-slate-800 text-base">{student.full_name} ({student.nickname})</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Mã học sinh / Lớp:</span>
              <p className="font-extrabold text-slate-800 text-base">{student.student_code} - {classInfo?.name || 'Lớp 4A'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Giáo viên chủ nhiệm:</span>
              <p className="font-bold text-slate-700">{classInfo?.teacher_name || 'Cô Lê Thị Thanh Hương'}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Phụ huynh liên kết:</span>
              <p className="font-bold text-slate-700">{student.parent_name} ({student.parent_phone})</p>
            </div>
          </div>

          {/* Evaluation Banner */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${evaluation.color}`}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider">Mức Đánh Giá Rèn Luyện</span>
              <h4 className="text-xl font-black flex items-center gap-2 mt-0.5">
                <span>{evaluation.icon}</span> {evaluation.grade}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold">Danh hiệu vinh danh</span>
              <p className="font-bold text-sm">{evaluation.badge}</p>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-2 gap-4">
            {/* Attendance Stats */}
            <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50">
              <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-600" /> Tỷ lệ Chuyên Cần
              </h5>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600">{attendanceRate}%</span>
                <span className="text-xs text-slate-500">Có mặt {presentCount}/{totalDays} buổi</span>
              </div>
              <ul className="text-xs text-slate-600 mt-2 space-y-1">
                <li>• Đi muộn: <strong className="text-amber-600">{lateCount}</strong> buổi</li>
                <li>• Nghỉ có phép: <strong>{excusedCount}</strong> buổi</li>
                <li>• Nghỉ không phép: <strong className="text-red-600">{unexcusedCount}</strong> buổi</li>
              </ul>
            </div>

            {/* Reward Stars Breakdown */}
            <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50">
              <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Star size={14} className="text-amber-500" /> Tích Lũy Hoa Điểm Tốt
              </h5>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-500">{totalStars} ⭐</span>
                <span className="text-xs text-slate-500">Hoa điểm tốt</span>
              </div>
              <p className="text-xs text-slate-600 mt-2">
                Tích cực tham gia các hoạt động học tập tại lớp và rèn luyện tự giác làm việc nhà tại gia đình.
              </p>
            </div>
          </div>

          {/* Teacher Comment Section */}
          <div className="border border-slate-200 p-4 rounded-2xl bg-white">
            <h5 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">
              Nhận xét của Giáo viên Chủ nhiệm
            </h5>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "Bé {student.full_name} ngoan ngoãn, hăng hái phát biểu xây dựng bài trong các giờ học, biết giúp đỡ bạn bè xung quanh và giữ gìn vệ sinh chung rất tốt. Gia đình phối hợp tuyệt vời với nhà trường."
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 text-center pt-4 text-xs font-semibold text-slate-600">
            <div>
              <p className="uppercase text-slate-400">Ý kiến Phụ huynh</p>
              <div className="h-16"></div>
              <p>Ký tên & Ghi rõ họ tên</p>
            </div>
            <div>
              <p className="uppercase text-slate-400">Giáo viên chủ nhiệm</p>
              <div className="h-16"></div>
              <p className="font-bold text-emerald-800">{classInfo?.teacher_name || 'Cô Lê Thị Thanh Hương'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
