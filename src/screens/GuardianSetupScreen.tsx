import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { CheckCircle, Car, Clock, RouteArrow, ChevronRight, LockIcon } from '../components/Icons';

const features = [
  {
    icon: <CheckCircle size={18} className="text-teal" />,
    bg: 'bg-teal-wash',
    title: "I'm OK",
    subtitle: 'Prepare a quick status message',
  },
  {
    icon: <Car size={18} className="text-route-blue" />,
    bg: 'bg-blue-50',
    title: 'Need pickup',
    subtitle: 'Prepare a pickup request with your current location',
  },
  {
    icon: <Clock size={18} className="text-brand" />,
    bg: 'bg-peach',
    title: 'Arrival reminder',
    subtitle: 'Prompt a check-in if the trip runs late',
  },
  {
    icon: <RouteArrow size={18} className="text-[#9B7B0D]" />,
    bg: 'bg-amber-wash',
    title: 'Off-route prompt',
    subtitle: 'Offer recalculation or a check-in when you leave the planned route',
  },
];

export default function GuardianSetupScreen() {
  const navigate = useNavigate();
  const { setGuardianMode } = useApp();

  function handleTurnOn() {
    setGuardianMode(true);
    navigate('/active-trip');
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <TopBar title="Guardian Mode" onBack={() => navigate('/plan')} />

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">

        {/* Hero icon */}
        <div className="flex justify-center py-2">
          <div className="w-20 h-20 rounded-full bg-peach border-2 border-brand flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 5L7 10v12c0 8 5.5 14 13 17 7.5-3 13-9 13-17V10L20 5z" fill="#FFE3CC" stroke="#F26A21" strokeWidth="2" strokeLinejoin="round" />
              <path d="M14 20l3.5 3.5L26 16" stroke="#168B82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 13a2 2 0 100-4 2 2 0 000 4z" fill="#F26A21" />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center">
          <h1 className="text-[22px] font-black text-ink" style={{ fontFamily: 'Nunito, sans-serif', letterSpacing: '-0.01em' }}>
            Stay connected without being tracked.
          </h1>
          <p className="text-[14px] text-slate mt-2 leading-relaxed">
            Guardian Mode sets an arrival reminder and gives the walker quick options to check in or ask for a pickup.
            Messages are always reviewed and sent by the user.
          </p>
        </div>

        {/* Setup fields */}
        <div className="bg-white rounded-2xl border-2 border-divider overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-divider">
            <div>
              <div className="text-[11px] font-bold text-slate uppercase tracking-wider mb-0.5">Trusted contact</div>
              <div className="text-[15px] font-semibold text-ink">Mom</div>
            </div>
            <button className="text-[13px] font-semibold text-route-blue">Choose</button>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <div>
              <div className="text-[11px] font-bold text-slate uppercase tracking-wider mb-0.5">Expected arrival</div>
              <div className="text-[15px] font-semibold text-ink">4:32 PM</div>
            </div>
            <button className="text-[13px] font-semibold text-route-blue">Edit</button>
          </div>
        </div>

        {/* Included features */}
        <div>
          <p className="text-[13px] font-bold text-ink uppercase tracking-wider mb-3">What is included</p>
          <div className="flex flex-col gap-2.5">
            {features.map(f => (
              <div key={f.title} className="flex items-center gap-3 bg-white rounded-xl border-2 border-divider px-4 py-3.5">
                <div className={`w-9 h-9 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0`}>
                  {f.icon}
                </div>
                <div>
                  <div className="text-[14px] font-bold text-ink">{f.title}</div>
                  <div className="text-[12px] text-slate">{f.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy callout */}
        <div className="bg-teal-wash border border-teal rounded-xl px-4 py-4 flex gap-3">
          <LockIcon size={16} className="text-teal flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[13px] font-bold text-teal">Your privacy matters</div>
            <p className="text-[12px] text-teal mt-1 leading-relaxed">
              SafeRoute+ does not automatically message contacts, share live location, or store a contact relationship.
            </p>
          </div>
        </div>

        <div className="h-2" />
      </div>

      {/* CTAs */}
      <div className="px-4 pb-8 pt-3 border-t border-divider bg-cream flex flex-col gap-2.5">
        <PrimaryButton onClick={handleTurnOn}>
          Turn on Guardian Mode
        </PrimaryButton>
        <SecondaryButton onClick={() => navigate('/results')}>
          Not now
        </SecondaryButton>
      </div>
    </div>
  );
}
