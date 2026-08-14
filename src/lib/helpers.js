import confetti from 'canvas-confetti';

/**
 * Triggers colorful celebration confetti burst
 */
export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#0284c7', '#ec4899', '#8b5cf6']
    });
  } catch (err) {
    console.log('Confetti failed to trigger', err);
  }
};

/**
 * Web Audio API synthesized sound generator for interactive tools (Buzzer, Win chime, Click)
 */
export const playSoundEffect = (type = 'click') => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'buzzer') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'tick') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.02);
      osc.start(now);
      osc.stop(now + 0.02);
    }
  } catch (e) {
    // Audio Context blocked or unavailable
  }
};

/**
 * Format Vietnamese Date: e.g. "Thứ Sáu, 14/08/2026"
 */
export const formatDateVN = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;

  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = days[d.getDay()];
  const dateStr = d.getDate().toString().padStart(2, '0');
  const monthStr = (d.getMonth() + 1).toString().padStart(2, '0');
  const yearStr = d.getFullYear();

  return `${dayName}, ${dateStr}/${monthStr}/${yearStr}`;
};

/**
 * Format Time: e.g. "08:30"
 */
export const formatTimeVN = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

/**
 * Primary School Evaluation Classification (Quy định Đánh giá Học sinh Tiểu học TT27/2020/TT-BGDĐT)
 */
export const calculateBehaviorEvaluation = (totalStars, attendanceRate = 100) => {
  if (totalStars >= 30 && attendanceRate >= 95) {
    return {
      grade: 'Hoàn thành tốt',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badge: '🌟 Ngôi sao chăm ngoan',
      icon: '🥇'
    };
  } else if (totalStars >= 15 && attendanceRate >= 85) {
    return {
      grade: 'Hoàn thành',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
      badge: '👍 Học sinh Chăm ngoan',
      icon: '🥈'
    };
  } else {
    return {
      grade: 'Cần cố gắng',
      color: 'bg-amber-100 text-amber-800 border-amber-300',
      badge: '🌱 Cần rèn luyện thêm',
      icon: '🥉'
    };
  }
};

/**
 * Honor Badge Definitions based on Star levels
 */
export const HONOR_BADGES = [
  { id: 'b1', name: 'Mầm Non Chăm Chỉ', minStars: 5, icon: '🌱', desc: 'Đạt từ 5 hoa điểm tốt' },
  { id: 'b2', name: 'Duy Trì Vệ Sinh', minStars: 15, icon: '🧹', desc: 'Đạt từ 15 hoa điểm tốt' },
  { id: 'b3', name: 'Phát Biểu Hăng Hái', minStars: 25, icon: '🙋‍♂️', desc: 'Đạt từ 25 hoa điểm tốt' },
  { id: 'b4', name: 'Ngôi Sao Chăm Ngoan', minStars: 40, icon: '⭐', desc: 'Đạt từ 40 hoa điểm tốt' },
  { id: 'b5', name: 'Đại Sứ Lớp Học', minStars: 60, icon: '👑', desc: 'Đạt từ 60 hoa điểm tốt' },
];

/**
 * Avatar Color options for students
 */
export const AVATAR_COLORS = [
  '#10B981', '#F59E0B', '#0284C7', '#EC4899', '#8B5CF6', '#EF4444', '#14B8A6', '#6366F1'
];
