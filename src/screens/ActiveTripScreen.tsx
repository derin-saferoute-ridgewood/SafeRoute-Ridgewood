import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import LiveMap from '../components/LiveMap';
import logoImg from '../imports/image-2.png';

type Sheet =
  | 'ok'
  | 'pickup'
  | 'route-detail'
  | 'off-route'
  | 'segment'
  | 'guardian'
  | 'sunset'
  | null;

// ─── Shared bottom sheet wrapper ───────────────────────────────────────────

function BottomSheet({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 flex items-end" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full bg-white rounded-t-3xl px-5 py-5 pb-10 max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: '#CDD4D6' }} />
        {children}
      </div>
    </div>
  );
}

// ─── I'm OK sheet ──────────────────────────────────────────────────────────

function OKSheet({ guardianName, onClose }: { guardianName: string; onClose: () => void }) {
  return (
    <BottomSheet onClose={onClose}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#D8F4EE' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3 3 7-7" stroke="#168B82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-[17px] font-black" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>Send a status update</h2>
      </div>
      <div className="rounded-xl border-2 border-[#e5e5e5] p-3 mb-3" style={{ background: '#FFF9F4' }}>
        <p className="text-[15px]" style={{ color: '#263238' }}>"Hey {guardianName}, just checking in. All good, on my way!"</p>
      </div>
      <p className="text-[12px] mb-4" style={{ color: '#777777' }}>Review before sending. SafeRoute+ sends nothing automatically.</p>
      <button className="w-full h-12 rounded-xl text-white font-bold text-[15px] border-b-[3px] mb-2" style={{ background: '#F26A21', borderColor: '#D94E0D' }}>
        Send via Messages
      </button>
      <button onClick={onClose} className="w-full h-12 text-[14px] font-semibold" style={{ color: '#5E6B70' }}>Cancel</button>
    </BottomSheet>
  );
}

// ─── Pickup sheet ──────────────────────────────────────────────────────────

function PickupSheet({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet onClose={onClose}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#EBF3FF' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 10l2-4h8l2 4v2H2v-2zm0 0h2m10 0h-2M5 10v2m6-2v2M3.5 6h9" stroke="#2774C7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-[17px] font-black" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>Request a pickup</h2>
      </div>
      <div className="rounded-xl border-2 border-[#e5e5e5] p-3 mb-3" style={{ background: '#FFF9F4' }}>
        <p className="text-[15px]" style={{ color: '#263238' }}>"Mom, can you pick me up? I am near Oak St and E Ridgewood Ave."</p>
      </div>
      <p className="text-[12px] mb-4" style={{ color: '#777777' }}>Review before sending. Location is included only if you approve.</p>
      <button className="w-full h-12 rounded-xl text-white font-bold text-[15px] border-b-[3px] mb-2" style={{ background: '#2774C7', borderColor: '#1a5fb0' }}>
        Send via Messages
      </button>
      <button onClick={onClose} className="w-full h-12 text-[14px] font-semibold" style={{ color: '#5E6B70' }}>Cancel</button>
    </BottomSheet>
  );
}

// ─── Route detail sheet ────────────────────────────────────────────────────

