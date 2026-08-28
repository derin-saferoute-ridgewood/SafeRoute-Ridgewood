import { useState } from 'react';
import { useNavigate } from 'react-router';
import logoImg from '../imports/image-2.png';
import derinImg from '../imports/profile.png';
import derekImg from '../imports/unnamed.png';

// ─── Accordion ─────────────────────────────────────────────────────────────

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e5e5e5] last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-4 text-left gap-4"
      >
        <span className="font-bold text-[15px]" style={{ color: '#263238' }}>{title}</span>
        <span
          className="text-[20px] font-light flex-shrink-0 transition-transform"
          style={{ color: '#F26A21', transform: open ? 'rotate(45deg)' : 'none' }}
        >
          +
        </span>
      </button>
      {open && (
        <div className="pb-5 text-[14px] leading-relaxed" style={{ color: '#5E6B70' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── How It Works cards ────────────────────────────────────────────────────

const HOW_CARDS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3L5 8v9c0 5 3.5 9 9 10.5C19.5 26 23 22 23 17V8L14 3z" fill="#D8F4EE" stroke="#168B82" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M10 14l2.5 2.5 5-5" stroke="#168B82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Street-level scoring',
    body: 'Every segment of a walking route is scored using visible street characteristics: sidewalk presence, road speed, crossing type and complexity, and road classification.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="#F26A21" strokeWidth="1.5" />
        <path d="M14 9v6l3.5 3.5" stroke="#F26A21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Three route options',
    body: 'SafeRoute+ always gives you three options: the fastest time, a balanced choice, and the most pedestrian-friendly path. You choose what matters most today.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="9" r="4" fill="#FFE3CC" stroke="#F26A21" strokeWidth="1.5" />
        <path d="M7 25v-2a6 6 0 0112 0v2" stroke="#F26A21" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="21" cy="9" r="3.5" fill="#D8F4EE" stroke="#168B82" strokeWidth="1.5" />
        <path d="M22 25v-1.5a5.5 5.5 0 015.5 5.5" stroke="#168B82" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Profile-aware weights',
    body: 'Scores are re-weighted for the walker. Child/teen profiles flag busier crossings more strongly. Older adult profiles emphasize sidewalk continuity and crossing distance.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 8h16M6 14h11M6 20h8" stroke="#2774C7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Fully explainable',
    body: 'Tap any street segment to see the exact factors behind its score. Every formula is documented publicly. There is no black box.',
  },
];

// ─── Methodology sections ──────────────────────────────────────────────────

const METHODOLOGY_SECTIONS = [
  {
    title: 'Core principle',
    content: (
      <>
        <p>SafeRoute+ describes pedestrian-friendly street characteristics. It does not predict crash probability. Scores reflect what can be measured from open data: sidewalk presence, road speed, crossing type, road classification, and intersection complexity.</p>
        <p className="mt-2">A higher score means the route has more pedestrian-friendly features. It does not mean the route is safe in an absolute sense.</p>
      </>
    ),
  },
  {
    title: 'Segment risk formula',
    content: (
      <>
        <p className="mb-2">Each street segment receives a base risk score:</p>
        <div className="rounded-xl p-3 font-mono text-[13px]" style={{ background: '#f5f5f5' }}>
          R<sub>i</sub> = w₁·Road<sub>i</sub> + w₂·Cross<sub>i</sub> + w₃·Speed<sub>i</sub> + w₄·Sidewalk<sub>i</sub>
        </div>
        <p className="mt-2">Where Road, Cross, Speed, and Sidewalk are normalized 0–1 risk indicators, and weights w₁–w₄ vary by profile.</p>
      </>
    ),
  },
  {
    title: 'Profile weights',
    content: (
      <table className="w-full text-[13px] border-collapse">
        <thead>
          <tr style={{ color: '#777777' }}>
            <th className="text-left py-1 pr-4">Factor</th>
            <th className="text-center py-1 pr-4">Child</th>
            <th className="text-center py-1 pr-4">General</th>
            <th className="text-center py-1">Older Adult</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Road class', '0.25', '0.22', '0.20'],
            ['Crossing complexity', '0.35', '0.28', '0.32'],
            ['Traffic speed', '0.25', '0.25', '0.22'],
            ['Sidewalk presence', '0.15', '0.25', '0.26'],
          ].map(row => (
            <tr key={row[0]} style={{ borderTop: '1px solid #f0f0f0' }}>
              {row.map((cell, i) => (
                <td key={i} className={`py-2 ${i === 0 ? 'pr-4 font-semibold' : 'text-center pr-4'}`} style={{ color: i === 0 ? '#263238' : '#5E6B70' }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  {
    title: 'Route suitability score',
    content: (
      <>
        <p className="mb-2">A route's overall suitability score aggregates segment scores weighted by length:</p>
        <div className="rounded-xl p-3 font-mono text-[13px]" style={{ background: '#f5f5f5' }}>
          S<sub>route</sub> = 100 · (1 − Σ(d<sub>i</sub>·R<sub>i</sub>) / Σd<sub>i</sub>)
        </div>
        <p className="mt-2">Where d<sub>i</sub> is the length of segment i and R<sub>i</sub> is its normalized risk score. Higher scores indicate more pedestrian-friendly routes.</p>
      </>
    ),
  },
  {
    title: 'Data sources',
    content: (
      <ul className="flex flex-col gap-1.5">
        {[
          'OpenStreetMap — road classification, sidewalk presence, crossing attributes',
          'NJDOT crash database — historical pedestrian crash density',
          'NJ Speed Limit API — posted speed limits by segment',
          'Bergen County GIS — jurisdiction boundaries',
        ].map(item => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-brand flex-shrink-0 mt-0.5">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: 'Data confidence and limitations',
    content: (
      <>
        <p>Data confidence ranges from 58–84% depending on OpenStreetMap completeness for the specific area. Low confidence means some attributes were inferred rather than directly recorded.</p>
        <p className="mt-2">SafeRoute+ scores do not account for: temporary construction, real-time traffic, driver behavior, time of day visibility, or weather conditions. Use personal judgment alongside any score.</p>
      </>
    ),
  },
  {
    title: 'Guardian Mode privacy',
    content: (
      <>
        <p>Guardian Mode sends no data automatically. Every message is drafted and approved by the walker before sending. Location is only included in pickup requests when the walker explicitly approves it.</p>
        <p className="mt-2">SafeRoute+ does not store location history. No background location access is requested. Contacts are stored locally on the device only.</p>
      </>
    ),
  },
  {
    title: 'Model version and updates',
    content: (
      <p>Current model version: v2.1.0. The scoring formula and weights are reviewed quarterly. All version changes are logged publicly. The current coefficients were last validated against the Bergen County pedestrian dataset in Q1 2026.</p>
    ),
  },
];

// ─── Founders ─────────────────────────────────────────────────────────────

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AboutScreen() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'story' | 'how' | 'methodology'>('story');

  return (
    <div className="min-h-screen" style={{ background: '#FFF9F4' }}>

      {/* Sticky header */}
      <header
        className="sticky top-0 z-40 bg-white border-b border-[#e5e5e5]"
        style={{ height: 64 }}
      >
        <div className="max-w-[760px] mx-auto px-5 h-full flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-9 h-9 rounded-xl transition-colors"
            style={{ background: '#f5f5f5' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 5l-4 4 4 4" stroke="#263238" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <img
            src={logoImg}
            alt="SafeRoute+"
            className="h-8 w-auto object-contain"
            style={{ height: 80 }}

          />
          <span
            className="ml-auto text-[12px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: '#FFE3CC', color: '#F26A21' }}
          >
            Bergen Pilot
          </span>
        </div>
      </header>

      {/* Hero */}
      <div
        className="text-center px-5 py-12"
        style={{ background: 'white', borderBottom: '1.5px solid #e5e5e5' }}
      >
        <h1
          className="font-black"
          style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(28px, 5vw, 40px)', color: '#263238', letterSpacing: '-0.02em' }}
        >
          About SafeRoute+
        </h1>
        <p className="mt-3 mx-auto" style={{ fontSize: 16, color: '#777777', maxWidth: 480 }}>
          A pedestrian routing tool built for children, older adults, and everyday walkers in Bergen County, NJ.
          Explainable scores. Open methodology. No tracking.
        </p>
      </div>

      {/* Tab bar */}
      <div className="sticky top-[64px] z-30 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[760px] mx-auto px-5 flex">
          {(['story', 'how', 'methodology'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3.5 text-[13px] font-bold transition-colors border-b-2"
              style={{
                color: tab === t ? '#F26A21' : '#777777',
                borderColor: tab === t ? '#F26A21' : 'transparent',
              }}
            >
              {t === 'story' ? 'Our Story' : t === 'how' ? 'How It Works' : 'Methodology'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-5 py-8">

        {/* ─── OUR STORY TAB ────────────────────── */}
        {tab === 'story' && (
          <div className="flex flex-col gap-8">

            {/* Origin statement */}
            <div className="text-center pt-2">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#F26A21' }}>
                Why we built this
              </p>
              <h2
                className="font-black leading-tight mb-4"
                style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(24px, 5vw, 34px)', color: '#263238', letterSpacing: '-0.02em' }}
              >
                A moment that changed everything.
              </h2>
              <p className="text-[15px] leading-relaxed mx-auto" style={{ color: '#5E6B70', maxWidth: 560 }}>
                SafeRoute+ didn&apos;t start with a whiteboard or a business plan. It started with something we can&apos;t unsee.
              </p>
            </div>

            {/* The story */}
            <div className="bg-white rounded-2xl p-6" style={{ border: '1.5px solid #e5e5e5' }}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: '#168B82' }}>The moment</p>
              <div className="flex flex-col gap-4 text-[15px] leading-relaxed" style={{ color: '#263238' }}>
                <p>
                  Derek and Derin have been close friends since middle school — the kind of friendship built over years of shared classes, inside jokes, and the same neighborhood streets. In 8th grade, both of them sat for the entrance exam to Bergen County Academies, the competitive magnet school they had been working toward together.
                </p>
                <p>
                  On the way to that exam, they witnessed something that has never left them. A peer — someone their age, with the same hopes and aspirations, going to the very same place — was struck by a car while crossing the road. The peer had chosen to cross at a busy intersection rather than walking a short distance to a side street with a dedicated pedestrian crossing. It was a split-second decision. It had devastating consequences.
                </p>
                <p>
                  That person survived, but the weight of that morning stayed. It was not a fatal accident. It was a routing problem. A young person made a reasonable-looking choice with incomplete information — and the street gave them no signal that a safer crossing was close by.
                </p>

                {/* Pull quote */}
                <div className="rounded-xl px-5 py-4 my-2" style={{ background: '#FFF3C9', borderLeft: '3px solid #F26A21' }}>
                  <p className="text-[15px] font-bold italic leading-snug" style={{ color: '#9B7B0D' }}>
                    "It was a routing problem. A young person made a reasonable-looking choice with incomplete information — and the street gave them no signal that a safer crossing was close by."
                  </p>
                </div>

                <p>
                  The question we couldn&apos;t shake was simple: what if a tool existed that could tell you — before you walked — which way was actually safer? Not just faster. Not just shorter. <em>Safer</em>, and why.
                </p>
                <p>
                  That question became SafeRoute+. We built it for every kid walking to school, every older adult navigating a busy downtown, and every parent who wishes they could hand their child something more than just a vague sense of caution.
                </p>
              </div>
            </div>

            {/* Mission statement */}
            <div className="rounded-2xl p-6" style={{ background: '#18384A' }}>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>Our mission</p>
              <p className="text-[17px] font-bold leading-relaxed" style={{ color: 'white' }}>
                To make pedestrian routing transparent, explainable, and genuinely useful for the people who need it most — especially those who are most vulnerable on our streets.
              </p>
            </div>

            {/* Founders */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest mb-5 text-center" style={{ color: '#F26A21' }}>
                The founders
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Derek */}
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1.5px solid #e5e5e5' }}>
                  <div className="aspect-[4/3] overflow-hidden" style={{ background: '#f0f0f0' }}>
                    <img
                      src={derekImg}
                      alt="Derek speaking at the UN Youth Forum"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-black text-[18px]" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>Derek T.</h3>
                        <p className="text-[12px] font-semibold" style={{ color: '#777777' }}>Co-founder</p>
                      </div>
                      <a
                        href="https://www.linkedin.com/in/derek-t-40779a354/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
                        style={{ background: '#E8F0FE', color: '#0A66C2' }}
                      >
                        <LinkedInIcon />
                        LinkedIn
                      </a>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: '#5E6B70' }}>
                      Student at Ridgewood High School.
                    </p>
                  </div>
                </div>

                {/* Derin */}
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1.5px solid #e5e5e5' }}>
                  <div className="aspect-[4/3] overflow-hidden flex items-center justify-center" style={{ background: '#2563EB' }}>
                    <img
                      src={derinImg}
                      alt="Derin"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-black text-[18px]" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>Derin E.</h3>
                        <p className="text-[12px] font-semibold" style={{ color: '#777777' }}>Co-founder</p>
                      </div>
                      <a
                        href="https://www.linkedin.com/in/derinege"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
                        style={{ background: '#E8F0FE', color: '#0A66C2' }}
                      >
                        <LinkedInIcon />
                        LinkedIn
                      </a>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: '#5E6B70' }}>
                      Student at Dwight-Englewood School.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl p-6 text-center" style={{ border: '1.5px solid #e5e5e5' }}>
              <p className="font-black text-[18px] mb-2" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>Get in touch</p>
              <p className="text-[14px] leading-relaxed mb-4" style={{ color: '#5E6B70' }}>
                We&apos;re a small team and we read every message. Reach out if you want to collaborate, contribute data, or bring SafeRoute+ to your community.
              </p>
              <a
                href="mailto:derin.saferoute.bergen@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px]"
                style={{ background: '#FFE3CC', color: '#F26A21' }}
              >
                derin.saferoute.bergen@gmail.com
              </a>
            </div>

          </div>
        )}

        {/* ─── HOW IT WORKS TAB ─────────────────── */}
        {tab === 'how' && (
          <div className="flex flex-col gap-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {HOW_CARDS.map(card => (
                <div
                  key={card.title}
                  className="bg-white rounded-2xl p-5"
                  style={{ border: '1.5px solid #e5e5e5' }}
                >
                  <div className="mb-3">{card.icon}</div>
                  <h3 className="font-black text-[16px] mb-2" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>
                    {card.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: '#5E6B70' }}>
                    {card.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Profiles */}
            <div className="bg-white rounded-2xl p-6" style={{ border: '1.5px solid #e5e5e5' }}>
              <h2
                className="font-black text-[20px] mb-4"
                style={{ fontFamily: 'Nunito, sans-serif', color: '#263238', letterSpacing: '-0.01em' }}
              >
                Who is SafeRoute+ for?
              </h2>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Child / teen', body: 'Routes are weighted to flag busier crossings, higher-speed roads, and major arterial intersections more strongly.' },
                  { label: 'Older adult', body: 'Routes emphasize sidewalk continuity, crossing distance, and lower-traffic alternatives.' },
                  { label: 'General pedestrian', body: 'Balanced weighting across all factors. Good for most everyday walking decisions.' },
                ].map(p => (
                  <div key={p.label} className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: '#F26A21' }} />
                    <div>
                      <div className="font-bold text-[14px] mb-0.5" style={{ color: '#263238' }}>{p.label}</div>
                      <div className="text-[13px] leading-relaxed" style={{ color: '#5E6B70' }}>{p.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score bands */}
            <div className="bg-white rounded-2xl p-6" style={{ border: '1.5px solid #e5e5e5' }}>
              <h2
                className="font-black text-[20px] mb-4"
                style={{ fontFamily: 'Nunito, sans-serif', color: '#263238', letterSpacing: '-0.01em' }}
              >
                What do scores mean?
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  { range: '75–100', label: 'Great', desc: 'Predominantly residential streets with good sidewalk coverage and simple crossings.', bg: '#D8F4EE', text: '#168B82' },
                  { range: '60–74', label: 'OK', desc: 'Walkable but includes some higher-speed segments or more complex crossings.', bg: '#FFF3C9', text: '#9B7B0D' },
                  { range: '0–59', label: 'Caution', desc: 'One or more segments with significant pedestrian-unfriendly characteristics.', bg: '#FCE3E0', text: '#D9534F' },
                ].map(b => (
                  <div key={b.range} className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: b.bg }}>
                    <span className="font-black text-[16px] w-16 flex-shrink-0" style={{ fontFamily: 'Nunito, sans-serif', color: b.text }}>{b.range}</span>
                    <span className="font-bold text-[13px] w-16 flex-shrink-0" style={{ color: b.text }}>{b.label}</span>
                    <span className="text-[13px] leading-snug" style={{ color: b.text }}>{b.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy */}
            <div className="rounded-2xl p-6" style={{ background: '#18384A' }}>
              <div className="flex items-center gap-2 mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L4 5v6c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V5L10 2z" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M7.5 10l2 2 3.5-3.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="font-black text-[16px] text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>Privacy by design</h3>
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                SafeRoute+ does not track anyone automatically. No background location access is requested.
                Guardian Mode messages are drafted and approved by the walker before sending. Location is never
                shared without explicit, per-request approval.
              </p>
            </div>
          </div>
        )}

        {/* ─── METHODOLOGY TAB ──────────────────── */}
        {tab === 'methodology' && (
          <div className="flex flex-col gap-4">

            <div
              className="rounded-2xl px-5 py-4"
              style={{ background: '#FFF3C9', border: '1.5px solid #C8910B' }}
            >
              <p className="text-[13px] font-semibold leading-relaxed" style={{ color: '#9B7B0D' }}>
                SafeRoute+ scores describe visible street characteristics from open data. They are not predictions
                of crash probability and should not replace personal judgment. Model version: v2.1.0.
              </p>
            </div>

            <div className="bg-white rounded-2xl px-5" style={{ border: '1.5px solid #e5e5e5' }}>
              {METHODOLOGY_SECTIONS.map(s => (
                <Accordion key={s.title} title={s.title}>
                  {s.content}
                </Accordion>
              ))}
            </div>

          </div>
        )}

        <div className="h-12" />
      </div>

      {/* Bottom CTA */}
      <div
        className="sticky bottom-0 bg-white border-t border-[#e5e5e5] px-5 py-4"
      >
        <button
          onClick={() => navigate('/welcome')}
          className="w-full h-[50px] rounded-xl text-white font-bold uppercase tracking-[0.053em] border-b-[3px]"
          style={{ background: '#F26A21', borderColor: '#D94E0D', fontSize: 15 }}
        >
          PLAN A ROUTE
        </button>
      </div>
    </div>
  );
}
