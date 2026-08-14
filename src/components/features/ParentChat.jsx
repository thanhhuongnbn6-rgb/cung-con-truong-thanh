import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { useAuth } from '../../context/AuthContext';
import { 
  MessageCircle, 
  Megaphone, 
  Send, 
  Image, 
  Paperclip, 
  CheckCheck, 
  PlusCircle,
  FileText,
  Calendar,
  Utensils
} from 'lucide-react';
import { formatDateVN, formatTimeVN } from '../../lib/helpers';

export const ParentChat = () => {
  const { chatMessages, sendChatMessage, currentClass } = useClass();
  const { profile } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState('announcements'); // 'announcements' | 'direct'
  const [inputText, setInputText] = useState('');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementContent, setAnnouncementContent] = useState('');

  // Filter messages
  const announcements = chatMessages.filter(m => m.type === 'announcement');
  const directMessages = chatMessages.filter(m => m.type === 'direct');

  const handleSendDirectMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(
      profile?.role === 'teacher' ? 'p3333333-3333-3333-3333-333333333333' : 't1111111-1111-1111-1111-111111111111',
      inputText,
      'direct'
    );
    setInputText('');
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementContent.trim()) return;

    sendChatMessage(null, announcementContent, 'announcement');
    setAnnouncementContent('');
    setShowAnnouncementModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 font-black">📢</div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black uppercase">
                PARENT COMMUNICATION HUB
              </span>
              <span className="text-sky-100 text-xs font-extrabold">• Lớp {currentClass.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Bảng Tin Lớp & Trao Đổi Phụ Huynh</h2>
            <p className="text-sky-100 text-xs sm:text-sm font-semibold mt-1">
              Kênh thông tin chính thức giữa Giáo viên chủ nhiệm và toàn thể Phụ huynh học sinh.
            </p>
          </div>

          {(profile?.role === 'teacher' || profile?.role === 'admin') && (
            <button
              onClick={() => setShowAnnouncementModal(true)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition"
            >
              <PlusCircle size={18} /> Đăng Thông Báo Lớp
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeSubTab === 'announcements' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Megaphone size={16} /> Thông Báo Dặn Dò Chung ({announcements.length})
        </button>

        <button
          onClick={() => setActiveSubTab('direct')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeSubTab === 'direct' ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle size={16} /> Chat Trực Tiếp 1-1 ({directMessages.length})
        </button>
      </div>

      {/* SUB-TAB 1: CLASS ANNOUNCEMENTS */}
      {activeSubTab === 'announcements' && (
        <div className="space-y-4">
          {/* Quick Notice Category Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center gap-3">
              <Calendar className="text-amber-600" size={24} />
              <div>
                <h4 className="font-extrabold text-xs text-amber-900">Lịch Thi & Sự Kiện</h4>
                <p className="text-[11px] text-amber-700">Kiểm tra giữa kỳ II sắp tới</p>
              </div>
            </div>
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center gap-3">
              <Utensils className="text-emerald-600" size={24} />
              <div>
                <h4 className="font-extrabold text-xs text-emerald-900">Thực Đơn Bán Trú</h4>
                <p className="text-[11px] text-emerald-700">Cơm gà xối mỡ & Canh rau ngót</p>
              </div>
            </div>
            <div className="bg-sky-50 p-4 rounded-2xl border border-sky-200 flex items-center gap-3">
              <FileText className="text-sky-600" size={24} />
              <div>
                <h4 className="font-extrabold text-xs text-sky-900">Học Phí & Thu Chi</h4>
                <p className="text-[11px] text-sky-700">Bán trú tháng 8 đã cập nhật</p>
              </div>
            </div>
          </div>

          {/* Announcements Feed */}
          <div className="space-y-4">
            {announcements.map(ann => (
              <div key={ann.id} className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                      📢
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">{ann.sender_name}</h4>
                      <p className="text-[10px] text-slate-400">{formatDateVN(ann.created_at)} • {formatTimeVN(ann.created_at)}</p>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] px-2.5 py-0.5 rounded-full font-black">
                    Thông Báo Quan Trọng
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed whitespace-pre-line">
                  {ann.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: REALTIME 1-1 CHAT */}
      {activeSubTab === 'direct' && (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm flex flex-col h-[520px] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-slate-50 border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center">
                {profile?.role === 'parent' ? '👩‍🏫' : '👨‍👩‍👧'}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">
                  {profile?.role === 'parent' ? 'GVCN Cô Lê Thị Thanh Hương' : 'Phụ huynh anh Trần Văn Nam (Bố bé Minh An)'}
                </h4>
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Sẵn sàng trao đổi trực tiếp
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
            {directMessages.map(msg => {
              const isMe = msg.sender_id === profile?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm space-y-1 ${
                      isMe
                        ? 'bg-sky-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    <p className="font-medium leading-relaxed">{msg.content}</p>
                    <div className={`text-[10px] flex items-center justify-end gap-1 ${isMe ? 'text-sky-100' : 'text-slate-400'}`}>
                      <span>{formatTimeVN(msg.created_at)}</span>
                      {isMe && <CheckCheck size={13} className="text-amber-300" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendDirectMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button type="button" className="p-2 text-slate-400 hover:text-sky-600 transition" title="Đính kèm hình ảnh">
              <Image size={20} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn trao đổi với Giáo viên / Phụ huynh..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-sky-500 bg-slate-50"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-xl shadow transition font-bold"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Create Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-pop-in">
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Tạo Thông Báo Lớp Chủ Nhiệm</h3>
            <p className="text-xs text-slate-500 mb-4">Thông báo sẽ hiển thị ngay cho toàn bộ Phụ huynh Lớp 4A.</p>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <textarea
                required
                value={announcementContent}
                onChange={(e) => setAnnouncementContent(e.target.value)}
                placeholder="Nhập nội dung dặn dò, lịch thi, thực đơn, học phí..."
                className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-sky-500 bg-slate-50 h-36"
              ></textarea>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 shadow"
                >
                  Đăng Thông Báo Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
