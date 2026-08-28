import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import TopBar from '../components/TopBar';
import SuitabilityBadge from '../components/SuitabilityBadge';
import FactorChip from '../components/FactorChip';
import { PrimaryButton } from '../components/Button';
import LiveMap from '../components/LiveMap';

const factors = [
  { label: 'Sidewalk present', positive: true },
  { label: 'Signal nearby', positive: true },
  { label: '35 mph traffic', positive: false },
  { label: 'Longer crossing', positive: false },
  { label: 'Major intersection', positive: false },
];

const profileWeightNote = {
  child: 'Child / teen routes give crossing complexity and major roads extra weight.',
  'older-adult': 'Older adult routes give crossing distance, slope, and sidewalk continuity extra weight.',
  general: 'General routes weigh each factor according to typical pedestrian needs.',
};

export default function SegmentExplanationScreen() {
  const navigate = useNavigate();
  const { profile, setSelectedRoute } = useApp();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <TopBar
        title="Street details"
        onClose={() => navigate(-1 as any)}
      />

      {/* Mini map preview */}
      <div className="h-[200px] bg-navy relative overflow-hidden">
        <LiveMap
          selectedRoute="balanced"
          showAnnotations={true}
          zoomSegment={true}
          height="100%"
        />
        {/* Red segment highlight */}
        <div className="absolute bottom-3 left-3 bg-danger-wash border border-danger rounded-lg px-2.5 py-1.5">
          <p className="text-[11px] font-bold text-danger">Maple Avenue crossing</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">

        {/* Header */}
        <div>
          <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-1">Route characteristics</p>
          <h1 className="text-[24px] font-black text-ink" style={{ fontFamily: 'Nunito, sans-serif', letterSpacing: '-0.01em' }}>
            Maple Avenue crossing
          </h1>
        </div>

        {/* Score module */}
        <div className="bg-white rounded-2xl border-2 border-divider p-4 flex items-center gap-4">
          <SuitabilityBadge score={58} size="lg" />
          <div>
            <div className="text-[14px] font-bold text-ink">Pedestrian suitability</div>
            <div className="text-[13px] text-slate mt-0.5">This segment scored lower than the route average.</div>
          </div>
        </div>

        {/* Factor chips */}
        <div>
          <h2 className="text-[14px] font-bold text-ink mb-3">What affects this score?</h2>
          <div className="flex flex-wrap gap-2">
            {factors.map(f => (
              <FactorChip key={f.label} label={f.label} positive={f.positive} />
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-2xl border-2 border-divider px-4 py-4">
          <p className="text-[15px] text-ink leading-relaxed">
            This segment is walkable, but it has faster traffic and a more complicated crossing.{' '}
            {profileWeightNote[profile]}
          </p>
        </div>

        {/* Limitations */}
        <div className="bg-amber-wash border border-[#C8910B] rounded-xl px-4 py-3">
          <p className="text-[12px] text-[#9B7B0D] leading-relaxed">
            Suitability scores describe street characteristics, not a guarantee of safety or a prediction of crashes.
          </p>
        </div>

        <div className="h-2" />
      </div>

      {/* CTA */}
      <div className="px-4 pb-8 pt-3 border-t border-divider bg-cream">
        <PrimaryButton
          onClick={() => {
            setSelectedRoute('pedestrian');
            navigate('/results');
          }}
        >
          Choose a calmer alternative
        </PrimaryButton>
      </div>
    </div>
  );
}
