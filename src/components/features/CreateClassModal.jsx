import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { QrCode, Sparkles, X, Printer, Copy, Check, PlusCircle } from 'lucide-react';
import { triggerConfetti, playSoundEffect } from '../../lib/helpers';

export const CreateClassModal = ({ onClose, onClassCreated }) => {
  const { addClass } = useClass();

  const [className, setClassName] = useState('Lớp 4B');
  const [gradeLevel, setGradeLevel] = useState(4);
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [createdClass, setCreatedClass] = useState(null);
  const [copied, setCopied] = useState(false);

  const generateJoinCode = (cName) => {
    const prefix = cName.replace(/\s+/g, '').toUpperCase().slice(0, 3);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${randomChars}`.slice(0, 6);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const joinCode = generateJoinCode(className);
    const newClassObj = {
      id: `class-${Date.now()}`,
      name: className,
      grade_level: Number(gradeLevel),
      academic_year: academicYear,
      join_code: joinCode,
      teacher_name: 'Cô Lê Thị Thanh Hương'
    };

    if (addClass) {
      addClass(newClassObj);
    }
    setCreatedClass(newClassObj);
    triggerConfetti();
    playSoundEffect('win');
    if (onClassCreated) onClassCreated(newClassObj);
  };

  const handleCopyCode = () => {
    if (createdClass) {
      navigator.clipboard.writeText(createdClass.join_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePrintQR = () => {
    window.print();
  };

  const qrUrl = createdClass
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        `https://cung-con-truong-thanh.vercel.app/join?code=${createdClass.join_code}`
      )}&color=059669&format=png`
    : '';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-pop-in my-8">
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center gap-2">
            <PlusCircle className="text-emerald-600" size={24} />
            <h3 className="font-black text-slate-800 text-lg">Khởi Tạo Lớp Học Mới & Sinh QR Code</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-xl">
            <X size={20} />
          </button>
        </div>

        {!createdClass ? (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tên Lớp Học</label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="VD: Lớp 4B, Lớp 1A1, Lớp 5A..."
                className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-emerald-500 bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Khối Lớp (1 - 5)</label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-emerald-500 bg-slate-50"
                >
                  <option value={1}>Khối 1</option>
                  <option value={2}>Khối 2</option>
                  <option value={3}>Khối 3</option>
                  <option value={4}>Khối 4</option>
                  <option value={5}>Khối 5</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Năm Học</label>
                <input
                  type="text"
                  required
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2025-2026"
                  className="w-full p-3 rounded-2xl border border-slate-200 text-sm font-bold focus:outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm mt-2"
            >
              <Sparkles size={18} /> Khởi Tạo Lớp & Tự Động Sinh Mã QR
            </button>
          </form>
        ) : (
          /* CREATED SUCCESS POSTER WITH QR CODE */
          <div className="space-y-6 text-center">
            <div className="bg-gradient-to-br from-emerald-600 to-green-700 text-white p-6 rounded-3xl shadow-lg space-y-3">
              <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase">
                🎉 KHỞI TẠO LỚP THÀNH CÔNG
              </span>
              <h2 className="text-2xl font-black">{createdClass.name} - Năm học {createdClass.academic_year}</h2>
              <p className="text-xs text-emerald-100 font-semibold">
                Trường Tiểu Học Nguyễn Bá Ngọc • GVCN: {createdClass.teacher_name}
              </p>
            </div>

            {/* JOIN CODE BOX */}
            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300 flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[11px] text-amber-800 font-bold uppercase">Mã Lớp Gia Nhập (6 Ký Tự)</span>
                <p className="text-2xl font-mono font-black text-amber-950">{createdClass.join_code}</p>
              </div>

              <button
                onClick={handleCopyCode}
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow transition"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Đã chép' : 'Sao chép mã'}
              </button>
            </div>

            {/* QR CODE CONTAINER */}
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200 flex flex-col items-center">
              <span className="text-xs font-extrabold text-slate-700 uppercase mb-2 flex items-center gap-1">
                <QrCode size={16} className="text-emerald-600" /> Mã QR Gia Nhập Dành Cho Phụ Huynh & Học Sinh
              </span>
              <img
                src={qrUrl}
                alt={`QR Code Lớp ${createdClass.name}`}
                className="w-48 h-48 rounded-2xl border-4 border-white shadow-md my-2"
              />
              <p className="text-[11px] text-slate-500 italic max-w-xs">
                Phụ huynh và Học sinh quét mã QR này bằng Zalo / Camera điện thoại để tự động vào Lớp {createdClass.name}.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintQR}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow"
              >
                <Printer size={16} /> In Mã QR Dán Bảng Lớp
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl text-xs shadow hover:bg-emerald-700"
              >
                Hoàn Tất
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
