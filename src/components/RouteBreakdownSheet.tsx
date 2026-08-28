import { useNavigate } from 'react-router';
import { XIcon } from './Icons';
import SuitabilityBadge from './SuitabilityBadge';

interface RouteBreakdownSheetProps {
  routeName: string;
  score: number;
  profile: string;
  positiveFactors: string[];
  cautionFactors: string[];
  tradeoff: string;
  onClose: () => void;
}

const MODEL_VERSION: Record<string, string> = {
  child: 'Child / Teen model v1.0',
  'older-adult': 'Older Adult model v1.0',
  general: 'General model v1.0',
};

const PROFILE_LABELS: Record<string, string> = {
  child: 'Child / teen',
  'older-adult': 'Older adult',
  general: 'General pedestrian',
};

export default function RouteBreakdownSheet({
  routeName,
  score,
  profile,
  positiveFactors,
  cautionFactors,
  tradeoff,
  onClose,
}: RouteBreakdownSheetProps) {
  const navigate = useNavigate();
  const confidence = score >= 81 ? 87 : score >= 62 ? 72 : 65;

  return (
    <div className="absolute inset-0 bg-black/30 z-30 flex items-end">
      <div className="w-full bg-white rounded-t-3xl px-4 pt-5 pb-8 max-h-[85vh] overflow-y-auto">
        {/* Handle + close */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-1 rounded-full bg-[#CDD4D6] mx-auto" />
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5E6B70] hover:bg-[#FFF9F4]">
            <XIcon size={16} />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h2 className="text-[18px] font-black text-[#263238]" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Why this route scored {score}
          </h2>
          <p className="text-[13px] text-[#5E6B70] mt-0.5">
            {routeName} · {PROFILE_LABELS[profile] ?? profile} profile
          </p>
        </div>

        {/* Score row */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <SuitabilityBadge score={score} size="lg" />
          <div className="bg-[#F0F4F6] rounded-xl px-3 py-2">
            <div className="text-[11px] font-bold text-[#5E6B70] uppercase tracking-wider">Data confidence</div>
            <div className="text-[18px] font-black text-[#263238]" style={{ fontFamily: 'Nunito, sans-serif' }}>
              {confidence}%
            </div>
          </div>
          <div className="bg-[#FFF9F4] rounded-xl px-3 py-2">
            <div className="text-[11px] font-bold text-[#5E6B70] uppercase tracking-wider">Model</div>
            <div className="text-[12px] font-semibold text-[#263238]">{MODEL_VERSION[profile] ?? 'General model v1.0'}</div>
          </div>
        </div>

        {/* Positive factors */}
        <div className="mb-4">
          <p className="text-[12px] font-bold text-[#168B82] uppercase tracking-wider mb-2">Positive characteristics</p>
          <div className="flex flex-col gap-1.5">
            {positiveFactors.map(f => (
              <div key={f} className="flex items-center gap-2 text-[13px] text-[#263238]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#168B82] flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Caution factors */}
        <div className="mb-4">
          <p className="text-[12px] font-bold text-[#9B7B0D] uppercase tracking-wider mb-2">Caution characteristics</p>
          <div className="flex flex-col gap-1.5">
            {cautionFactors.map(f => (
              <div key={f} className="flex items-center gap-2 text-[13px] text-[#263238]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F6BD31] flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Tradeoff */}
        <div className="bg-[#D8F4EE] border border-[#168B82] rounded-xl px-4 py-3 mb-4">
          <p className="text-[13px] text-[#168B82] font-semibold leading-snug">{tradeoff}</p>
        </div>

        {/* Method note */}
        <p className="text-[12px] text-[#5E6B70] italic mb-4 leading-relaxed">
          This is a route-characteristic estimate, not a prediction or guarantee of safety.
        </p>

        {/* CTA */}
        <button
          onClick={() => { onClose(); navigate('/transparency'); }}
          className="w-full h-11 flex items-center justify-center gap-2 border-2 border-[#CDD4D6] rounded-xl text-[14px] font-bold text-[#263238] hover:bg-[#FFF9F4] transition-colors"
        >
          Read full methodology
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
