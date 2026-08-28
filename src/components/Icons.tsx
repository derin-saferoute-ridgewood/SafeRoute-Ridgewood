import { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const icon = (path: string, size = 20) =>
  function Icon({ size: s = size, ...props }: IconProps) {
    return (
      <svg width={s} height={s} viewBox={`0 0 ${size} ${size}`} fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d={path} stroke="currentColor" strokeWidth="1.75" />
      </svg>
    );
  };

export const BackArrow = icon('M12 4L6 10L12 16');
export const XIcon = icon('M4 4L16 16M16 4L4 16');
export const InfoCircle = icon('M10 9h.01M10 5a5 5 0 100 10A5 5 0 0010 5zm0 4v5');
export const ChevronRight = icon('M7 4l6 6-6 6');
export const ChevronDown = icon('M4 7l6 6 6-6');
export const CheckCircle = icon('M7 10l2 2 4-4M10 5a5 5 0 100 10A5 5 0 0010 5z');
export const ShieldCheck = icon('M10 3L4 5.5v5c0 3.5 2.5 6 6 7.5 3.5-1.5 6-4 6-7.5v-5L10 3zm-2 7l1.5 1.5L12 8');
export const Clock = icon('M10 5a5 5 0 100 10A5 5 0 0010 5zm0 3v2l1.5 1.5');
export const Car = icon('M3 11l1.5-5h11L17 11v5H3v-5zm0 0h14M6 16v1m8-1v1M5 11h10');
export const RouteArrow = icon('M4 10c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6m-3-3l3 3 3-3M10 16V4');
export const SunsetIcon = icon('M10 3v1m0 12v1M3 10H2m16 0h1M5.1 5.1L4.4 4.4m11.2 11.2-.7-.7M5.1 14.9l-.7.7m11.2-11.2-.7.7M10 7a3 3 0 100 6 3 3 0 000-6zM2 15h16');
export const Swap = icon('M6 4v12M6 16l-3-3m3 3 3-3M14 4v12M14 4l-3 3m3-3 3 3');
export const LocationPin = ({ filled = false, ...props }: IconProps & { filled?: boolean }) => (
  <svg width={props.size ?? 20} height={props.size ?? 20} viewBox="0 0 20 20" fill="none" {...props}>
    <path d="M10 2a6 6 0 00-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.75" fill={filled ? 'currentColor' : 'none'} />
    <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="white" />
  </svg>
);
export const BellIcon = icon('M10 2a5 5 0 015 5v4l1.5 2h-13L5 11V7a5 5 0 015-5zm-1.5 14a1.5 1.5 0 003 0');
export const LockIcon = icon('M6 9V7a4 4 0 018 0v2M4 9h12a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7a1 1 0 011-1zm6 3v3');
export const MoreDots = icon('M4 10h.01M10 10h.01M16 10h.01');
export const SidewalkIcon = icon('M4 16l3-10m9 10L13 6M7 10h6');
export const SpeedometerIcon = icon('M4 14a6 6 0 1112 0M10 8v3l2 2');
export const TrafficLightIcon = icon('M8 3h4v14H8V3zm0 3h4M8 10h4m-4 4h4M10 2v1m0 15v1');
export const PersonWalking = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="3.5" r="1.5" fill="currentColor" />
    <path d="M8 7l2 1.5 2-1.5M9.5 8.5L8 13l2.5 1M10.5 8.5L12 13l-2.5 1M8 13l-1 3M12 13l1 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChildIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="3.5" r="1.5" fill="currentColor" />
    <path d="M7.5 7l2.5 1.5L12.5 7m-2 1.5v5m-2.5-3.5L7 13m5.5-2.5L14 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="6" y="7" width="3" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const OlderAdultIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="3.5" r="1.5" fill="currentColor" />
    <path d="M8 7l2 1.5 2-1.5m-2 1.5v4.5m-2 0l-1.5 3.5M12 13l1 3.5M10 12l1.5 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 12L14 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);
