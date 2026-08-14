import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ShieldCheck, 
  Mic, 
  Sparkles,
  User
} from 'lucide-react';
import { formatDateVN, formatTimeVN } from '../../lib/helpers';

export const CoOiInbox = () => {
  const { coOiMessages, sendCoOiMessage, replyCoOiMessage, students } = useClass();
  const { profile } = useAuth();

  const isStudent = profile?.role === 'student';
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  // Student state
  const [selectedEmotion, setSelectedEmotion] = useState('Lo lắng');
  const [messageText, setMessageText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [sentToast, setSentToast] = useState(false);

  // Teacher state
  const [activeMessageId, setActiveMessageId] = useState(null);
  const [teacherReplyText, setTeacherReplyText] = useState('');

  const emotions = [
    { label: 'Vui', emoji: '😊', bg: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
    { label: 'Buồn', emoji: '😢', bg: 'bg-blue-100 border-blue-300 text-blue-800' },
    { label: 'Lo lắng', emoji: '😟', bg: 'bg-amber-100 border-amber-300 text-amber-800' },
    { label: 'Bị bạn trêu', emoji: '😠', bg: 'bg-red-100 border-red-300 text-red-800' },
    { label: 'Cần cô giúp', emoji: '🆘', bg: 'bg-purple-100 border-purple-300 text-purple-800' },
  ];

  // Student's filtered private messages
  const studentMessages = coOiMessages.filter(
    m => m.student_id === profile?.id || m.student_name === 'Trần Minh An'
  );

  const handleStudentSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    sendCoOiMessage(
      profile?.id || 's2222222-2222-2222-2222-222222222222',
      profile?.full_name || 'Trần Minh An',
      selectedEmotion,
      messageText
    );

    setMessageText('');
    setSentToast(true);
    setTimeout(() => setSentToast(false), 4000);
  };

  const handleTeacherReplySubmit = (msgId) => {
    if (!teacherReplyText.trim()) return;
    replyCoOiMessage(msgId, teacherReplyText);
    setActiveMessageId(null);
    setTeacherReplyText('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setMessageText(prev => prev + (prev ? ' ' : '') + '[Ghi âm ngắn 15s: Cô ơi hôm nay giờ ra chơi con bị mệt...]');
        setIsRecording(false);
      }, 3000);
    }
  };

  // If Parent tries to view, display Privacy Lock shield
  if (profile?.role === 'parent') {
    return (
      <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm text-center max-w-xl mx-auto my-12">
        <Lock size={64} className="mx-auto text-amber-500 mb-4" />
        <h3 className="text-xl font-black text-slate-800">Kênh Bảo Mật Riêng Tư 1-1</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Hòm thư "Cô ơi!" là không gian riêng tư dành riêng cho Học sinh tâm sự trực tiếp với Giáo viên chủ nhiệm. 
          Phụ huynh và các thành viên khác không thể xem tin nhắn trong mục này để tôn trọng tâm lý học sinh.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 font-black">💌</div>

        <div className="flex items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white text-rose-600 px-3 py-0.5 rounded-full text-xs font-black uppercase">
                HỘP THƯ BÍ MẬT "CÔ ƠI!"
              </span>
              <span className="text-rose-100 text-xs font-bold flex items-center gap-1">
                <ShieldCheck size={14} /> Bảo mật 1-1 Cô & Trò
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Góc Tâm Sự & Lắng Nghe Tiểu Học</h2>
            <p className="text-rose-100 text-xs sm:text-sm font-semibold mt-1">
              Nơi các con học sinh gửi gắm những băn khoăn, cảm xúc, niềm vui hay điều lo lắng trực tiếp tới Cô giáo chủ nhiệm.
            </p>
          </div>
        </div>
      </div>

      {sentToast && (
        <div className="bg-emerald-500 text-white font-bold p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between shadow-lg animate-pop-in">
          <span>💌 Cô giáo đã nhận được lời nhắn của con rồi nhé! Cô sẽ hồi đáp sớm nhất!</span>
        </div>
      )}

      {/* STUDENT INTERFACE (BIG FRIENDLY EMOTION BUTTONS) */}
      {isStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Message Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
            <h3 className="font-black text-slate-800 text-lg mb-1 flex items-center gap-2">
              <Heart className="text-rose-500" size={22} /> Lời Nhắn Gửi Đến Cô Giáo
            </h3>
            <p className="text-xs text-slate-500 mb-4">Con hãy chọn cảm xúc hôm nay và viết hoặc ghi âm lời nhắn cho Cô nhé!</p>

            <form onSubmit={handleStudentSend} className="space-y-4">
              {/* Emotion Selector */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-2">
                  1. Hôm Nay Con Cảm Thấy Thế Nào?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {emotions.map(e => (
                    <button
                      key={e.label}
                      type="button"
                      onClick={() => setSelectedEmotion(e.label)}
                      className={`p-3 rounded-2xl border-2 text-center transition flex flex-col items-center gap-1 ${
                        selectedEmotion === e.label
                          ? 'border-rose-500 bg-rose-50 shadow-md scale-105'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-3xl">{e.emoji}</span>
                      <span className="text-xs font-extrabold text-slate-800">{e.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message text area */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase mb-1">
                  2. Lời Nhắn Tâm Sự Của Con
                </label>
                <div className="relative">
                  <textarea
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Con muốn nhắn cho cô điều gì? (Ví dụ: Cô ơi, hôm nay con chưa thuộc bài thơ; Cô ơi bạn trêu con...)"
                    className="w-full p-4 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:border-rose-500 bg-slate-50/50 h-32"
                  ></textarea>

                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`absolute right-3 bottom-3 p-2.5 rounded-full text-xs font-bold flex items-center gap-1 transition ${
                      isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                    title="Ghi âm giọng nói"
                  >
                    <Mic size={16} /> {isRecording ? 'Đang thu âm...' : 'Thu âm'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
              >
                <Send size={18} /> Gửi Thư Cho Cô Giáo
              </button>
            </form>
          </div>

          {/* Student Sent History Box */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <MessageSquare className="text-emerald-600" size={18} /> Lịch Sử Lời Nhắn
            </h3>

            {studentMessages.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Con chưa gửi thư tâm sự nào.</p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                {studentMessages.map(msg => (
                  <div key={msg.id} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-bold text-[11px]">
                        Cảm xúc: {msg.emotion_tag}
                      </span>
                      <span className="text-slate-400 text-[10px]">{formatTimeVN(msg.created_at)}</span>
                    </div>

                    <p className="text-xs text-slate-800 font-semibold">{msg.message_text}</p>

                    {msg.teacher_reply ? (
                      <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-xs">
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Cô Hoa phản hồi:
                        </span>
                        <p className="text-slate-700 mt-1 italic">{msg.teacher_reply}</p>
                      </div>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                        <Clock size={12} /> Đang chờ Cô giáo xem...
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEACHER INTERFACE (PRIVATE CONFESSION INBOX) */}
      {isTeacher && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">
              <Heart className="text-rose-500" size={24} /> Danh Sách Lời Nhắn "Cô Ơi!" Của Lớp
            </h3>
            <span className="bg-rose-100 text-rose-800 text-xs px-3 py-1 rounded-full font-extrabold">
              Tổng số: {coOiMessages.length} tin nhắn
            </span>
          </div>

          <div className="space-y-4">
            {coOiMessages.map(msg => (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl border-2 transition ${
                  msg.is_resolved
                    ? 'border-slate-200 bg-slate-50/60'
                    : 'border-rose-300 bg-rose-50/30 shadow-md'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs">
                      {msg.student_name ? msg.student_name.charAt(0) : 'H'}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">{msg.student_name}</h4>
                      <p className="text-[10px] text-slate-400">{formatDateVN(msg.created_at)} • {formatTimeVN(msg.created_at)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full">
                      Cảm xúc: {msg.emotion_tag}
                    </span>
                    {msg.is_resolved ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} /> Đã hồi đáp
                      </span>
                    ) : (
                      <span className="bg-rose-500 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 animate-pulse">
                        <Clock size={13} /> Cần phản hồi
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className="my-3 text-sm text-slate-800 font-semibold leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  "{msg.message_text}"
                </div>

                {/* Existing Reply */}
                {msg.teacher_reply && (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-slate-700 space-y-1 mb-3">
                    <span className="font-bold text-emerald-800">👩‍🏫 Cô Hoa đã trả lời:</span>
                    <p className="italic">{msg.teacher_reply}</p>
                  </div>
                )}

                {/* Reply Form toggle */}
                {activeMessageId === msg.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={teacherReplyText}
                      onChange={(e) => setTeacherReplyText(e.target.value)}
                      placeholder="Nhập câu trả lời ấm áp, ân cần tới học sinh..."
                      className="w-full p-3 rounded-xl border border-emerald-300 text-xs focus:outline-none focus:border-emerald-600 bg-white"
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setActiveMessageId(null)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-600"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleTeacherReplySubmit(msg.id)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                      >
                        Gửi Phản Hồi Trực Tiếp
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setActiveMessageId(msg.id);
                        setTeacherReplyText(msg.teacher_reply || '');
                      }}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-white px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 transition"
                    >
                      {msg.teacher_reply ? '✏️ Chỉnh sửa phản hồi' : '💬 Trả lời học sinh'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
