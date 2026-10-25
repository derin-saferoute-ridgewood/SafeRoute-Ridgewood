import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, Profile, RouteOption } from '../context/AppContext';
import logoImg from '../imports/image-2.png';

// ─── Data ──────────────────────────────────────────────────────────────────

const PROFILES: { id: Profile; label: string; subtitle: string }[] = [
  { id: 'child', label: 'Child / teen', subtitle: 'Calmer streets, simpler crossings' },
  { id: 'general', label: 'General', subtitle: 'Everyday balanced routing' },
  { id: 'older-adult', label: 'Older adult', subtitle: 'Sidewalks and easy crossings' },
];

const ROUTE_OPTIONS: {
  id: RouteOption;
  label: string;
  time: string;
  dist: string;
  score: number;
  badge: string;
  tradeoff: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}[] = [
  {
    id: 'fastest',
    label: 'Fastest',
    time: 'Varies',
    dist: 'Calculated live',
    score: 72,
    badge: 'Live',
    tradeoff: 'Best for the shortest walking time using the current backend route model.',
    color: '#2774C7',
    badgeBg: '#EBF3FF',
    badgeText: '#2774C7',
  },
  {
    id: 'safest',
    label: 'Safest',
    time: 'Varies',
    dist: 'Calculated live',
    score: 86,
    badge: 'Live',
    tradeoff: 'Uses the backend safety-weighted graph to prefer lower-risk street segments.',
    color: '#168B82',
    badgeBg: '#D8F4EE',
    badgeText: '#168B82',
  },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#F26A21' }}>
      {children}
    </p>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const { profile, setProfile, selectedRoute, setSelectedRoute, guardianMode, setGuardianMode } = useApp();
  const [guardianName, setGuardianName] = useState('Mom');
  const [guardianEditing, setGuardianEditing] = useState(false);

  const selectedRouteData = ROUTE_OPTIONS.find(r => r.id === selectedRoute);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFF9F4' }}>

      {/* Sticky header */}
      <header
        className="sticky top-0 z-40 bg-white border-b border-[#e5e5e5] flex items-center justify-between px-5"
        style={{ height: 64 }}
      >
        <button onClick={() => navigate('/')} className="flex items-center">
          <img src={logoImg} alt="SafeRoute+" className="w-auto object-contain" style={{ height: 36 }} />
        </button>
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
          style={{ background: '#FFE3CC', color: '#F26A21' }}
        >
          Ridgewood Pilot
        </span>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-6">

        <div>
          <h1
            className="font-black leading-tight"
            style={{ fontFamily: 'Nunito, sans-serif', fontSize: 28, color: '#263238', letterSpacing: '-0.02em' }}
          >
            Plan your safer walk.
          </h1>
          <p className="text-[14px] leading-relaxed mt-1.5" style={{ color: '#5E6B70' }}>
            Choose a profile, pick your route, and start walking.
          </p>
        </div>

        {/* ─── Profile selector ─── */}
        <div>
          <SectionLabel>Who are we routing for?</SectionLabel>
          <div className="flex gap-2">
            {PROFILES.map(p => {
              const selected = profile === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-2xl border-2 text-center transition-all"
                  style={{
                    borderColor: selected ? '#F26A21' : '#e5e5e5',
                    background: selected ? '#FFE3CC' : 'white',
                  }}
                >

                  <span className="text-[12px] font-bold leading-tight" style={{ color: selected ? '#F26A21' : '#263238' }}>
                    {p.label}
                  </span>
                  <span className="text-[10px] font-semibold leading-tight" style={{ color: selected ? '#D94E0D' : '#777777' }}>
                    {p.subtitle}
                  </span>
                  {selected && (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: '#F26A21' }}>
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4l1.5 1.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Route inputs ─── */}
        <div>
          <SectionLabel>Your route</SectionLabel>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1.5px solid #e5e5e5' }}>
            <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#F26A21', boxShadow: '0 0 0 3px #FFE3CC' }} />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#afafaf' }}>Start</div>
                <div className="text-[14px] font-bold" style={{ color: '#263238' }}>Ridgewood High School</div>
              </div>
            </div>
            <div className="flex items-center px-4 py-1.5" style={{ background: '#f9f9f9' }}>
              <div className="flex flex-col items-center gap-0.5 ml-0.5">
                {[0,1,2].map(i => <div key={i} className="w-0.5 h-0.5 rounded-full" style={{ background: '#ccc' }} />)}
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: '#18384A', boxShadow: '0 0 0 3px #e5e5e5' }} />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#afafaf' }}>Destination</div>
                <div className="text-[14px] font-bold" style={{ color: '#263238' }}>Ridgewood Train Station</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Route comparison ─── */}
        <div>
          <SectionLabel>Compare routes</SectionLabel>
          <div className="flex flex-col gap-2.5">
            {ROUTE_OPTIONS.map(r => {
              const isSelected = selectedRoute === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoute(r.id)}
                  className="flex items-stretch rounded-2xl overflow-hidden text-left w-full transition-all"
                  style={{
                    border: isSelected ? `2px solid ${r.color}` : '2px solid #e5e5e5',
                    background: isSelected ? '#fff9f4' : 'white',
                  }}
                >
                  <div className="w-4 flex-shrink-0" style={{ background: r.color }} />
                  <div className="flex-1 px-4 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-black text-[15px]" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>
                          {r.label}
                        </div>
                        <div className="text-[13px] font-semibold mt-0.5" style={{ color: '#777777' }}>
                          {r.time} · {r.dist}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[12px] font-bold px-2.5 py-1 rounded-full" style={{ background: r.badgeBg, color: r.badgeText }}>
                          {r.score} · {r.badge}
                        </span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: r.color }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[12px] leading-snug mt-2" style={{ color: '#5E6B70' }}>{r.tradeoff}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Guardian mode ─── */}
        <div>
          <SectionLabel>Guardian Mode</SectionLabel>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1.5px solid #e5e5e5' }}>
            <div
              className="flex items-center justify-between px-4 py-4"
              style={{ borderBottom: guardianMode ? '1px solid #f0f0f0' : 'none' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#D8F4EE' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5L3 4.5v5.5c0 3 2.3 5.8 6 6.5 3.7-.7 6-3.5 6-6.5V4.5L9 1.5z" fill="#168B82" fillOpacity="0.2" stroke="#168B82" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M6.5 9l2 2 3.5-3.5" stroke="#168B82" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <div className="text-[14px] font-bold" style={{ color: '#263238' }}>Guardian Mode</div>
                  <div className="text-[12px] font-semibold" style={{ color: '#777777' }}>
                    {guardianMode ? `${guardianName} notified at arrival` : 'Notify a contact when you arrive'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setGuardianMode(!guardianMode)}
                className="relative flex-shrink-0 w-12 h-6 rounded-full transition-colors"
                style={{ background: guardianMode ? '#168B82' : '#e5e5e5' }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                  style={{ left: guardianMode ? 'calc(100% - 22px)' : '2px' }}
                />
              </button>
            </div>

            {guardianMode && (
              <div className="px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#afafaf' }}>Guardian contact</div>
                {guardianEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={guardianName}
                      onChange={e => setGuardianName(e.target.value)}
                      className="flex-1 border-2 rounded-xl px-3 py-2 text-[14px] font-semibold outline-none"
                      style={{ borderColor: '#F26A21', color: '#263238' }}
                      autoFocus
                    />
                    <button
                      onClick={() => setGuardianEditing(false)}
                      className="h-9 px-3 rounded-xl text-white text-[13px] font-bold"
                      style={{ background: '#F26A21' }}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setGuardianEditing(true)}
                    className="w-full flex items-center gap-3 py-2 rounded-xl text-left"
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-black text-[15px] flex-shrink-0" style={{ background: '#FFE3CC', color: '#F26A21', fontFamily: 'Nunito, sans-serif' }}>
                      {guardianName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-bold" style={{ color: '#263238' }}>{guardianName}</div>
                      <div className="text-[12px] font-semibold" style={{ color: '#777777' }}>Tap to change</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4l4 4-4 4" stroke="#afafaf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                )}
                <div className="mt-2 rounded-xl px-3 py-2" style={{ background: '#D8F4EE' }}>
                  <p className="text-[11px] font-semibold" style={{ color: '#168B82' }}>
                    ✓ {guardianName} will receive one message when you arrive. No automatic tracking.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[12px] flex items-center justify-center gap-1.5" style={{ color: '#afafaf' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1a3.5 3.5 0 00-3.5 3.5V5H2v5h8V5H9.5V4.5A3.5 3.5 0 006 1zm0 1.5A2 2 0 018 4.5V5H4V4.5A2 2 0 016 2.5z" fill="#afafaf" />
          </svg>
          Private by design. No automatic tracking. No data sent without approval.
        </p>

        <div className="h-24" />
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white border-t border-[#e5e5e5] px-5 py-4 flex flex-col gap-2">
        <button
          onClick={() => navigate('/active-trip')}
          className="w-full h-[52px] rounded-xl text-white font-bold uppercase tracking-[0.053em] border-b-[3px] transition-transform active:translate-y-[2px]"
          style={{ background: '#F26A21', borderColor: '#D94E0D', fontSize: 15 }}
        >
          START TRIP
        </button>
        <p className="text-center text-[11px] font-semibold" style={{ color: '#afafaf' }}>
          Ridgewood High School → Train Station · {selectedRouteData?.time}
        </p>
      </div>
    </div>
  );
}
