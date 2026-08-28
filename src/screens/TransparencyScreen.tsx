import { useState, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown } from '../components/Icons';

// ─── Math rendering helpers ───────────────────────────────────────────────────
function MathBlock({ children }: { children: ReactNode }) {
  return (
    <div className="my-3 px-4 py-3 rounded-xl bg-[#18384A]/6 border border-[#18384A]/20 font-mono text-[14px] md:text-[15px] text-[#18384A] leading-relaxed overflow-x-auto">
      {children}
    </div>
  );
}

function Fraction({ num, den }: { num: ReactNode; den: ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center text-center align-middle mx-1" style={{ verticalAlign: 'middle', lineHeight: 1 }}>
      <span className="block border-b border-current pb-0.5 text-[13px] leading-tight px-1">{num}</span>
      <span className="block pt-0.5 text-[13px] leading-tight px-1">{den}</span>
    </span>
  );
}

function DefList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 flex flex-col gap-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-[13px] text-[#5E6B70]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F26A21] flex-shrink-0 mt-1.5" />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

function FactorTable({ rows }: { rows: { col1: string; col2: string; col3?: string }[] }) {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-[13px]">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-t border-[#CDD4D6] ${i === 0 ? 'border-t-2 border-t-[#263238]' : ''}`}>
              <td className="py-2 pr-3 font-semibold text-[#263238] whitespace-nowrap">{row.col1}</td>
              <td className="py-2 pr-3 text-[#5E6B70]">{row.col2}</td>
              {row.col3 && <td className="py-2 text-[#5E6B70] italic">{row.col3}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border-2 border-[#CDD4D6] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#FFF9F4] transition-colors"
      >
        <span className="w-8 h-8 rounded-lg bg-[#FFE3CC] flex items-center justify-center text-[13px] font-black text-[#D94E0D] flex-shrink-0" style={{ fontFamily: 'Nunito, sans-serif' }}>
          {number}
        </span>
        <span className="flex-1 text-[15px] font-bold text-[#263238] leading-snug">{title}</span>
        <ChevronDown
          size={18}
          className={`text-[#5E6B70] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-[#CDD4D6]">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}

function PlainEnglish({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 bg-[#D8F4EE] border border-[#168B82] rounded-xl px-4 py-3 text-[13px] text-[#168B82] leading-relaxed">
      <span className="font-bold block mb-1 text-[11px] uppercase tracking-wider">Plain language</span>
      {children}
    </div>
  );
}

function Caution({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 bg-[#FFF3C9] border border-[#C8910B] rounded-xl px-4 py-3 text-[13px] text-[#9B7B0D] leading-relaxed">
      {children}
    </div>
  );
}

function ModelCard({ title, formula, note }: { title: string; formula: ReactNode; note?: string }) {
  return (
    <div className="bg-[#FFF9F4] border-2 border-[#CDD4D6] rounded-xl p-4">
      <p className="text-[13px] font-bold text-[#263238] mb-2">{title}</p>
      <MathBlock>{formula}</MathBlock>
      {note && <p className="text-[12px] text-[#5E6B70] mt-2 leading-relaxed">{note}</p>}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TransparencyScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF9F4]" style={{ fontFamily: 'Nunito Sans, sans-serif' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b-2 border-[#CDD4D6] flex items-center gap-3 px-5 md:px-8 h-14">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-[#F26A21] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L3.5 5.5V14.5L10 18L16.5 14.5V5.5L10 2z" fill="white" />
            </svg>
          </div>
          <span className="font-black text-[14px] text-[#263238]" style={{ fontFamily: 'Nunito, sans-serif' }}>SafeRoute+ Bergen</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-[14px] font-bold text-[#263238] hidden md:inline">How our calculations work</span>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-[13px] font-semibold text-[#2774C7] hover:text-[#1a5ba0] transition-colors flex-shrink-0"
        >
          Back to route planner
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-5 md:px-8 py-10">

        {/* Hero */}
        <div className="mb-10">
          <p className="text-[11px] font-bold text-[#F26A21] uppercase tracking-widest mb-2">Transparent routing</p>
          <h1
            className="text-[32px] md:text-[40px] font-black text-[#263238] leading-[1.1] mb-4"
            style={{ fontFamily: 'Nunito, sans-serif', letterSpacing: '-0.02em' }}
          >
            How SafeRoute+ compares walking routes.
          </h1>
          <p className="text-[16px] text-[#5E6B70] leading-relaxed mb-5">
            SafeRoute+ does not predict the exact probability that someone will be injured.
            Instead, it calculates a relative pedestrian suitability score from observable roadway
            and pedestrian-infrastructure characteristics, then compares possible routes using
            both suitability and travel time.
          </p>

          {/* Plain language callout */}
          <div className="bg-white border-2 border-[#CDD4D6] rounded-2xl p-5">
            <p className="text-[13px] font-bold text-[#F26A21] uppercase tracking-wider mb-1">What does 85/100 mean?</p>
            <p className="text-[15px] font-black text-[#263238] mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
              An 85 does not mean a route is "85% safe."
            </p>
            <p className="text-[14px] text-[#5E6B70] leading-relaxed">
              It means that, under SafeRoute+&#39;s current transparent model,
              the route has more pedestrian-friendly characteristics than routes with lower scores.
              Scores are estimates based on available street data and your selected profile.
            </p>
          </div>
        </div>

        {/* Accordion sections */}
        <div className="flex flex-col gap-3">

          <Accordion number="1" title="What SafeRoute+ calculates">
            <p className="text-[14px] text-[#5E6B70] leading-relaxed">
              Streets are represented as a network of walkable road segments and intersections.
              Each segment receives a relative-risk value from observable characteristics.
              SafeRoute+ then finds routes that balance time and pedestrian suitability
              according to the selected profile and Faster-to-Safer preference.
            </p>
            <div className="mt-3 bg-[#FCE3E0] border border-[#D9534F] rounded-xl px-4 py-3 text-[13px] text-[#D9534F] leading-relaxed font-semibold">
              SafeRoute+ estimates route characteristics. It does not guarantee safety,
              predict individual behavior, or claim to calculate an exact crash probability.
            </div>
          </Accordion>

          <Accordion number="2" title="Street-segment risk score">
            <p className="text-[14px] text-[#5E6B70] mb-2">
              Each street segment receives a risk value based on a weighted sum of observable factors:
            </p>
            <MathBlock>
              R<sub>e</sub> = Σ (w<sub>i</sub> × x<sub>i</sub>)
            </MathBlock>
            <MathBlock>
              R<sub>e</sub> = w<sub>s</sub>S + w<sub>l</sub>L + w<sub>a</sub>A + w<sub>c</sub>C + w<sub>i</sub>I + w<sub>h</sub>H + w<sub>p</sub>P − w<sub>g</sub>G
            </MathBlock>
            <DefList items={[
              'R<sub>e</sub> = overall relative risk for street segment <i>e</i>',
              'x<sub>i</sub> = normalized value of roadway or pedestrian factor <i>i</i>',
              'w<sub>i</sub> = transparent model weight for factor <i>i</i>',
              'S = speed-risk score',
              'L = lane-count or road-width score',
              'A = arterial-road score',
              'C = crossing-complexity score',
              'I = intersection-risk score',
              'H = historical crash component (when reliable data is available)',
              'P = pedestrian-infrastructure penalty',
              'G = protective crossing benefit (marked or signalized crossings)',
            ]} />
            <Caution>
              All components are normalized to approximately 0–1 before weighting.
              This prevents raw measurements like speed in mph from overpowering other factors.
            </Caution>
          </Accordion>

          <Accordion number="3" title="Normalizing roadway features">
            <p className="text-[14px] text-[#5E6B70] mb-2">
              Raw values like miles per hour are normalized to a 0–1 scale:
            </p>
            <MathBlock>
              x<sub>norm</sub> =
              <Fraction
                num={<>x − x<sub>min</sub></>}
                den={<>x<sub>max</sub> − x<sub>min</sub></>}
              />
            </MathBlock>
            <div className="bg-[#FFF9F4] border border-[#CDD4D6] rounded-xl p-4 mt-3">
              <p className="text-[13px] font-semibold text-[#263238] mb-1">Example — normalized speed (20–50 mph range):</p>
              <ul className="flex flex-col gap-1 text-[13px] text-[#5E6B70]">
                <li>· 35 mph → (35 − 20) / (50 − 20) = <strong className="text-[#263238]">0.50</strong></li>
                <li>· 45 mph → (45 − 20) / (50 − 20) = <strong className="text-[#263238]">0.83</strong></li>
              </ul>
            </div>
            <div className="mt-3">
              <p className="text-[13px] font-bold text-[#263238] mb-1">Higher-speed penalty (nonlinear)</p>
              <MathBlock>
                S = <span className="text-[13px]">(</span>
                <Fraction
                  num={<>v − v<sub>min</sub></>}
                  den={<>v<sub>max</sub> − v<sub>min</sub></>}
                />
                <span className="text-[13px]">)²</span>
              </MathBlock>
              <p className="text-[13px] text-[#5E6B70] mb-2">
                Squaring makes higher speeds disproportionately costly, reflecting the pedestrian focus of the model.
              </p>
              <FactorTable rows={[
                { col1: 'Speed', col2: 'Linear score', col3: 'Squared (applied)' },
                { col1: '25 mph', col2: '0.167', col3: '0.028' },
                { col1: '35 mph', col2: '0.500', col3: '0.250' },
                { col1: '45 mph', col2: '0.833', col3: '0.694' },
              ]} />
            </div>
          </Accordion>

          <Accordion number="4" title="Features included in the current model">
            <FactorTable rows={[
              { col1: 'Factor', col2: 'Method', col3: 'Meaning' },
              { col1: 'Vehicle speed', col2: 'Normalized, nonlinear penalty', col3: 'Higher speeds add more concern' },
              { col1: 'Lanes / road width', col2: '1–2 lanes lower; 4+ lanes higher', col3: 'Wider roads can be harder to navigate' },
              { col1: 'Road class', col2: 'OpenStreetMap classification', col3: 'Residential roads generally lower concern than primary' },
              { col1: 'Sidewalk availability', col2: 'Both / one side / unknown / none', col3: 'Unknown ≠ confirmed absence' },
              { col1: 'Crossing complexity', col2: 'Lanes, width, signals, major-road connection', col3: 'Complex crossings add concern' },
              { col1: 'Intersection complexity', col2: 'Explicit intersection penalty', col3: 'Difficult crossings keep their weight' },
              { col1: 'Slope', col2: 'Normalized grade (terrain data)', col3: 'Especially relevant to Older Adult mode' },
              { col1: 'Historical crashes', col2: 'Optional, proximity-and-recency weighted', col3: 'Never the only basis for a score' },
            ]} />
            <Caution>
              Road and sidewalk data can be incomplete. SafeRoute+ does not automatically interpret
              missing OpenStreetMap attributes as missing infrastructure.
            </Caution>
          </Accordion>

          <Accordion number="5" title="Road type and sidewalk handling">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[13px] font-bold text-[#263238] mb-2">Road type relative values</p>
                <FactorTable rows={[
                  { col1: 'Road type', col2: 'Value' },
                  { col1: 'Residential', col2: '0.10' },
                  { col1: 'Service', col2: '0.25' },
                  { col1: 'Tertiary', col2: '0.40' },
                  { col1: 'Secondary', col2: '0.65' },
                  { col1: 'Primary', col2: '0.85' },
                  { col1: 'Trunk', col2: '1.00' },
                ]} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#263238] mb-2">Sidewalk data penalties</p>
                <FactorTable rows={[
                  { col1: 'Sidewalk data', col2: 'Penalty' },
                  { col1: 'Both sides', col2: '0.00' },
                  { col1: 'One side', col2: '0.25' },
                  { col1: 'Unknown', col2: '0.65' },
                  { col1: 'No sidewalk', col2: '1.00' },
                ]} />
              </div>
            </div>
            <Caution>
              These are transparent model parameters, not universal scientific constants.
              Weights are tested, documented, and refined through transportation guidance and feedback.
            </Caution>
          </Accordion>

          <Accordion number="6" title="Crossing and intersection complexity">
            <MathBlock>
              C = 0.30L<sub>n</sub> + 0.25T + 0.20W + 0.15U + 0.10M
            </MathBlock>
            <DefList items={[
              'L<sub>n</sub> = normalized number of lanes',
              'T = turning complexity',
              'W = crossing width',
              'U = unsignalized-crossing indicator',
              'M = major-road indicator',
            ]} />
            <PlainEnglish>
              SafeRoute+ gives difficult intersections explicit weight because a short, complex crossing
              can matter more than the average conditions along an entire block.
            </PlainEnglish>
          </Accordion>

          <Accordion number="7" title="Historical crash data, when available">
            <p className="text-[14px] text-[#5E6B70] mb-2">
              When reliable crash data is available, each nearby crash contributes a proximity- and recency-weighted component:
            </p>
            <MathBlock>
              h<sub>j</sub> = severity<sub>j</sub> × e<sup>−λd<sub>j</sub></sup> × e<sup>−γt<sub>j</sub></sup>
            </MathBlock>
            <MathBlock>
              H = min(1, K × Σh<sub>j</sub>)
            </MathBlock>
            <DefList items={[
              'd<sub>j</sub> = distance from segment to crash <i>j</i>',
              't<sub>j</sub> = age of crash <i>j</i>',
              'λ = distance-decay parameter',
              'γ = time-decay parameter',
              'K = calibration constant',
            ]} />
            <PlainEnglish>
              A recent crash near a segment matters more than an old event far away.
              However, crash history is only one factor and never defines a route by itself.
            </PlainEnglish>
            <Caution>
              If reliable, sufficiently geocoded local pedestrian crash data is unavailable,
              this component is omitted or clearly labeled unavailable — not guessed.
            </Caution>
          </Accordion>

          <Accordion number="8" title="Why profile scores differ">
            <p className="text-[14px] text-[#5E6B70] mb-4">
              Different pedestrians can experience the same route differently.
              The model changes its factor weights according to the selected profile.
            </p>
            <div className="flex flex-col gap-3">
              <ModelCard
                title="General pedestrian model"
                formula={<>R<sub>general</sub> = 0.25S + 0.15L + 0.15A + 0.20C + 0.10H + 0.15P</>}
              />
              <ModelCard
                title="Child / teen model"
                formula={<>R<sub>child</sub> = 0.30S + 0.18L + 0.17A + 0.23C + 0.07H + 0.05P</>}
                note="Child / teen mode gives additional weight to vehicle speed, crossing complexity, road width, and major arterials."
              />
              <ModelCard
                title="Older adult model"
                formula={<>R<sub>senior</sub> = 0.18S + 0.10L + 0.10A + 0.22C + 0.05H + 0.20P + 0.15Q</>}
                note="Older Adult mode gives additional weight to sidewalks, crossings, intersection difficulty, and slope Q when terrain data is available."
              />
            </div>
            <Caution>
              Model weights are versioned and documented. They are not hidden constants.
              Example label: "Child / Teen model v1.0."
            </Caution>
          </Accordion>

          <Accordion number="9" title="From street scores to route suitability">
            <p className="text-[14px] text-[#5E6B70] mb-2">
              Route risk is distance-weighted — a difficult condition over 600 m affects the score
              more than one lasting 10 m:
            </p>
            <MathBlock>
              R<sub>average</sub> =
              <Fraction
                num={<>Σ (d<sub>e</sub> × R<sub>e</sub>)</>}
                den={<>Σ d<sub>e</sub></>}
              />
            </MathBlock>
            <div className="mt-3">
              <p className="text-[13px] font-bold text-[#263238] mb-1">Peak-risk adjustment</p>
              <MathBlock>
                R<sub>final</sub> = (1 − β) R<sub>average</sub> + β R<sub>max</sub>
              </MathBlock>
              <p className="text-[13px] text-[#5E6B70] mb-2">
                With β = 0.20, a route averaging 0.25 but containing one 0.85 segment receives a higher final value.
                This keeps one difficult crossing from disappearing inside an otherwise calm route.
              </p>
            </div>
            <MathBlock>
              Suitability<sub>route</sub> = 100 × (1 − R<sub>final</sub>)
            </MathBlock>
            <PlainEnglish>
              If final route risk = 0.25, then suitability = <strong>75 / 100</strong>.
            </PlainEnglish>
          </Accordion>

          <Accordion number="10" title="How the Faster-to-Safer slider changes a route">
            <p className="text-[14px] text-[#5E6B70] mb-2">
              Travel time and pedestrian suitability use different units, so both are normalized before comparison.
              Each segment&#39;s edge cost combines time and risk:
            </p>
            <MathBlock>
              C<sub>e</sub>(α) = α T&#39;<sub>e</sub> + (1 − α) R<sub>e</sub>
            </MathBlock>
            <DefList items={[
              'α = user preference value set by the Faster-to-Safer slider',
              'Higher α gives more weight to time',
              'Lower α gives more weight to pedestrian suitability',
            ]} />
            <FactorTable rows={[
              { col1: 'Slider position', col2: 'α value', col3: 'Meaning' },
              { col1: 'Fastest', col2: '0.90', col3: '90% time, 10% suitability' },
              { col1: 'Balanced', col2: '0.50', col3: 'Equal time and suitability' },
              { col1: 'Safer', col2: '0.15', col3: '15% time, 85% suitability' },
            ]} />
            <PlainEnglish>
              SafeRoute+ uses a shortest-path algorithm (Dijkstra or A*) to find the route with
              the lowest total weighted cost.
            </PlainEnglish>
          </Accordion>

          <Accordion number="11" title="Preventing unreasonable detours">
            <MathBlock>
              T<sub>route</sub> ≤ (1 + δ) × T<sub>fastest</sub>
            </MathBlock>
            <FactorTable rows={[
              { col1: 'Slider position', col2: 'Max extra time (δ)' },
              { col1: 'Fastest', col2: '5%' },
              { col1: 'Balanced', col2: '20%' },
              { col1: 'Safer', col2: '35%' },
            ]} />
            <PlainEnglish>
              If the fastest route takes 20 min and the Safer setting allows 35% extra,
              the route stays at or under 27 minutes. SafeRoute+ avoids dramatically longer routes
              just to avoid a single street.
            </PlainEnglish>
          </Accordion>

          <Accordion number="12" title="Guardian Mode calculations">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-[13px] font-bold text-[#263238] mb-1">Route deviation</p>
                <MathBlock>D = distance(current GPS, planned route polyline)</MathBlock>
                <MathBlock>Deviation = (D &gt; 150 m) AND (time away &gt; 60 s)</MathBlock>
                <PlainEnglish>
                  SafeRoute+ waits for both distance and time before suggesting a check-in,
                  reducing false alerts from normal GPS drift.
                </PlainEnglish>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#263238] mb-1">Late arrival</p>
                <MathBlock>Delay = Current Time − Original ETA</MathBlock>
                <p className="text-[13px] text-[#5E6B70]">Prompt a check-in when Delay &gt; 5 minutes.</p>
                <Caution>SafeRoute+ prompts the user. It does not automatically message a guardian.</Caution>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#263238] mb-1">Sunset timing</p>
                <MathBlock>If ETA &gt; Sunset, then DarkTrip = 1</MathBlock>
                <p className="text-[13px] text-[#5E6B70]">
                  The MVP provides a timing advisory when a trip may continue after sunset.
                  It does not claim to know real-time lighting conditions on individual streets.
                </p>
              </div>
            </div>
          </Accordion>

          <Accordion number="13" title="Missing data and confidence">
            <p className="text-[14px] text-[#5E6B70] mb-2">
              A suitability score should not look more certain than the available data allows.
            </p>
            <MathBlock>
              Confidence<sub>e</sub> =
              <Fraction
                num={<>Σ (w<sub>i</sub> × a<sub>i</sub>)</>}
                den={<>Σ w<sub>i</sub></>}
              />
            </MathBlock>
            <DefList items={[
              'a<sub>i</sub> = 1 if important data is available; 0 if missing',
              'Important missing attributes (e.g. sidewalk, speed) affect confidence more than minor missing attributes',
            ]} />
            <MathBlock>
              Confidence<sub>route</sub> =
              <Fraction
                num={<>Σ (d<sub>e</sub> × Confidence<sub>e</sub>)</>}
                den={<>Σ d<sub>e</sub></>}
              />
            </MathBlock>
            <div className="mt-3 bg-[#FFF9F4] border border-[#CDD4D6] rounded-xl px-4 py-3 text-[13px] text-[#263238]">
              <strong>UI example:</strong> "Suitability: 88/100 · Data confidence: 91%"
            </div>
            <Caution>
              Never treat missing OpenStreetMap information as proof that infrastructure does not exist.
            </Caution>
          </Accordion>

          <Accordion number="14" title="The complete simplified model">
            <p className="text-[14px] text-[#5E6B70] mb-3">
              All formulas together, in one place:
            </p>
            <div className="flex flex-col gap-1.5">
              <MathBlock>R<sub>e</sub>(u) = Σ [w<sub>i</sub>(u) × x<sub>i,e</sub>]</MathBlock>
              <MathBlock>S<sub>e</sub>(u) = 100 × (1 − R<sub>e</sub>(u))</MathBlock>
              <MathBlock>C<sub>e</sub> = α T&#39;<sub>e</sub> + (1 − α) R<sub>e</sub>(u)</MathBlock>
              <MathBlock>Route* = argmin<sub>routes</sub> Σ C<sub>e</sub></MathBlock>
              <MathBlock>Subject to: T<sub>route</sub> ≤ (1 + δ) × T<sub>fastest</sub></MathBlock>
              <MathBlock>R<sub>average</sub> = Σ(d<sub>e</sub> × R<sub>e</sub>) / Σd<sub>e</sub></MathBlock>
              <MathBlock>R<sub>final</sub> = (1 − β) R<sub>average</sub> + β R<sub>max</sub></MathBlock>
              <MathBlock>Suitability<sub>route</sub> = 100 × (1 − R<sub>final</sub>)</MathBlock>
            </div>
            <PlainEnglish>
              SafeRoute+ scores street segments, adapts those scores for the person walking,
              balances suitability against time, prevents unreasonable detours, and explains the result.
            </PlainEnglish>
          </Accordion>
        </div>

        {/* Closing disclosure */}
        <div className="mt-8 bg-[#18384A] text-white rounded-2xl p-6">
          <h2 className="text-[20px] font-black mb-2" style={{ fontFamily: 'Nunito, sans-serif' }}>
            Use SafeRoute+ as one input — not a guarantee.
          </h2>
          <p className="text-[14px] text-white/80 leading-relaxed">
            Conditions can change because of driver behavior, traffic, construction, weather,
            visibility, sidewalk closures, missing data, and many other factors.
            Always use personal judgment and follow traffic rules.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-[14px] font-semibold text-[#F26A21] hover:text-[#D94E0D] transition-colors"
          >
            ← Back to route planner
          </button>
        </div>
      </div>
    </div>
  );
}
