import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { calculateBehaviorEvaluation } from '../../lib/helpers';
import { ExportReportModal } from '../common/ExportReportModal';
import { 
  BarChart3, 
  Printer, 
  Search, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  FileText 
} from 'lucide-react';

export const AnalyticsReport = () => {
  const { students, attendance, rewards, currentClass } = useClass();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);

  const filteredStudents = students.filter(s =>
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Overall class statistics
  const totalStudents = students.length;
  const goodBehaviorCount = students.filter(s => calculateBehaviorEvaluation(s.stars).grade === 'Hoàn thành tốt').length;
  const passBehaviorCount = students.filter(s => calculateBehaviorEvaluation(s.stars).grade === 'Hoàn thành').length;
  const needEffortCount = students.filter(s => calculateBehaviorEvaluation(s.stars).grade === 'Cần cố gắng').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 font-black">📊</div>

        <div className="flex items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black uppercase">
                THỐNG KÊ & BÁO CÁO RÈN LUYỆN
              </span>
              <span className="text-emerald-100 text-xs font-extrabold">• Lớp {currentClass.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Phân Loại Rèn Luyện & Xuất Phiếu Định Kỳ</h2>
            <p className="text-emerald-100 text-xs sm:text-sm font-semibold mt-1">
              Đánh giá tổng hợp theo tiêu chuẩn Thông tư 27/2020/TT-BGDĐT Đánh giá Học sinh Tiểu học.
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm text-center">
          <span className="text-xs font-bold text-slate-400 uppercase">Tổng Số Học Sinh</span>
          <p className="text-3xl font-black text-slate-800 mt-1">{totalStudents}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-sm text-center">
          <span className="text-xs font-bold text-emerald-700 uppercase">Hoàn Thành Tốt</span>
          <p className="text-3xl font-black text-emerald-600 mt-1">{goodBehaviorCount}</p>
          <span className="text-[10px] font-bold text-emerald-800">🌟 Ngôi Sao Chăm Ngoan</span>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 shadow-sm text-center">
          <span className="text-xs font-bold text-blue-700 uppercase">Hoàn Thành</span>
          <p className="text-3xl font-black text-blue-600 mt-1">{passBehaviorCount}</p>
          <span className="text-[10px] font-bold text-blue-800">👍 Chăm Ngoan Đạt Yêu Cầu</span>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm text-center">
          <span className="text-xs font-bold text-amber-700 uppercase">Cần Cố Gắng</span>
          <p className="text-3xl font-black text-amber-600 mt-1">{needEffortCount}</p>
          <span className="text-[10px] font-bold text-amber-800">🌱 Cần Rèn Luyện Thêm</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh, biệt danh để xem báo cáo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Students Evaluation Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => {
          const evalRes = calculateBehaviorEvaluation(student.stars);
          return (
            <div key={student.id} className="bg-white rounded-3xl p-5 border border-emerald-100 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${evalRes.color}`}>
                    {evalRes.icon} {evalRes.grade}
                  </span>
                  <span className="font-black text-amber-500 text-sm">{student.stars} ⭐</span>
                </div>

                <div className="flex items-center gap-3 my-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-base shadow"
                    style={{ backgroundColor: student.avatar_color }}
                  >
                    {student.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{student.full_name}</h4>
                    <p className="text-xs text-slate-400 font-medium">"{student.nickname}" • Mã: {student.student_code}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  Phụ huynh: <strong>{student.parent_name}</strong> ({student.parent_phone})
                </p>
              </div>

              <button
                onClick={() => setSelectedStudentForReport(student)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition flex items-center justify-center gap-1.5"
              >
                <Printer size={15} /> In Phiếu Nhận Xét Định Kỳ
              </button>
            </div>
          );
        })}
      </div>

      {/* Printable Evaluation Modal */}
      {selectedStudentForReport && (
        <ExportReportModal
          student={selectedStudentForReport}
          classInfo={currentClass}
          attendanceRecords={Object.values(attendance).flatMap(day => Object.values(day))}
          rewards={rewards}
          onClose={() => setSelectedStudentForReport(null)}
        />
      )}
    </div>
  );
};
