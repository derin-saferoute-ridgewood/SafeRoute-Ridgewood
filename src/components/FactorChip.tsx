import { CheckCircle } from './Icons';

interface FactorChipProps {
  label: string;
  positive?: boolean;
}

export default function FactorChip({ label, positive = true }: FactorChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold border-2 ${
        positive
          ? 'border-teal text-teal bg-teal-wash'
          : 'border-[#C8910B] text-[#9B7B0D] bg-amber-wash'
      }`}
    >
      {positive ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l2.5 2.5L10 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 3v3.5M6 9h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      )}
      {label}
    </span>
  );
}
