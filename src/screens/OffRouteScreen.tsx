import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import LiveMap from '../components/LiveMap';
import { PrimaryButton, SecondaryButton, TextButton } from '../components/Button';
import { CheckCircle, Car } from '../components/Icons';

export default function OffRouteScreen() {
  const navigate = useNavigate();
  const { selectedRoute } = useApp();

  return (
    <div className="min-h-screen bg-navy flex flex-col relative overflow-hidden">

      {/* Map behind */}
      <div className="absolute inset-0 opacity-60">
        <LiveMap
          selectedRoute={selectedRoute}
          showUserDot={true}
          userOffRoute={true}
          showAnnotations={false}
          height="100%"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/20" />

      {/* Bottom sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl px-4 pt-5 pb-10">
        <div className="w-10 h-1 rounded-full bg-divider mx-auto mb-5" />

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-amber-wash border-2 border-[#C8910B] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 4L4 22h20L14 4z" fill="#FFF3C9" stroke="#F6BD31" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M14 11v5M14 18.5h.01" stroke="#9B7B0D" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        <h2 className="text-[20px] font-black text-ink text-center mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
          You are off your planned route.
        </h2>
        <p className="text-[14px] text-slate text-center leading-relaxed mb-6">
          Your location appears farther from the selected route. Would you like to adjust your plan?
        </p>

        <div className="flex flex-col gap-2.5">
          <PrimaryButton onClick={() => navigate('/results')}>
            Recalculate route
          </PrimaryButton>

          <div className="grid grid-cols-2 gap-2.5">
            <button className="h-12 flex items-center justify-center gap-2 bg-teal-wash text-teal border-2 border-teal rounded-xl font-bold text-[14px]">
              <CheckCircle size={16} />
              I am OK
            </button>
            <button className="h-12 flex items-center justify-center gap-2 bg-blue-50 text-route-blue border-2 border-route-blue rounded-xl font-bold text-[14px]">
              <Car size={16} />
              Need pickup
            </button>
          </div>

          <div className="flex justify-center pt-1">
            <TextButton onClick={() => navigate('/active-trip')}>
              Dismiss
            </TextButton>
          </div>
        </div>
      </div>
    </div>
  );
}
