import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import { PrimaryButton } from '../components/Button';
import { Swap, SunsetIcon, ShieldCheck, ChevronRight } from '../components/Icons';

const profileLabels = {
  child: { emoji: '🧒', label: 'Child / teen' },
  'older-adult': { emoji: '🧓', label: 'Older adult' },
  general: { emoji: '🚶', label: 'General pedestrian' },
};

export default function RoutePlannerScreen() {
  const navigate = useNavigate();
  const { profile, preferenceValue, setPreferenceValue } = useApp();
  const { emoji, label } = profileLabels[profile];

  return (
    <div className="min-h-screen bg-cream flex flex-col" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>
      <TopBar
        title="Plan a walk"
        onBack={() => navigate('/')}
        rightLabel="Info"
        onRight={() => navigate('/how-it-works')}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

        {/* Location form */}
        <div className="bg-white rounded-2xl border-2 border-divider overflow-hidden">
          {/* Start */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 rounded-full bg-brand border-2 border-white shadow-sm ring-2 ring-brand" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-slate uppercase tracking-wider mb-0.5">Start</div>
              <div className="text-[15px] font-semibold text-ink">Ridgewood High School</div>
            </div>
          </div>

          {/* Dotted connector */}
          <div className="flex items-center gap-3 px-4 py-1">
            <div className="w-8 flex justify-center">
              <div className="flex flex-col gap-[3px]">
                {[0,1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-divider" />)}
              </div>
            </div>
            <div className="flex-1 h-px border-t border-divider border-dashed" />
            <button
              onClick={() => {}}
              className="flex items-center gap-1 text-[12px] font-semibold text-route-blue"
            >
              <Swap size={14} />
              Swap
            </button>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
              <div className="w-4 h-4 rounded-full bg-navy border-2 border-white shadow-sm ring-2 ring-navy" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold text-slate uppercase tracking-wider mb-0.5">Destination</div>
              <div className="text-[15px] font-semibold text-ink">Ridgewood Train Station</div>
            </div>
          </div>
        </div>

        {/* Profile summary */}
        <div className="bg-white rounded-2xl border-2 border-divider px-4 py-3.5 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[11px] font-bold text-slate uppercase tracking-wider mb-0.5">Route profile</div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold text-ink">{emoji} {label}</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-[13px] font-semibold text-route-blue"
          >
            Change
          </button>
        </div>

        {/* Preference slider */}
        <div className="bg-white rounded-2xl border-2 border-divider px-4 py-4">
          <div className="text-[14px] font-bold text-ink mb-3">What matters most today?</div>
          <div className="flex items-center justify-between text-[12px] font-semibold text-slate mb-2">
            <span>Faster</span>
            <span>More pedestrian-friendly</span>
          </div>
          <div className="relative">
            <div
              className="absolute top-2.5 left-0 h-1.5 rounded-l-full bg-brand"
              style={{ width: `${preferenceValue}%` }}
            />
            <input
              type="range"
              min={0}
              max={100}
              value={preferenceValue}
              onChange={e => setPreferenceValue(Number(e.target.value))}
              className="w-full relative z-10"
            />
          </div>
          <p className="text-[12px] text-slate mt-2 leading-relaxed">
            We compare travel time with observable features such as crossings, road type, speed, and sidewalks.
          </p>
        </div>

        {/* Optional settings */}
        <div className="bg-white rounded-2xl border-2 border-divider overflow-hidden">
          <button
            onClick={() => navigate('/sunset')}
            className="w-full flex items-center gap-3 px-4 py-4 text-left border-b border-divider hover:bg-cream transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-wash flex items-center justify-center flex-shrink-0 text-amber-600">
              <SunsetIcon size={18} className="text-[#9B7B0D]" />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-ink">Walking after sunset?</div>
              <div className="text-[12px] text-slate">Check route timing</div>
            </div>
            <ChevronRight size={18} className="text-divider" />
          </button>
          <button
            onClick={() => navigate('/guardian-setup')}
            className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-cream transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-peach flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={18} className="text-brand" />
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-ink">Guardian Mode</div>
              <div className="text-[12px] text-slate">Optional check-ins, no live tracking</div>
            </div>
            <ChevronRight size={18} className="text-divider" />
          </button>
        </div>

        <div className="h-2" />
      </div>

      {/* Sticky CTA */}
      <div className="px-4 pb-8 pt-3 bg-cream border-t border-divider">
        <PrimaryButton onClick={() => navigate('/results')}>
          Compare routes
        </PrimaryButton>
      </div>
    </div>
  );
}
