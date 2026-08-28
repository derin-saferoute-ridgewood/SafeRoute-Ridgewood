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
    duration: '14 min',
    distance: '0.7 mi',
    score: 62,
    tradeoff: 'Gets there quickly, but includes a busier crossing.',
    positiveFactors: ['Sidewalk along most of the route', 'Signalized crossing at start'],
    cautionFactors: ['High-speed crossing on Maple Avenue', 'Longer stretch on arterial road'],
    breakdownTradeoff: 'This is the fastest option. It is 2 minutes faster than Balanced, but 19 points lower in pedestrian suitability.',
  },
  {
    id: 'balanced' as RouteOption,
    name: 'Balanced',
    color: '#F26A21',
    duration: '16 min',
    distance: '0.8 mi',
    score: 81,
    tradeoff: '+2 min for calmer streets and simpler crossings.',
    positiveFactors: ['Sidewalks along most of the route', 'More residential streets', 'Signalized crossing near destination'],
    cautionFactors: ['One higher-speed crossing on Maple Avenue', 'Moderate crossing complexity near East Ridgewood Avenue'],
    breakdownTradeoff: 'This route adds 2 minutes compared with the fastest option and improves pedestrian suitability by 19 points.',
  },
  {
    id: 'pedestrian' as RouteOption,
    name: 'Most pedestrian-friendly',
    color: '#168B82',
    duration: '19 min',
    distance: '0.9 mi',
    score: 92,
    tradeoff: '+5 min to avoid the largest roads and difficult intersections.',
    positiveFactors: ['Predominantly residential streets', 'Continuous sidewalk coverage', 'All crossings are signalized or controlled'],
    cautionFactors: ['Longer overall route distance'],
    breakdownTradeoff: 'This route adds 5 minutes compared with the fastest option and achieves the highest pedestrian suitability at 92/100.',
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
