interface SuitabilityBadgeProps {
  score: number;
  size?: 'sm' | 'lg';
}

function getScoreStyle(score: number) {
  if (score >= 75) return { bg: 'bg-teal-wash', text: 'text-teal', label: 'Great for walking' };
  if (score >= 60) return { bg: 'bg-amber-wash', text: 'text-[#9B7B0D]', label: 'Mixed conditions' };
  return { bg: 'bg-danger-wash', text: 'text-danger', label: 'Use extra care' };
}

export default function SuitabilityBadge({ score, size = 'sm' }: SuitabilityBadgeProps) {
  const { bg, text, label } = getScoreStyle(score);

  if (size === 'lg') {
    return (
      <div className={`inline-flex flex-col items-center px-4 py-2 rounded-xl ${bg}`}>
        <span className={`font-black text-3xl ${text}`} style={{ fontFamily: 'Nunito, sans-serif' }}>{score}</span>
        <span className={`text-xs font-bold ${text}`}>{label}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[12px] font-bold ${bg} ${text}`}>
      {score} · {label}
    </span>
  );
}
