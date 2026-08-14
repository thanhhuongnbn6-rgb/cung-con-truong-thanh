import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { FileSpreadsheet, Download, Upload, CheckCircle2, AlertCircle, X, Sparkles, UserPlus } from 'lucide-react';
import { triggerConfetti, playSoundEffect, AVATAR_COLORS } from '../../lib/helpers';

export const ImportStudentsModal = ({ onClose }) => {
  const { students, setStudents } = useClass();

  const [pastedData, setPastedData] = useState('');
  const [parsedList, setParsedList] = useState([]);
  const [importSuccess, setImportSuccess] = useState(false);

  // Sample CSV Template content
  const sampleCSV = `Họ và tên,Biệt danh,Mã học sinh,Tên phụ huynh,Số điện thoại
Nguyễn Văn An,Bé An,HS2026-020,Nguyễn Văn Bình,0912345678
Trần Thị Bích,Bích Bích,HS2026-021,Trần Văn Cường,0987654321
Lê Hoàng Cường,Bi Béo,HS2026-022,Lê Thị Dung,0933444555`;

  const handleDownloadSample = () => {
    const blob = new Blob(['\uFEFF' + sampleCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Danh_Sach_Hoc_Sinh_Mau.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseTextData = (text) => {
    if (!text.trim()) return [];
    const lines = text.trim().split(/\r?\n/);
    const results = [];

    lines.forEach((line, idx) => {
      // Ignore header row if it contains 'Họ và tên' or 'FullName'
      if (idx === 0 && (line.includes('Họ và tên') || line.includes('FullName') || line.includes('Biệt danh'))) {
        return;
      }

      // Split by tab (Excel copy) or comma (CSV)
      const cols = line.includes('\t') ? line.split('\t') : line.split(',');
      if (cols.length >= 1 && cols[0].trim()) {
        const fullName = cols[0].trim();
        const nickname = cols[1] ? cols[1].trim() : fullName.split(' ').pop();
        const studentCode = cols[2] ? cols[2].trim() : `HS2026-${(students.length + results.length + 1).toString().padStart(3, '0')}`;
        const parentName = cols[3] ? cols[3].trim() : `Phụ huynh em ${fullName.split(' ').pop()}`;
        const parentPhone = cols[4] ? cols[4].trim() : '0900 000 000';

        results.push({
          id: `s-imp-${Date.now()}-${idx}`,
          full_name: fullName,
          nickname: nickname,
          student_code: studentCode,
          parent_name: parentName,
          parent_phone: parentPhone,
          avatar_color: AVATAR_COLORS[(students.length + results.length) % AVATAR_COLORS.length],
          seat: students.length + results.length + 1,
          stars: 10
        });
      }
    });

    return results;
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setPastedData(text);
    const parsed = parseTextData(text);
    setParsedList(parsed);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      setPastedData(content);
      const parsed = parseTextData(content);
      setParsedList(parsed);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedList.length === 0) return;

    setStudents(prev => [...prev, ...parsedList]);
    setImportSuccess(true);
    triggerConfetti();
    playSoundEffect('win');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl border border-slate-200 animate-pop-in my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="text-emerald-600" size={24} />
            <h3 className="font-black text-slate-800 text-lg">Import Học Sinh Hàng Loạt Từ Excel / CSV</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl">
            <X size={20} />
          </button>
        </div>

        {importSuccess ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 size={64} className="mx-auto text-emerald-500 animate-bounce" />
            <h4 className="text-2xl font-black text-slate-800">Đã Import {parsedList.length} Học Sinh Thành Công!</h4>
            <p className="text-xs text-slate-500">Tài khoản học sinh và phân xếp bàn học đã tự động cập nhật.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Template Download Bar */}
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-xs text-emerald-900">Mẫu Địng Dạng File Import</h4>
                <p className="text-[11px] text-emerald-700">Các cột: Họ tên, Biệt danh, Mã HS, Tên phụ huynh, Số điện thoại</p>
              </div>
              <button
                onClick={handleDownloadSample}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow transition"
              >
                <Download size={15} /> Tải File Mẫu (.CSV)
              </button>
            </div>

            {/* Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                1. Tải Lên File (.csv / .txt) Hoặc Dán Dữ Liệu Từ Excel
              </label>

              <div className="flex items-center gap-2 mb-2">
                <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer border border-slate-200 flex items-center gap-1.5 transition">
                  <Upload size={15} /> Chọn File Từ Máy Tính
                  <input type="file" accept=".csv, .txt, .tsv" onChange={handleFileUpload} className="hidden" />
                </label>
                <span className="text-xs text-slate-400">hoặc dán trực tiếp bên dưới:</span>
              </div>

              <textarea
                value={pastedData}
                onChange={handleTextChange}
                placeholder="Dán hàng danh sách từ Excel vào đây...&#10;Ví dụ: Nguyễn Văn An, Bé An, HS2026-020, Nguyễn Văn Bình, 0912345678"
                className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500 bg-slate-50 h-28"
              ></textarea>
            </div>

            {/* Parsed Preview Table */}
            {parsedList.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    2. Xem Trước Danh Sách Tìm Thấy ({parsedList.length} học sinh)
                  </span>
                  <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                    <CheckCircle2 size={14} /> Sẵn sàng Import
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-2xl bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 font-bold uppercase text-[10px] text-slate-500 sticky top-0 border-b">
                      <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Họ và Tên</th>
                        <th className="p-2">Biệt danh</th>
                        <th className="p-2">Mã HS</th>
                        <th className="p-2">Phụ huynh</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {parsedList.map((st, i) => (
                        <tr key={st.id} className="hover:bg-emerald-50/40">
                          <td className="p-2 font-bold text-slate-400">{i + 1}</td>
                          <td className="p-2 font-bold text-slate-800">{st.full_name}</td>
                          <td className="p-2 text-slate-600">{st.nickname}</td>
                          <td className="p-2 font-mono text-emerald-700 font-bold">{st.student_code}</td>
                          <td className="p-2 text-slate-500">{st.parent_name} ({st.parent_phone})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Confirm Submit */}
            <button
              onClick={handleConfirmImport}
              disabled={parsedList.length === 0}
              className={`w-full py-3.5 rounded-2xl text-xs font-black shadow-lg flex items-center justify-center gap-2 transition ${
                parsedList.length > 0
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <UserPlus size={18} /> Xác Nhận Import {parsedList.length} Học Sinh VÀO LỚP 4A
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
