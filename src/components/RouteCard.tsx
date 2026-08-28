import SuitabilityBadge from './SuitabilityBadge';

interface RouteCardProps {
  name: string;
  color: string;
  duration: string;
  distance: string;
  score: number;
  tradeoff: string;
  selected: boolean;
  onSelect: () => void;
}

export default function RouteCard({ name, color, duration, distance, score, tradeoff, selected, onSelect }: RouteCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-xl border-2 p-3 transition-all ${
        selected ? 'border-brand bg-peach' : 'border-divider bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-1.5 rounded-full self-stretch min-h-[52px]" style={{ backgroundColor: color }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <span className="font-bold text-[15px] text-ink">{name}</span>
            <SuitabilityBadge score={score} />
          </div>
          <div className="text-[13px] text-slate mt-0.5">{duration} · {distance}</div>
          <div className="text-[13px] text-ink mt-1 leading-snug">{tradeoff}</div>
        </div>
      </div>
    </button>
  );
}
