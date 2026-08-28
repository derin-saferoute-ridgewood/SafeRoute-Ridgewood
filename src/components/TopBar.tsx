import { BackArrow, XIcon } from './Icons';

interface TopBarProps {
  title: string;
  onBack?: () => void;
  onClose?: () => void;
  rightLabel?: string;
  onRight?: () => void;
  transparent?: boolean;
}

export default function TopBar({ title, onBack, onClose, rightLabel, onRight, transparent }: TopBarProps) {
  return (
    <div className={`sticky top-0 z-20 flex items-center gap-2 px-4 h-14 ${transparent ? 'bg-transparent' : 'bg-white border-b border-divider'}`}>
      {onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-ink hover:bg-cream transition-colors"
          aria-label="Back"
        >
          <BackArrow size={20} />
        </button>
      )}
      {onClose && (
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-ink hover:bg-cream transition-colors"
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>
      )}
      <h1 className="flex-1 font-bold text-[17px] text-ink leading-tight">{title}</h1>
      {rightLabel && onRight && (
        <button
          onClick={onRight}
          className="text-[14px] font-semibold text-route-blue py-2 px-2"
        >
          {rightLabel}
        </button>
      )}
    </div>
  );
}
