import React, { useState } from 'react';
import { useClass } from '../../context/ClassContext';
import { useAuth } from '../../context/AuthContext';
import { Camera, Heart, PlusCircle, Sparkles, MessageCircle, Image, Share2 } from 'lucide-react';
import { formatDateVN } from '../../lib/helpers';

export const ClassDiary = () => {
  const { diaryFeed, addDiaryPost, likeDiaryPost, currentClass } = useClass();
  const { profile } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addDiaryPost(
      title,
      content,
      photoUrl ? [photoUrl] : []
    );

    setTitle('');
    setContent('');
    setPhotoUrl('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 font-black">📷</div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black uppercase">
                NHẬT KÝ LỚP TÔI & KHOẢNH KHẮC
              </span>
              <span className="text-teal-100 text-xs font-extrabold">• Lớp {currentClass.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Dòng Thời Gian Kỷ Niệm Học Sinh</h2>
            <p className="text-teal-100 text-xs sm:text-sm font-semibold mt-1">
              Lưu giữ những nụ cười, hoạt động trải nghiệm, tiết học hăng hái và khoảnh khắc đáng yêu của các con.
            </p>
          </div>

          {(profile?.role === 'teacher' || profile?.role === 'admin') && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition"
            >
              <PlusCircle size={18} /> Đăng Bài Viết Mới
            </button>
          )}
        </div>
      </div>

      {/* Diary Timeline Feed */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {diaryFeed.map(post => (
          <article key={post.id} className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            {/* Author Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center">
                  👩‍🏫
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-800">{post.author_name}</h4>
                  <p className="text-[10px] text-slate-400">{formatDateVN(post.created_at)}</p>
                </div>
              </div>
            </div>

            {/* Post Title & Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">{post.title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{post.content}</p>
            </div>

            {/* Photo Album Grid */}
            {post.media_urls && post.media_urls.length > 0 && (
              <div className={`grid gap-2 rounded-2xl overflow-hidden ${
                post.media_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
              }`}>
                {post.media_urls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Khoảnh khắc ${i + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition duration-300 rounded-xl"
                  />
                ))}
              </div>
            )}

            {/* Interaction Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3">
              <button
                onClick={() => likeDiaryPost(post.id)}
                className="flex items-center gap-1.5 text-xs font-extrabold text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition"
              >
                <Heart size={16} className="fill-rose-500" /> {post.likes_count} Yêu thích
              </button>

              <div className="text-xs text-slate-400 font-semibold flex items-center gap-2">
                <span>💬 Phụ huynh & Học sinh đang thả tim cổ vũ</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Modal create post */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-pop-in">
            <h3 className="font-extrabold text-slate-800 text-base mb-1">Đăng Bài Kỷ Niệm Lớp Học</h3>
            <p className="text-xs text-slate-500 mb-4">Bài viết sẽ xuất hiện trên nhật ký lớp dành cho Phụ huynh & Học sinh.</p>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tiêu Đề Bài Viết</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Giờ trải nghiệm vẽ tranh; Lễ mừng sinh nhật tháng..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nội Dung Chi Tiết</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Viết đôi dòng chia sẻ cảm xúc về hoạt động của các con..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 bg-slate-50 h-28"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Link Ảnh Minh Họa (Tùy chọn)</label>
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-emerald-500 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                >
                  Đăng Kỷ Niệm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
