import React, { useState, useRef } from 'react';
import { useClass } from '../../context/ClassContext';
import { triggerConfetti, playSoundEffect } from '../../lib/helpers';
import { 
  Gamepad2, 
  RotateCw, 
  Gift, 
  Zap, 
  Globe, 
  Trophy, 
  Sparkles, 
  Play 
} from 'lucide-react';

export const InteractiveGames = () => {
  const { students, currentClass } = useClass();
  const [activeGame, setActiveGame] = useState('wheel'); // 'wheel' | 'box' | 'buzzer' | 'embed'

  // LUCKY WHEEL STATE
  const [spinning, setSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [winnerStudent, setWinnerStudent] = useState(null);

  // SECRET GIFT BOX STATE
  const [openedBox, setOpenedBox] = useState(null);

  // BUZZER STATE
  const [buzzerWinner, setBuzzerWinner] = useState(null);

  // EMBED STATE
  const [embedUrl, setEmbedUrl] = useState('https://wordwall.net/embed/4066c1b3f9b24479ab48386fb048995a?themeId=1&templateId=5&fontStackId=0');

  // Wheel Students List
  const wheelStudents = students.slice(0, 12);
  const totalSegments = wheelStudents.length;
  const segmentAngle = 360 / totalSegments;

  const handleSpinWheel = () => {
    if (spinning) return;
    setWinnerStudent(null);
    setSpinning(true);
    playSoundEffect('tick');

    // Random extra spins (5 to 8 full turns + random offset)
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 4));
    const randomSegmentIndex = Math.floor(Math.random() * totalSegments);
    const finalRotation = wheelRotation + extraSpins + (randomSegmentIndex * segmentAngle) + (segmentAngle / 2);

    setWheelRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      const winner = wheelStudents[totalSegments - 1 - randomSegmentIndex];
      setWinnerStudent(winner);
      triggerConfetti();
      playSoundEffect('win');
    }, 4000);
  };

  const handleOpenSecretBox = (boxIndex) => {
    const rewardsList = [
      '🌟 Thưởng +5 Hoa điểm tốt!',
      '🎁 Nhận 1 nhãn vở xinh xắn từ Cô',
      '🙋‍♂️ Được quyền làm Quản trò game sau',
      '⭐ Thưởng +3 Hoa điểm tốt!',
      '🎶 Được yêu cầu cả lớp hát 1 bài vỗ tay!',
      '🏆 Huy hiệu "Ngôi sao may mắn"'
    ];
    const randomReward = rewardsList[Math.floor(Math.random() * rewardsList.length)];
    const chosenStudent = students[Math.floor(Math.random() * students.length)];

    setOpenedBox({ index: boxIndex, reward: randomReward, student: chosenStudent });
    triggerConfetti();
    playSoundEffect('win');
  };

  const handleTriggerBuzzer = (student) => {
    setBuzzerWinner(student);
    playSoundEffect('buzzer');
  };

  const colors = [
    '#10B981', '#F59E0B', '#0284C7', '#EC4899', '#8B5CF6', '#EF4444',
    '#14B8A6', '#F43F5E', '#6366F1', '#84CC16', '#EAB308', '#06B6D4'
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-9xl opacity-20 font-black">🎮</div>

        <div className="flex items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 px-3 py-0.5 rounded-full text-xs font-black uppercase">
                INTERACTIVE GAME HUB
              </span>
              <span className="text-purple-100 text-xs font-extrabold">• Lớp {currentClass.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Bộ Công Cụ & Trò Chơi Đầu Giờ</h2>
            <p className="text-purple-100 text-xs sm:text-sm font-semibold mt-1">
              Tạo không khí lớp học sôi nổi với Vòng quay may mắn, Hộp quà bí mật và Bấm chuông giành quyền trả lời.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveGame('wheel')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeGame === 'wheel' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCw size={16} /> Vòng Quay May Mắn
        </button>

        <button
          onClick={() => setActiveGame('box')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeGame === 'box' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Gift size={16} /> Hộp Quà Bí Mật
        </button>

        <button
          onClick={() => setActiveGame('buzzer')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeGame === 'buzzer' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap size={16} /> Chuông Trả Lời Nhanh
        </button>

        <button
          onClick={() => setActiveGame('embed')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeGame === 'embed' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe size={16} /> Nhúng Game (Wordwall/Kahoot)
        </button>
      </div>

      {/* GAME 1: LUCKY WHEEL */}
      {activeGame === 'wheel' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="font-black text-slate-800 text-xl mb-1 flex items-center gap-2">
            <RotateCw className="text-amber-500 animate-spin-slow" size={24} /> 
            Vòng Quay Chọn Học Sinh Trả Lời Bài
          </h3>
          <p className="text-xs text-slate-500 mb-6">Bấm nút quay để ngẫu nhiên vinh danh 1 học sinh trả lời bài hoặc nhận quà.</p>

          {/* WHEEL SVG CONTAINER */}
          <div className="relative my-4 flex flex-col items-center">
            {/* Top Wheel Pointer */}
            <div className="wheel-pointer z-30 mb-[-12px]"></div>

            {/* SVG CANVAS WHEEL */}
            <div
              className="w-72 h-72 sm:w-96 sm:h-96 rounded-full shadow-2xl border-4 border-amber-400 overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
              style={{ transform: `rotate(${wheelRotation}deg)` }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {wheelStudents.map((st, i) => {
                  const startAngle = i * segmentAngle;
                  const endAngle = (i + 1) * segmentAngle;
                  const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
                  const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
                  const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
                  const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

                  return (
                    <g key={st.id}>
                      <path
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                        fill={colors[i % colors.length]}
                        stroke="#ffffff"
                        strokeWidth="0.5"
                      />
                      <text
                        x="72"
                        y="51"
                        fill="#ffffff"
                        fontSize="3.5"
                        fontWeight="900"
                        transform={`rotate(${startAngle + segmentAngle / 2}, 50, 50)`}
                        dominantBaseline="middle"
                        textAnchor="middle"
                      >
                        {st.nickname || st.full_name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Center Spin Button */}
            <button
              onClick={handleSpinWheel}
              disabled={spinning}
              className={`mt-6 px-8 py-3.5 rounded-full text-base font-black shadow-xl transform hover:scale-105 active:scale-95 transition flex items-center gap-2 ${
                spinning ? 'bg-slate-400 text-slate-200 cursor-not-allowed' : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
              }`}
            >
              <Play size={20} className="fill-slate-950" /> {spinning ? 'Đang quay...' : 'QUAY VÒNG MAY MẮN'}
            </button>
          </div>

          {/* Winner Modal Pop-in */}
          {winnerStudent && (
            <div className="mt-6 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 p-6 rounded-3xl shadow-2xl border-4 border-white animate-pop-in max-w-md">
              <span className="text-4xl">🎉</span>
              <h4 className="text-xs font-black uppercase tracking-wider mt-1">Chúc mừng bạn</h4>
              <p className="text-2xl font-black">{winnerStudent.full_name} ({winnerStudent.nickname})</p>
              <p className="text-xs font-bold text-slate-800 mt-1">Đã trúng giải chọn mặt gửi vàng của Cô giáo!</p>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: SECRET GIFT BOX */}
      {activeGame === 'box' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm text-center">
          <h3 className="font-black text-slate-800 text-xl mb-1 flex items-center gap-2 justify-center">
            <Gift className="text-rose-500" size={24} /> Hộp Quà Bí Mật Chiếc Nón Kỳ Diệu
          </h3>
          <p className="text-xs text-slate-500 mb-6">Mỗi hộp quà ẩn chứa một thử thách vui hoặc phần thưởng độc đáo.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map(boxNum => (
              <button
                key={boxNum}
                onClick={() => handleOpenSecretBox(boxNum)}
                className="bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-slate-950 p-8 rounded-3xl shadow-lg border-4 border-white hover:scale-105 transition flex flex-col items-center justify-center gap-2 group"
              >
                <span className="text-5xl group-hover:rotate-12 transition">🎁</span>
                <span className="font-black text-sm">HỘP SỐ #{boxNum}</span>
              </button>
            ))}
          </div>

          {openedBox && (
            <div className="mt-8 bg-purple-100 border-2 border-purple-400 p-6 rounded-3xl text-purple-950 max-w-md mx-auto animate-pop-in">
              <span className="text-4xl">🌟</span>
              <h4 className="font-black text-lg mt-1">{openedBox.reward}</h4>
              <p className="text-xs font-bold text-purple-800 mt-1">
                Dành cho bạn: <strong>{openedBox.student.full_name} ({openedBox.student.nickname})</strong>
              </p>
            </div>
          )}
        </div>
      )}

      {/* GAME 3: FAST BUZZER */}
      {activeGame === 'buzzer' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm text-center">
          <h3 className="font-black text-slate-800 text-xl mb-1 flex items-center gap-2 justify-center">
            <Zap className="text-amber-500 animate-bounce" size={24} /> Bấm Chuông Giành Quyền Trả Lời Nhanh
          </h3>
          <p className="text-xs text-slate-500 mb-6">Học sinh bấm chuông nhanh nhất sẽ dành quyền ưu tiên trả lời câu hỏi.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {students.slice(0, 8).map(st => (
              <button
                key={st.id}
                onClick={() => handleTriggerBuzzer(st)}
                className="bg-slate-50 hover:bg-amber-100 border-2 border-slate-200 hover:border-amber-400 p-4 rounded-2xl transition text-center flex flex-col items-center gap-2"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
                  style={{ backgroundColor: st.avatar_color }}
                >
                  {st.full_name.charAt(0)}
                </div>
                <span className="font-extrabold text-xs text-slate-800">{st.nickname || st.full_name}</span>
                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Zap size={10} /> BẤM CHUÔNG
                </span>
              </button>
            ))}
          </div>

          {buzzerWinner && (
            <div className="mt-6 bg-red-500 text-white p-6 rounded-3xl shadow-xl max-w-md mx-auto animate-pop-in">
              <span className="text-4xl">🔔</span>
              <h4 className="text-xs font-black uppercase mt-1">Bấm chuông siêu tốc!</h4>
              <p className="text-2xl font-black">{buzzerWinner.full_name} ({buzzerWinner.nickname})</p>
              <p className="text-xs font-semibold text-red-100 mt-1">Đã giành quyền trả lời trước 0.12s!</p>
            </div>
          )}
        </div>
      )}

      {/* GAME 4: EMBED HUB */}
      {activeGame === 'embed' && (
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
              <Globe className="text-sky-600" size={20} /> Trò Chơi Nhúng Trực Tiếp (Wordwall, Quizizz, Kahoot)
            </h3>
          </div>

          <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
            <iframe
              src={embedUrl}
              title="Wordwall Interactive Educational Game"
              className="w-full h-full border-none"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};
