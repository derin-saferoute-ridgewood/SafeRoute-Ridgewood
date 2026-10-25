import { useNavigate } from 'react-router';
import { useApp, type RouteOption } from '../context/AppContext';

const ROUTE_DETAILS: Array<{
  id: RouteOption;
  title: string;
  subtitle: string;
  accent: string;
  summary: string;
}> = [
  {
    id: 'fastest',
    title: 'Fastest',
    subtitle: 'Shortest travel time',
    accent: '#2774C7',
    summary: 'Optimizes for minimum walking time using the backend fastest route graph.',
  },
  {
    id: 'safest',
    title: 'Safest',
    subtitle: 'Lower-risk segments',
    accent: '#168B82',
    summary: 'Optimizes for lower-risk walking segments using the backend safety-weighted graph.',
  },
];

export default function RouteConfigurationScreen() {
  const navigate = useNavigate();
  const {
    selectedRoute,
    setSelectedRoute,
    crashDataset,
    setCrashDataset,
    preferenceValue,
    setPreferenceValue,
  } = useApp();

  const activeRoute = ROUTE_DETAILS.find(route => route.id === selectedRoute) ?? ROUTE_DETAILS[0];

  const handleStart = () => {
    setSelectedRoute(activeRoute.id);
    navigate('/active-trip');
  };

  return (
    <div className="min-h-screen bg-[#FFF9F4] text-[#263238]" style={{ fontFamily: 'Nunito, sans-serif' }}>
      <header className="flex items-center justify-between border-b border-[#E7EAEF] bg-white px-5 py-4">
        <div className="text-[14px] font-black uppercase tracking-[0.16em] text-[#F26A21]">SafeRoute+</div>
        <button onClick={() => navigate('/about')} className="text-[12px] font-bold text-[#2774C7]">
          About
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-6">
        <div className="space-y-2">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F26A21]">Route config</p>
          <h1 className="text-[30px] font-black leading-tight" style={{ letterSpacing: '-0.04em' }}>
            Pick your route mode.
          </h1>
          <p className="text-[14px] leading-relaxed text-[#5E6B70]">
            The interface only exposes the route profiles the backend can actually serve: fastest and safest.
          </p>
        </div>

        <div className="space-y-3">
          {ROUTE_DETAILS.map(route => {
            const isSelected = route.id === selectedRoute;

            return (
              <button
                key={route.id}
                type="button"
                onClick={() => setSelectedRoute(route.id)}
                className="w-full rounded-3xl border-2 bg-white p-4 text-left transition-all"
                style={{
                  borderColor: isSelected ? route.accent : '#E7EAEF',
                  boxShadow: isSelected ? `0 0 0 2px ${route.accent}22` : 'none',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#7A8084]">Mode</div>
                    <div className="mt-2 text-[24px] font-black" style={{ color: route.accent }}>
                      {route.title}
                    </div>
                  </div>
                  <div
                    className="mt-1 h-5 w-5 rounded-full border-2"
                    style={{
                      background: isSelected ? route.accent : 'white',
                      borderColor: route.accent,
                    }}
                  />
                </div>

                <div className="mt-3 text-[13px] font-semibold text-[#263238]">{route.subtitle}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-[#5E6B70]">{route.summary}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-[#E7EAEF] bg-white p-4">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7A8084]">Selected route</div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div>
              <div className="text-[18px] font-black text-[#263238]">{activeRoute.title}</div>
              <div className="text-[12px] text-[#5E6B70]">{activeRoute.subtitle}</div>
            </div>
            <div className="h-3 w-3 rounded-full" style={{ background: activeRoute.accent }} />
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7EAEF] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7A8084]">Safety sensitivity</div>
              <div className="mt-1 text-[14px] font-black text-[#263238]">{preferenceValue}% safety priority</div>
            </div>
            <div className="rounded-full bg-[#E6F7F3] px-2 py-1 text-[11px] font-black text-[#168B82]">{activeRoute.id === 'safest' ? 'Safe mode' : 'Balanced'}</div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={preferenceValue}
            onChange={event => setPreferenceValue(Number(event.target.value))}
            className="mt-4 h-2 w-full accent-[#168B82]"
            aria-label="Safety sensitivity"
          />

          <div className="mt-2 flex justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-[#7A8084]">
            <span>Faster</span>
            <span>Safer</span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E7EAEF] bg-white p-4">
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#7A8084]">
            Crash data
          </div>
          <p className="mt-1 text-[12px] leading-relaxed text-[#5E6B70]">
            Choose which crash records inform route risk. Street names are matched
            to OSM roads; the most-data option includes inferred, unverified points.
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {([
              ["low", "Current data", "Existing normalized set"],
              ["high", "Expanded data", "Crash.csv"],
              ["unverified", "Most data, unverified", "Inferred geopoints"],
            ] as const).map(([dataset, label, description]) => (
              <button
                key={dataset}
                type="button"
                onClick={() => setCrashDataset(dataset)}
                aria-pressed={crashDataset === dataset}
                className="rounded-xl border px-2 py-3 text-left"
                style={{
                  borderColor: crashDataset === dataset ? "#168B82" : "#E7EAEF",
                  background: crashDataset === dataset ? "#EAFBF5" : "white",
                }}
              >
                <span className="block text-[12px] font-black text-[#263238]">{label}</span>
                <span className="mt-1 block text-[10px] leading-snug text-[#5E6B70]">{description}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="h-14 rounded-2xl text-[15px] font-black text-white shadow-sm"
          style={{ background: '#F26A21' }}
        >
          Start {activeRoute.title} route
        </button>
      </main>
    </div>
  );
}
