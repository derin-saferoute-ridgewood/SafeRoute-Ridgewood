import { useNavigate } from 'react-router';
import TopBar from '../components/TopBar';
import { SidewalkIcon, SpeedometerIcon } from '../components/Icons';

const sections = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="14" width="18" height="4" rx="1" stroke="#F26A21" strokeWidth="1.75" />
        <path d="M6 14V6M18 14V6" stroke="#F26A21" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M3 6h18" stroke="#F26A21" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
    bg: 'bg-peach',
    title: 'Street features',
    text: 'We consider factors such as sidewalk availability, road type, traffic speed, lane count, crossings, intersections, and nearby school areas.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="3" stroke="#168B82" strokeWidth="1.75" />
        <path d="M6 21v-2a6 6 0 0112 0v2" stroke="#168B82" strokeWidth="1.75" strokeLinecap="round" />
        <path d="M16 7a2 2 0 012 2" stroke="#168B82" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    bg: 'bg-teal-wash',
    title: 'Different needs, different weights',
    text: 'Child / teen routes place more weight on crossing complexity and major roads. Older adult routes emphasize sidewalks, crossing distance, slope, and intersection difficulty.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 12h16M12 4l-4 8 8-8" stroke="#2774C7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2" fill="#2774C7" />
      </svg>
    ),
    bg: 'bg-blue-50',
    title: 'You choose the tradeoff',
    text: 'Move the slider toward faster or more pedestrian-friendly, then compare the time and suitability difference between routes.',
  },
];

function AlgorithmDiagram() {
  return (
    <svg viewBox="0 0 340 110" xmlns="http://www.w3.org/2000/svg" className="w-full" aria-label="Algorithm flow diagram">
      {/* Step 1: Street segments */}
      <rect x="2" y="30" width="72" height="50" rx="10" fill="#FFE3CC" stroke="#F26A21" strokeWidth="1.5" />
      <text x="38" y="52" textAnchor="middle" fill="#D94E0D" fontSize="8" fontWeight="700" fontFamily="Nunito, sans-serif">Street</text>
      <text x="38" y="64" textAnchor="middle" fill="#D94E0D" fontSize="8" fontWeight="700" fontFamily="Nunito, sans-serif">segments</text>

      {/* Arrow */}
      <path d="M74 55h20" stroke="#CDD4D6" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="94,52 100,55 94,58" fill="#CDD4D6" />

      {/* Step 2: Suitability factors */}
      <rect x="100" y="24" width="80" height="62" rx="10" fill="#D8F4EE" stroke="#168B82" strokeWidth="1.5" />
      <text x="140" y="46" textAnchor="middle" fill="#168B82" fontSize="8" fontWeight="700" fontFamily="Nunito, sans-serif">Suitability</text>
      <text x="140" y="58" textAnchor="middle" fill="#168B82" fontSize="8" fontWeight="700" fontFamily="Nunito, sans-serif">factors</text>
      <text x="140" y="70" textAnchor="middle" fill="#168B82" fontSize="7" fontWeight="500" fontFamily="Nunito Sans, sans-serif">speed · crossings</text>
      <text x="140" y="80" textAnchor="middle" fill="#168B82" fontSize="7" fontWeight="500" fontFamily="Nunito Sans, sans-serif">sidewalks · lanes</text>

      {/* Arrow */}
      <path d="M180 55h20" stroke="#CDD4D6" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="200,52 206,55 200,58" fill="#CDD4D6" />

      {/* Step 3: Profile weights */}
      <rect x="206" y="30" width="70" height="50" rx="10" fill="#FFF9F4" stroke="#F6BD31" strokeWidth="1.5" />
      <text x="241" y="52" textAnchor="middle" fill="#9B7B0D" fontSize="8" fontWeight="700" fontFamily="Nunito, sans-serif">Profile</text>
      <text x="241" y="64" textAnchor="middle" fill="#9B7B0D" fontSize="8" fontWeight="700" fontFamily="Nunito, sans-serif">weights</text>

      {/* Arrow */}
      <path d="M276 55h20" stroke="#CDD4D6" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="296,52 302,55 296,58" fill="#CDD4D6" />

      {/* Step 4: Route comparison */}
      <rect x="302" y="22" width="36" height="66" rx="10" fill="#18384A" stroke="#18384A" strokeWidth="1.5" />
      <text x="320" y="46" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700" fontFamily="Nunito, sans-serif">Route</text>
      <text x="320" y="58" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="700" fontFamily="Nunito, sans-serif">score</text>
      <text x="320" y="74" textAnchor="middle" fill="#FF9A3D" fontSize="13" fontWeight="900" fontFamily="Nunito, sans-serif">81</text>

      {/* Labels below */}
      <text x="38" y="98" textAnchor="middle" fill="#5E6B70" fontSize="7" fontFamily="Nunito Sans, sans-serif">Each block</text>
      <text x="140" y="98" textAnchor="middle" fill="#5E6B70" fontSize="7" fontFamily="Nunito Sans, sans-serif">Observable data</text>
      <text x="241" y="98" textAnchor="middle" fill="#5E6B70" fontSize="7" fontFamily="Nunito Sans, sans-serif">Your profile</text>
      <text x="320" y="98" textAnchor="middle" fill="#5E6B70" fontSize="7" fontFamily="Nunito Sans, sans-serif">Result</text>
    </svg>
  );
}

export default function HowScoringWorksScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <TopBar title="How it works" onBack={() => navigate(-1 as any)} />

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">

        {/* Hero */}
        <div>
          <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-1">Transparent routing</p>
          <h1 className="text-[26px] font-black text-ink" style={{ fontFamily: 'Nunito, sans-serif', letterSpacing: '-0.02em' }}>
            Not every walking route feels the same.
          </h1>
          <p className="text-[15px] text-slate mt-2 leading-relaxed">
            SafeRoute+ compares route time with observable pedestrian features. It does not promise that a route is perfectly safe.
          </p>
        </div>

        {/* Scoring sections */}
        <div className="flex flex-col gap-3">
          {sections.map(s => (
            <div key={s.title} className="bg-white rounded-2xl border-2 border-divider px-4 py-4 flex gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                {s.icon}
              </div>
              <div>
                <div className="text-[15px] font-bold text-ink mb-1">{s.title}</div>
                <p className="text-[13px] text-slate leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Algorithm visual */}
        <div className="bg-white rounded-2xl border-2 border-divider p-4">
          <p className="text-[12px] font-bold text-ink uppercase tracking-wider mb-3">How a route score is calculated</p>
          <AlgorithmDiagram />
          <p className="text-[11px] text-slate mt-3 leading-relaxed text-center">
            SafeRoute+ uses a weighted street network to compare routes. Scores are explainable route-characteristic estimates, not crash predictions.
          </p>
        </div>

        {/* Limitations */}
        <div className="bg-white rounded-2xl border-2 border-divider px-4 py-4">
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2a6 6 0 100 12A6 6 0 008 2zm0 4v3.5M8 11h.01" stroke="#D94E0D" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
            <p className="text-[14px] font-bold text-danger">Important limitations</p>
          </div>
          <ul className="flex flex-col gap-2">
            {[
              'Street data can be incomplete or outdated.',
              'Conditions can change because of construction, weather, traffic, or visibility.',
              'Always use your judgment and follow traffic rules.',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-[13px] text-slate">
                <span className="w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-2" />
      </div>
    </div>
  );
}
