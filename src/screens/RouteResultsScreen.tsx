import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, RouteOption } from '../context/AppContext';
import TopBar from '../components/TopBar';
import RouteCard from '../components/RouteCard';
import LiveMap from '../components/LiveMap';
import RouteBreakdownSheet from '../components/RouteBreakdownSheet';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import { ShieldCheck, InfoCircle } from '../components/Icons';

const ROUTES = [
  {
    id: 'fastest' as RouteOption,
    name: 'Fastest',
    color: '#2774C7',
    duration: 'Live route',
    distance: 'Calculated live',
    score: 72,
    tradeoff: 'Uses the shortest-time graph from the backend route engine.',
    positiveFactors: ['Fastest walking path', 'Uses live route geometry from the backend'],
    cautionFactors: ['May prefer higher-volume or riskier segments'],
    breakdownTradeoff: 'This option is optimized for minimum travel time using the backend fastest-weighted graph.',
  },
  {
    id: 'safest' as RouteOption,
    name: 'Safest',
    color: '#168B82',
    duration: 'Live route',
    distance: 'Calculated live',
    score: 86,
    tradeoff: 'Uses the safety-weighted graph to favor lower-risk segments.',
    positiveFactors: ['Lower-risk street selection', 'Uses backend safety-weight data'],
    cautionFactors: ['May increase total distance or walking time'],
    breakdownTradeoff: 'This option is optimized for the safety-weighted graph and may increase total walking time to lower risk exposure.',
  },
];

const profileLabel: Record<string, string> = {
  child: 'child / teen',
  'older-adult': 'older adult',
  general: 'general pedestrian',
};

export default function RouteResultsScreen() {
  const navigate = useNavigate();
  const { selectedRoute, setSelectedRoute, profile } = useApp();
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [breakdownRoute, setBreakdownRoute] = useState<RouteOption | null>(null);

  const selected = ROUTES.find(r => r.id === selectedRoute) ?? ROUTES[1];
  const breakdownData = ROUTES.find(r => r.id === breakdownRoute);

  return (
    <div className="min-h-screen bg-[#18384A] flex flex-col relative">
      <TopBar
        title="Ridgewood High → Station"
        onBack={() => navigate('/plan')}
        rightLabel="More"
        onRight={() => {}}
        transparent
      />

      {/* Map */}
      <div
        className="absolute inset-0 top-14 transition-all duration-300"
        style={{ bottom: sheetExpanded ? '490px' : '330px' }}
      >
        <LiveMap
          selectedRoute={selectedRoute}
          showAnnotations={true}
          height="100%"
        />
        {/* Annotation tap */}
        <button
          onClick={() => navigate('/segment')}
          className="absolute top-4 left-4 bg-[#FCE3E0] text-[#D9534F] border border-[#D9534F] rounded-xl px-3 py-2 text-[12px] font-bold flex items-center gap-1.5"
        >
          <div className="w-2 h-2 rounded-full bg-[#D9534F] flex-shrink-0" />
          Higher speed crossing · Tap to learn more
        </button>
      </div>

      {/* Bottom sheet */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl flex flex-col transition-all duration-300"
        style={{ height: sheetExpanded ? '490px' : '330px' }}
      >
        {/* Drag handle */}
        <button
          onClick={() => setSheetExpanded(v => !v)}
          className="flex justify-center pt-3 pb-1"
          aria-label={sheetExpanded ? 'Collapse' : 'Expand'}
        >
          <div className="w-10 h-1 rounded-full bg-[#CDD4D6]" />
        </button>

        {/* Sheet header */}
        <div className="px-4 pb-2 flex items-baseline justify-between">
          <div>
            <h2 className="text-[18px] font-black text-[#263238]" style={{ fontFamily: 'Nunito, sans-serif' }}>
              3 routes found
            </h2>
            <p className="text-[13px] text-[#5E6B70]">For a {profileLabel[profile] ?? 'pedestrian'}</p>
          </div>
          <button
            onClick={() => navigate('/transparency')}
            className="flex items-center gap-1 text-[12px] font-semibold text-[#2774C7]"
          >
            <InfoCircle size={14} />
            How scores work
          </button>
        </div>

        {/* Route cards */}
        <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-2.5 pb-2">
          {ROUTES.map(r => (
            <div key={r.id}>
              <RouteCard
                name={r.name}
                color={r.color}
                duration={r.duration}
                distance={r.distance}
                score={r.score}
                tradeoff={r.tradeoff}
                selected={selectedRoute === r.id}
                onSelect={() => setSelectedRoute(r.id)}
              />
              {/* How was this calculated? */}
              <button
                onClick={() => setBreakdownRoute(r.id)}
                className="w-full flex items-center gap-1.5 mt-1 px-3 py-1 text-[12px] font-semibold text-[#2774C7] hover:text-[#1a5ba0] transition-colors"
              >
                <InfoCircle size={12} />
                How was this calculated? · Data confidence: {r.score >= 81 ? '87%' : r.score >= 62 ? '72%' : '65%'}
              </button>
            </div>
          ))}

          {/* Tradeoff callout */}
          <div className="flex items-start gap-3 bg-[#D8F4EE] border border-[#168B82] rounded-xl px-3 py-3 mt-1">
            <ShieldCheck size={18} className="text-[#168B82] flex-shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#168B82] font-semibold leading-snug">
              Balanced adds 2 minutes and improves pedestrian suitability by 19 points.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div className="px-4 pt-2 pb-8 flex flex-col gap-2.5 border-t border-[#CDD4D6]">
          <PrimaryButton onClick={() => navigate('/active-trip')}>
            Start {selected.name} route
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/segment')}>
            See why this route
          </SecondaryButton>
        </div>
      </div>

      {/* Route breakdown sheet */}
      {breakdownData && (
        <RouteBreakdownSheet
          routeName={breakdownData.name}
          score={breakdownData.score}
          profile={profile}
          positiveFactors={breakdownData.positiveFactors}
          cautionFactors={breakdownData.cautionFactors}
          tradeoff={breakdownData.breakdownTradeoff}
          onClose={() => setBreakdownRoute(null)}
        />
      )}
    </div>
  );
}