function RouteDetailSheet({ selectedRoute, onClose }: { selectedRoute: string; onClose: () => void }) {
  const routes: Record<string, { label: string; score: number; badge: string; time: string; dist: string; color: string; badgeBg: string; badgeText: string; tradeoff: string; positive: string[]; caution: string[] }> = {
    fastest: { label: 'Fastest', score: 68, badge: 'OK', time: '14 min', dist: '0.7 mi', color: '#2774C7', badgeBg: '#FFF3C9', badgeText: '#9B7B0D', tradeoff: 'Gets there quickly but has a busier crossing on Maple Avenue.', positive: ['Sidewalk along most segments', 'Signalized crossing at start'], caution: ['High-speed crossing at Maple Ave', 'Arterial road stretch'] },
    balanced: { label: 'Balanced', score: 81, badge: 'Great', time: '16 min', dist: '0.8 mi', color: '#F26A21', badgeBg: '#D8F4EE', badgeText: '#168B82', tradeoff: '+2 min for calmer streets and simpler crossings.', positive: ['Sidewalks on most of the route', 'Residential streets', 'Signalized crossing near destination'], caution: ['One higher-speed crossing at Maple Ave'] },
    pedestrian: { label: 'Most pedestrian-friendly', score: 89, badge: 'Excellent', time: '19 min', dist: '0.9 mi', color: '#168B82', badgeBg: '#D8F4EE', badgeText: '#168B82', tradeoff: '+5 min to avoid large roads and difficult intersections.', positive: ['Predominantly residential streets', 'Continuous sidewalk coverage', 'All crossings are signalized'], caution: ['Longer route distance'] },
  };
  const r = routes[selectedRoute] ?? routes.balanced;

  return (
    <BottomSheet onClose={onClose}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[18px] font-black" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>{r.label}</h2>
          <p className="text-[13px] font-semibold" style={{ color: '#777777' }}>{r.time} · {r.dist}</p>
        </div>
        <div className="w-14 h-14 rounded-full flex flex-col items-center justify-center" style={{ background: r.badgeBg, border: `2.5px solid ${r.color}` }}>
          <span className="text-[20px] font-black" style={{ fontFamily: 'Nunito, sans-serif', color: r.color, lineHeight: 1 }}>{r.score}</span>
          <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: r.color }}>{r.badge}</span>
        </div>
      </div>

      <p className="text-[14px] leading-relaxed mb-4" style={{ color: '#5E6B70' }}>{r.tradeoff}</p>

      <div className="mb-3">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#168B82' }}>Positive factors</p>
        <div className="flex flex-col gap-1.5">
          {r.positive.map(f => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#168B82' }} />
              <span className="text-[13px] font-semibold" style={{ color: '#263238' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#F6BD31' }}>Caution</p>
        <div className="flex flex-col gap-1.5">
          {r.caution.map(f => (
            <div key={f} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#F6BD31' }} />
              <span className="text-[13px] font-semibold" style={{ color: '#263238' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background: '#f5f5f5' }}>
        <span className="text-[12px] font-semibold" style={{ color: '#777777' }}>Data confidence 72% · Model v2.1.0</span>
      </div>

      <button onClick={onClose} className="w-full h-12 rounded-xl text-white font-bold text-[15px] border-b-[3px]" style={{ background: '#F26A21', borderColor: '#D94E0D' }}>
        Done
      </button>
    </BottomSheet>
  );
}

// ─── Off-route sheet ───────────────────────────────────────────────────────

function OffRouteSheet({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet onClose={onClose}>
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#FFF3C9', border: '2px solid #C8910B' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 4L4 22h20L14 4z" fill="#FFF3C9" stroke="#F6BD31" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M14 11v5M14 18.5h.01" stroke="#9B7B0D" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <h2 className="text-[20px] font-black text-center mb-2" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>You are off your planned route.</h2>
      <p className="text-[14px] text-center leading-relaxed mb-6" style={{ color: '#5E6B70' }}>
        Your location appears farther from the selected route. Would you like to adjust your plan?
      </p>
      <div className="flex flex-col gap-2.5">
        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl text-white font-bold text-[15px] border-b-[3px]"
          style={{ background: '#F26A21', borderColor: '#D94E0D' }}
        >
          Recalculate route
        </button>
        <div className="grid grid-cols-2 gap-2.5">
          <button onClick={onClose} className="h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-[14px]" style={{ background: '#D8F4EE', color: '#168B82', border: '2px solid #168B82' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="#168B82" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
            I am OK
          </button>
          <button onClick={onClose} className="h-12 flex items-center justify-center gap-2 rounded-xl font-bold text-[14px]" style={{ background: '#EBF3FF', color: '#2774C7', border: '2px solid #2774C7' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 9l2-4h6l2 4v1H2V9zm1 0h1m8 0h-1" stroke="#2774C7" strokeWidth="1.25" strokeLinecap="round" /></svg>
            Need pickup
          </button>
        </div>
        <button onClick={onClose} className="w-full h-10 text-[14px] font-semibold" style={{ color: '#777777' }}>Dismiss</button>
      </div>
    </BottomSheet>
  );
}

// ─── Street segment sheet ──────────────────────────────────────────────────

function SegmentSheet({ onClose }: { onClose: () => void }) {
  const factors = [
    { label: 'Sidewalk present', positive: true },
    { label: 'Signal nearby', positive: true },
    { label: '35 mph traffic', positive: false },
    { label: 'Longer crossing', positive: false },
    { label: 'Major intersection', positive: false },
  ];

  return (
    <BottomSheet onClose={onClose}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#D9534F' }} />
        <h2 className="text-[17px] font-black" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>Maple Avenue crossing</h2>
        <span className="ml-auto text-[13px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#FCE3E0', color: '#D9534F' }}>Score 58</span>
      </div>

      <p className="text-[14px] leading-relaxed mb-4" style={{ color: '#5E6B70' }}>
        This segment has faster traffic and a more complicated crossing. It scored lower than the route average.
      </p>

      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#777777' }}>What affects this score?</p>
        <div className="flex flex-wrap gap-2">
          {factors.map(f => (
            <span
              key={f.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold"
              style={{
                background: f.positive ? '#D8F4EE' : '#FFF3C9',
                color: f.positive ? '#168B82' : '#9B7B0D',
                border: `1.5px solid ${f.positive ? '#168B82' : '#C8910B'}`,
              }}
            >
              <span>{f.positive ? '↑' : '↓'}</span>
              {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl px-3 py-2.5 mb-4" style={{ background: '#FFF3C9', border: '1px solid #C8910B' }}>
        <p className="text-[12px] font-semibold leading-relaxed" style={{ color: '#9B7B0D' }}>
          Suitability scores describe street characteristics, not a guarantee of safety or a prediction of crashes.
        </p>
      </div>

      <button onClick={onClose} className="w-full h-12 rounded-xl font-bold text-[15px] border-2" style={{ borderColor: '#afafaf', color: '#1cb0f6', background: 'transparent' }}>
        Got it
      </button>
    </BottomSheet>
  );
}

// ─── Guardian setup sheet ──────────────────────────────────────────────────

function GuardianSheet({ onClose }: { onClose: () => void }) {
  const { guardianMode, setGuardianMode } = useApp();
  const [name, setName] = useState('Mom');

  return (
    <BottomSheet onClose={onClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#D8F4EE' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L4 5v6c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V5L10 2z" fill="#168B82" fillOpacity="0.2" stroke="#168B82" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7 10l2 2 4-4" stroke="#168B82" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-[17px] font-black" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>Guardian Mode</h2>
        <button
          onClick={() => setGuardianMode(!guardianMode)}
          className="ml-auto relative w-12 h-6 rounded-full transition-colors flex-shrink-0"
          style={{ background: guardianMode ? '#168B82' : '#e5e5e5' }}
        >
          <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ left: guardianMode ? 'calc(100% - 22px)' : '2px' }} />
        </button>
      </div>

      <div className="mb-4">
        <label className="text-[12px] font-bold uppercase tracking-widest block mb-1.5" style={{ color: '#afafaf' }}>Guardian contact name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border-2 rounded-xl px-4 py-3 text-[15px] font-semibold outline-none"
          style={{ borderColor: '#e5e5e5', color: '#263238' }}
          onFocus={e => e.currentTarget.style.borderColor = '#F26A21'}
          onBlur={e => e.currentTarget.style.borderColor = '#e5e5e5'}
        />
      </div>

      {[
        { text: 'Arrival notification when you reach your destination' },
        { text: 'Optional check-in messages you draft and approve first' },
        { text: 'One-tap pickup request with optional location share' },
      ].map(item => (
        <div key={item.text} className="flex items-start gap-2.5 mb-2">
          <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0 mt-0.5" fill="none">
            <path d="M3 8l3 3 7-7" stroke="#168B82" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[13px] font-semibold leading-snug" style={{ color: '#263238' }}>{item.text}</span>
        </div>
      ))}

      <div className="rounded-xl px-3 py-2.5 mt-3 mb-4" style={{ background: '#D8F4EE' }}>
        <p className="text-[12px] font-semibold" style={{ color: '#168B82' }}>
          No automatic location sharing. No live tracking. Everything requires your approval.
        </p>
      </div>

      <button onClick={onClose} className="w-full h-12 rounded-xl text-white font-bold text-[15px] border-b-[3px]" style={{ background: '#168B82', borderColor: '#0E7A72' }}>
        Save Guardian Settings
      </button>
    </BottomSheet>
  );
}

// ─── Sunset advisory sheet ─────────────────────────────────────────────────

function SunsetSheet({ onClose }: { onClose: () => void }) {
  return (
    <BottomSheet onClose={onClose}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FFE3CC' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="9" r="4" stroke="#F26A21" strokeWidth="1.5" />
            <path d="M10 3V1m0 16v-2M3 9H1m16 0h-2M4.9 4.9 3.5 3.5m11.1 11.1-1.4-1.4M15.1 4.9l1.4-1.4M3.5 16.5l1.4-1.4M4 15h12" stroke="#F26A21" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="text-[17px] font-black" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>Sunset Advisory</h2>
      </div>

      <div className="rounded-2xl p-4 mb-4" style={{ background: '#FFE3CC', border: '1.5px solid #F26A21' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-bold" style={{ color: '#D94E0D' }}>Sunset today</span>
          <span className="text-[18px] font-black" style={{ fontFamily: 'Nunito, sans-serif', color: '#F26A21' }}>7:48 PM</span>
        </div>
        <p className="text-[13px] leading-relaxed" style={{ color: '#D94E0D' }}>
          Your estimated arrival time is 4:32 PM — well before sunset. No visibility concerns for this trip.
        </p>
      </div>

      {[
        { icon: '🌅', title: 'Visibility window', body: 'Pedestrian suitability scores do not account for reduced visibility at dusk. Plan trips to finish before sunset when possible.' },
        { icon: '🔆', title: 'Bright clothing', body: 'If walking near or after dusk, wearing bright or reflective clothing improves visibility to drivers.' },
        { icon: '📱', title: 'Guardian notification', body: 'Guardian Mode can notify your contact if you have not arrived by your estimated time.' },
      ].map(item => (
        <div key={item.title} className="flex items-start gap-3 mb-3">
          <span className="text-[20px] flex-shrink-0 mt-0.5">{item.icon}</span>
          <div>
            <div className="text-[13px] font-bold mb-0.5" style={{ color: '#263238' }}>{item.title}</div>
            <div className="text-[12px] leading-relaxed" style={{ color: '#5E6B70' }}>{item.body}</div>
          </div>
        </div>
      ))}

      <button onClick={onClose} className="w-full h-12 rounded-xl font-bold text-[15px] border-2 mt-2" style={{ borderColor: '#F26A21', color: '#F26A21', background: 'transparent' }}>
        Got it
      </button>
    </BottomSheet>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────

export default function ActiveTripScreen() {
  const navigate = useNavigate();
  const { guardianMode, selectedRoute } = useApp();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [guardianName] = useState('Mom');

  const close = () => setSheet(null);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#18384A' }}>

      {/* Full-screen map */}
      <div className="absolute inset-0">
        <LiveMap
          selectedRoute={selectedRoute}
          showUserDot={true}
          showAnnotations={false}
          height="100%"
        />
      </div>

      {/* Top bar */}
      <div className="relative z-10 px-4 pt-12 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.9)' }}
          >
            <img src={logoImg} alt="Home" className="w-6 h-6 object-contain" />
          </button>

          {guardianMode && (
            <button
              onClick={() => setSheet('guardian')}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold text-white"
              style={{ background: '#168B82' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L2 3v4c0 2 1.6 3.8 4 4.3 2.4-.5 4-2.3 4-4.3V3L6 1z" fill="white" fillOpacity="0.3" stroke="white" strokeWidth="1" strokeLinejoin="round" />
                <path d="M4 6l1.5 1.5L8 4" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Guardian Mode on
            </button>
          )}

          <button
            onClick={() => setSheet('sunset')}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold"
            style={{ background: 'rgba(255,255,255,0.9)', color: '#263238' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="5.5" r="2.5" stroke="#F26A21" strokeWidth="1.25" />
              <path d="M2.5 9.5h7M6 1.5V.5m4.5 4H12M0 5.5h.5M2 2 1 1m9 1 1-1" stroke="#F26A21" strokeWidth="1" strokeLinecap="round" />
            </svg>
            Sunset 7:48 PM
          </button>

          <span className="ml-auto rounded-full px-3 py-1.5 text-[12px] font-bold" style={{ background: 'rgba(255,255,255,0.9)', color: '#263238' }}>
            Arrive by 4:32 PM
          </span>
        </div>

        {/* Next direction */}
        <div className="bg-white rounded-2xl border-2 border-[#e5e5e5] p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#F26A21' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14M10 3L6 7M10 3l4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold" style={{ color: '#263238' }}>Continue on E Ridgewood Ave for 0.2 mi</div>
            <div className="text-[12px] font-semibold" style={{ color: '#777777' }}>Calmer crossing ahead in 2 minutes</div>
          </div>
        </div>

        {/* Annotation tap */}
        <button
          onClick={() => setSheet('segment')}
          className="self-start flex items-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-bold"
          style={{ background: '#FCE3E0', color: '#D9534F', border: '1px solid #D9534F' }}
        >
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#D9534F' }} />
          Higher speed crossing ahead · Tap for details
        </button>
      </div>

      {/* Bottom panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 rounded-t-3xl px-4 pt-4 pb-10" style={{ background: 'rgba(255,255,255,0.97)' }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: '#CDD4D6' }} />

        {/* Route info row */}
        <button
          onClick={() => setSheet('route-detail')}
          className="w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3 mb-2.5 text-left"
          style={{ borderColor: '#e5e5e5' }}
        >
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: selectedRoute === 'fastest' ? '#2774C7' : selectedRoute === 'balanced' ? '#F26A21' : '#168B82' }} />
          <div className="flex-1">
            <span className="text-[14px] font-bold" style={{ color: '#263238' }}>
              {selectedRoute === 'fastest' ? 'Fastest' : selectedRoute === 'balanced' ? 'Balanced' : 'Most pedestrian-friendly'} route
            </span>
            <span className="ml-2 text-[12px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#D8F4EE', color: '#168B82' }}>
              Score {selectedRoute === 'fastest' ? '68' : selectedRoute === 'balanced' ? '81' : '89'}
            </span>
          </div>
          <span className="text-[12px] font-semibold" style={{ color: '#1cb0f6' }}>Details →</span>
        </button>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          <button
            onClick={() => setSheet('ok')}
            className="flex items-center gap-2.5 rounded-xl border-2 px-4 py-3.5 text-left"
            style={{ borderColor: '#e5e5e5' }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#D8F4EE' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3 3 7-7" stroke="#168B82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold" style={{ color: '#263238' }}>{"I'm OK"}</div>
              <div className="text-[11px] font-semibold" style={{ color: '#777777' }}>Send update</div>
            </div>
          </button>

          <button
            onClick={() => setSheet('pickup')}
            className="flex items-center gap-2.5 rounded-xl border-2 px-4 py-3.5 text-left"
            style={{ borderColor: '#e5e5e5' }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EBF3FF' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 10l2-4h8l2 4v2H2v-2zm0 0h2m10 0h-2" stroke="#2774C7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="text-[13px] font-bold" style={{ color: '#263238' }}>Need pickup</div>
              <div className="text-[11px] font-semibold" style={{ color: '#777777' }}>Request ride</div>
            </div>
          </button>
        </div>

        {/* Secondary actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => setSheet('off-route')}
            className="text-[13px] font-semibold py-2"
            style={{ color: '#5E6B70' }}
          >
            Simulate off-route
          </button>
          <button
            onClick={() => setSheet('guardian')}
            className="text-[13px] font-semibold py-2"
            style={{ color: '#168B82' }}
          >
            Guardian settings
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-[13px] font-semibold py-2"
            style={{ color: '#D9534F' }}
          >
            End route
          </button>
        </div>
      </div>

      {/* ─── Modals ─── */}
      {sheet === 'ok'          && <OKSheet guardianName={guardianName} onClose={close} />}
      {sheet === 'pickup'      && <PickupSheet onClose={close} />}
      {sheet === 'route-detail'&& <RouteDetailSheet selectedRoute={selectedRoute} onClose={close} />}
      {sheet === 'off-route'   && <OffRouteSheet onClose={close} />}
      {sheet === 'segment'     && <SegmentSheet onClose={close} />}
      {sheet === 'guardian'    && <GuardianSheet onClose={close} />}
      {sheet === 'sunset'      && <SunsetSheet onClose={close} />}
    </div>
  );
}
