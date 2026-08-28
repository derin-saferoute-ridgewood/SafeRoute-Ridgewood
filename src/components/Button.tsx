import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export function PrimaryButton({ children, onClick, disabled, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 bg-brand text-white font-bold text-[15px] rounded-xl border-b-[3px] border-brand-deep active:translate-y-[2px] active:border-b-0 transition-transform disabled:opacity-40 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, disabled, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 bg-white text-ink font-bold text-[15px] rounded-xl border-2 border-divider hover:bg-cream active:bg-cream transition-colors disabled:opacity-40 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  );
}

export function TextButton({ children, onClick, className = '' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-[14px] font-semibold text-slate hover:text-ink transition-colors py-2 ${className}`}
    >
      {children}
    </button>
  );
}
