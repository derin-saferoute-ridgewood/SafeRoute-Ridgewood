import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, Profile } from '../context/AppContext';
import LiveMap from '../components/LiveMap';
import { PrimaryButton } from '../components/Button';
import { ShieldCheck } from '../components/Icons';

const profiles: { id: Profile; emoji: string; label: string }[] = [
  { id: 'child', emoji: '🧒', label: 'Child / teen' },
  { id: 'older-adult', emoji: '🧓', label: 'Older adult' },
  { id: 'general', emoji: '🚶', label: 'General' },
];

const trustItems = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6M4 10h12M10 4c-1.5 2-2.5 3.7-2.5 6S8.5 14 10 16c1.5-2 2.5-3.7 2.5-6S11.5 6 10 4z" stroke="#F26A21" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    text: 'Compare time and pedestrian suitability',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6" r="3" stroke="#168B82" strokeWidth="1.5" />
        <path d="M4 18v-1.5a6 6 0 0112 0V18" stroke="#168B82" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    text: 'Profiles for children, older adults, and general pedestrians',
  },
  {
    icon: <ShieldCheck size={20} className="text-route-blue" />,
    text: 'Optional check-ins without live tracking',
  },
];

export default function DesktopRoutePlannerScreen() {
  const navigate = useNavigate();
  const { profile, setProfile, preferenceValue, setPreferenceValue } = useApp();
  const [sliderVal, setSliderVal] = useState(preferenceValue);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Desktop nav */}
      <nav className="bg-white border-b-2 border-divider px-8 py-0 flex items-center gap-1 h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-8">
          <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L4 6v10h12V6L10 2z" fill="white" />
              <path d="M8 16v-6h4v6" fill="#FFE3CC" />
            </svg>
          </div>
          <div>
            <div className="font-black text-[17px] text-ink" style={{ fontFamily: 'Nunito, sans-serif' }}>SafeRoute+</div>
            <div className="text-[11px] font-semibold text-slate -mt-0.5">Bergen</div>
          </div>
        </div>

        {/* Nav items */}
        <div className="flex items-center gap-1">
          {[
            { label: 'Plan a route', active: true },
            { label: 'How it works', route: '/how-it-works' },
            { label: 'Ridgewood pilot', route: '/' },
          ].map(item => (
            <button
              key={item.label}
              onClick={() => item.route && navigate(item.route)}
              className={`px-4 py-2 rounded-xl text-[14px] font-bold transition-colors ${
                item.active
                  ? 'bg-peach text-brand'
                  : 'text-slate hover:bg-cream hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream border border-divider text-[13px] font-semibold text-slate">
            <span className="w-1.5 h-1.5 rounded-full bg-teal" />
            Ridgewood, NJ
          </span>
          <button
            onClick={() => navigate('/guardian-setup')}
            className="h-9 px-4 bg-white border-2 border-divider rounded-xl text-[13px] font-bold text-ink hover:bg-cream transition-colors"
          >
            Guardian Mode
          </button>
        </div>
      </nav>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 'calc(100vh - 140px)' }}>

        {/* Left panel – form */}
        <div className="w-[400px] flex-shrink-0 bg-white border-r-2 border-divider overflow-y-auto px-8 py-8 flex flex-col gap-6">

          <div>
            <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-1">Pedestrian-friendly walking</p>
            <h1 className="text-[28px] font-black text-ink leading-tight" style={{ fontFamily: 'Nunito, sans-serif', letterSpacing: '-0.02em' }}>
              Find a route that fits the person walking.
            </h1>
            <p className="text-[14px] text-slate mt-2 leading-relaxed">
              Compare walking routes by time, sidewalks, crossings, road type, and other visible street characteristics.
            </p>
          </div>

          {/* Location form */}
          <div className="bg-cream rounded-2xl border-2 border-divider overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-divider">
              <div className="w-3 h-3 rounded-full bg-brand ring-2 ring-brand ring-offset-1 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-slate uppercase tracking-wider">Start</div>
                <div className="text-[14px] font-semibold text-ink">Ridgewood High School</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-3 h-3 rounded-full bg-navy ring-2 ring-navy ring-offset-1 flex-shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-slate uppercase tracking-wider">Destination</div>
                <div className="text-[14px] font-semibold text-ink">Ridgewood Train Station</div>
              </div>
            </div>
          </div>

          {/* Profile selector */}
          <div>
            <p className="text-[13px] font-bold text-ink uppercase tracking-wider mb-3">Who are we routing for?</p>
            <div className="flex gap-2">
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  className={`flex-1 flex flex-col items-center gap-1 px-3 py-3 rounded-xl border-2 text-center transition-all ${
                    profile === p.id
                      ? 'border-brand bg-peach'
                      : 'border-divider bg-cream hover:bg-white'
                  }`}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <span className={`text-[12px] font-bold ${profile === p.id ? 'text-brand' : 'text-ink'}`}>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preference slider */}
          <div>
            <div className="flex items-center justify-between text-[12px] font-semibold text-slate mb-2">
              <span>Faster</span>
              <span>More pedestrian-friendly</span>
            </div>
            <div className="relative">
              <div
                className="absolute top-2.5 left-0 h-1.5 rounded-l-full bg-brand"
                style={{ width: `${sliderVal}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={sliderVal}
                onChange={e => { setSliderVal(Number(e.target.value)); setPreferenceValue(Number(e.target.value)); }}
                className="w-full relative z-10"
              />
            </div>
          </div>

          <PrimaryButton onClick={() => navigate('/results')}>
            Compare routes
          </PrimaryButton>

          <p className="text-[12px] text-slate leading-relaxed">
            Pilot coverage currently focuses on Ridgewood. Scores explain route characteristics; they do not guarantee safety.
          </p>
        </div>

        {/* Right panel – map */}
        <div className="flex-1 relative bg-[#E2DBD3] overflow-hidden">
          <LiveMap
            selectedRoute="balanced"
            showAnnotations={true}
            height="100%"
          />

          {/* Floating route card */}
          <div className="absolute top-6 right-6 bg-white rounded-2xl border-2 border-divider p-5 w-[260px] shadow-lg">
            <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">Recommended for child / teen</p>
            <h3 className="text-[17px] font-black text-ink mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>Balanced route</h3>
            <p className="text-[13px] text-slate mb-1">16 min · 0.8 mi · Suitability 81</p>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="px-2 py-1 bg-teal-wash text-teal text-[11px] font-bold rounded-lg">81 · Great for walking</span>
            </div>
            <p className="text-[13px] text-ink mb-4 leading-snug">2 extra minutes for calmer streets and simpler crossings.</p>
            <button
              onClick={() => navigate('/results')}
              className="w-full h-10 bg-brand text-white font-bold text-[13px] rounded-xl border-b-[2px] border-brand-deep"
            >
              View route details
            </button>
          </div>

          {/* Mobile link */}
          <div className="absolute bottom-6 left-6">
            <button
              onClick={() => navigate('/')}
              className="bg-white/90 backdrop-blur-sm border border-divider text-[12px] font-semibold text-slate px-4 py-2 rounded-full hover:bg-white transition-colors"
            >
              ← Back to mobile view
            </button>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-navy px-8 py-5 flex items-center justify-center gap-8 flex-wrap">
        {trustItems.map(item => (
          <div key={item.text} className="flex items-center gap-2.5 text-[13px] font-semibold text-white/80">
            <div className="flex-shrink-0 opacity-80">{item.icon}</div>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
