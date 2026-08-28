import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import LiveMap from '../components/LiveMap';
import logoImg from '../imports/image-2.png';
import appScreenImg from '../imports/image.png';
import cityMapImg from '../imports/image-1.png';

// ─── Scroll reveal hook ─────────────────────────────────────────────────────

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          obs.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── Nav ───────────────────────────────────────────────────────────────────

function Nav() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    // Observe the sentinel placed at the bottom of the Hero section
    const sentinel = document.querySelector('.hero-sentinel');
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        nav.classList.toggle('nav-scrolled', !entry.isIntersecting);
      },
      { threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      ref={navRef}
      className="bg-white border-b border-[#e5e5e5] sticky top-0 z-50"
      style={{ height: 72 }}
    >
      {/* Scroll progress bar — CSS-only, @supports guarded in index.css */}
      <div className="scroll-progress" />
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center gap-6">

        {/* Logo image */}
        <button onClick={() => navigate('/')} className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity duration-150">
          <img
            src={logoImg}
            alt="SafeRoute+"
            className="w-auto object-contain"
            style={{ height: 80 }}
          />
        </button>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {[
            { label: 'PLAN A ROUTE', to: '/welcome' },
            { label: 'ABOUT US', to: '/about' },
          ].map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="px-4 py-2 rounded-xl text-[13px] font-bold tracking-[0.053em] transition-colors duration-150 hover:text-ink"
              style={{ color: '#777777' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 ml-auto md:ml-0 flex-shrink-0">
          
          <button
            onClick={() => navigate('/welcome')}
            className="h-[46px] px-5 rounded-xl text-white font-bold text-[14px] uppercase tracking-[0.053em] border-b-[3px] transition-all duration-150 hover:opacity-90 active:translate-y-[2px]"
            style={{ background: '#F26A21', borderColor: '#D94E0D' }}
          >
            GET STARTED
          </button>
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="6" width="16" height="1.5" rx="1" fill="#263238" />
              <rect x="3" y="10.25" width="16" height="1.5" rx="1" fill="#263238" />
              <rect x="3" y="14.5" width="16" height="1.5" rx="1" fill="#263238" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu — always rendered, animated open/close */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? 200 : 0, opacity: menuOpen ? 1 : 0 }}
        aria-hidden={!menuOpen}
      >
        <div className="bg-white border-t border-[#e5e5e5] px-6 py-4 flex flex-col gap-2">
          {[
            { label: 'Plan a Route', to: '/welcome' },
            { label: 'About Us', to: '/about' },
          ].map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="py-2 text-[15px] font-bold transition-colors duration-150 hover:text-ink"
              style={{ color: '#263238' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function Hero() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    // Only apply parallax tilt on devices that support hover (not touch-primary)
    if (!window.matchMedia('(hover: hover)').matches) return;

    const handler = (e: MouseEvent) => {
      // Only on desktop widths
      if (window.innerWidth <= 768) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    };
    const reset = () => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    };

    el.addEventListener('mousemove', handler);
    el.addEventListener('mouseleave', reset);
    return () => {
      el.removeEventListener('mousemove', handler);
      el.removeEventListener('mouseleave', reset);
    };
  }, []);

  return (
    <section className="bg-white w-full">
      <div
        className="max-w-[1200px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
        style={{ minHeight: 'calc(100vh - 72px)', paddingTop: 48, paddingBottom: 48 }}
      >
        {/* Left — text + CTAs */}
        <div className="flex flex-col order-2 md:order-1">
          {/* Staggered hero entrance: headline → body → buttons */}
          <h1
            className="font-bold leading-[1.18] hero-animate"
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: 'clamp(28px, 4vw, 36px)',
              color: '#4b4b4b',
              letterSpacing: '-0.01em',
              animationDelay: '0ms',
            }}
          >
            The safe, smart way to choose your walking route.
          </h1>
          <p
            className="mt-4 leading-[1.55] hero-animate"
            style={{ fontSize: 17, color: '#777777', maxWidth: 480, animationDelay: '120ms' }}
          >
            SafeRoute+ compares travel time with pedestrian-friendly street features — sidewalks, crossing
            complexity, road speed, and more — so every walker can make a more informed decision.
          </p>
          <div
            className="mt-8 flex flex-col gap-3 hero-animate"
            style={{ maxWidth: 380, animationDelay: '240ms' }}
          >
            <button
              onClick={() => navigate('/welcome')}
              onMouseDown={(e) => e.currentTarget.classList.add('was-active')}
              className="btn-spring w-full h-[52px] rounded-xl text-white font-bold uppercase tracking-[0.053em] border-b-[4px] transition-colors duration-150 hover:opacity-90 active:scale-[0.97]"
              style={{ background: '#F26A21', borderColor: '#D94E0D', fontSize: 15 }}
            >
              GET STARTED
            </button>
            <button
              onClick={() => navigate('/about')}
              className="w-full h-[52px] rounded-xl font-bold uppercase tracking-[0.053em] border-2 transition-all duration-150 hover:bg-[#f0f9fe]"
              style={{ borderColor: '#afafaf', color: '#1cb0f6', fontSize: 15, background: 'transparent' }}
            >
              SEE HOW IT WORKS
            </button>
          </div>
        </div>

        {/* Right — Live map with subtle hover tilt parallax */}
        <div
          ref={mapRef}
          className="order-1 md:order-2 relative"
          style={{ transition: 'transform 200ms ease-out' }}
        >
          <div
            className="w-full rounded-2xl overflow-hidden border border-[#e5e5e5]"
            style={{ height: 'clamp(300px, 45vw, 520px)' }}
          >
            <LiveMap selectedRoute="balanced" showAnnotations={true} height="100%" />
          </div>
          {/* Floating route badge with gentle float animation */}
          <div
            className="absolute bottom-4 left-4 rounded-xl px-3 py-2 flex items-center gap-2 badge-float"
            style={{ background: 'white', border: '1.5px solid #e5e5e5', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#F26A21' }} />
            <span className="text-[13px] font-bold" style={{ color: '#263238' }}>Balanced route · Score 81</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#D8F4EE', color: '#168B82' }}>Great</span>
          </div>
        </div>
      </div>
      {/* Sentinel observed by Nav to detect when hero leaves viewport */}
      <div className="hero-sentinel" />
    </section>
  );
}

// ─── Feature section 1: effective for everyone (app screenshot) ─────────────

function FeatureEffective() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal();
  return (
    <section className="bg-white w-full" style={{ borderTop: '1.5px solid #e5e5e5' }}>
      <div
        ref={revealRef}
        className="section-reveal max-w-[1200px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        {/* App screenshot — left */}
        <div className="flex justify-center md:justify-start">
          <img
            src={appScreenImg}
            alt="SafeRoute+ active trip screen showing You're on your way with trip stats and guardian actions"
            className="w-full max-w-[340px] object-contain drop-shadow-xl"
            style={{ maxHeight: 520 }}
          />
        </div>

        {/* Text — right */}
        <div>
          <h2
            className="font-black leading-[1.1]"
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: 'clamp(36px, 4.5vw, 52px)',
              color: '#F26A21',
              letterSpacing: '-0.02em',
            }}
          >
            effective for everyone.
          </h2>
          <p className="mt-5 leading-[1.55]" style={{ fontSize: 17, color: '#777777', maxWidth: 440 }}>
            Whether you are routing for a child walking to school, an older adult navigating busy crossings,
            or a general pedestrian who just wants calmer streets — SafeRoute+ adapts to what matters most
            for the person walking.
          </p>
          <button
            onClick={() => navigate('/welcome')}
            className="mt-8 h-[50px] px-6 rounded-xl font-bold uppercase tracking-[0.053em] border-2 transition-all duration-150 hover:bg-[#f0f9fe]"
            style={{ borderColor: '#afafaf', color: '#1cb0f6', fontSize: 15, background: 'transparent' }}
          >
            CHOOSE A PROFILE →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Feature section 2: transparent and explainable (city illustration) ──────

function FeatureTransparent() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal();
  return (
    <section className="bg-white w-full" style={{ borderTop: '1.5px solid #e5e5e5' }}>
      <div
        ref={revealRef}
        className="section-reveal max-w-[1200px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        {/* Text — left on desktop, below image on mobile */}
        <div className="order-2 md:order-1">
          <h2
            className="font-black leading-[1.1]"
            style={{
              fontFamily: 'Nunito, sans-serif',
              fontSize: 'clamp(36px, 4.5vw, 52px)',
              color: '#F26A21',
              letterSpacing: '-0.02em',
            }}
          >
            transparent and explainable.
          </h2>
          <p className="mt-5 leading-[1.55]" style={{ fontSize: 17, color: '#777777', maxWidth: 440 }}>
            Every suitability score is fully explainable. See the exact factors — speed limits, crossing
            complexity, sidewalk presence, road type — that shaped its score. The formula is public.
            There is no black box.
          </p>
          <button
            onClick={() => navigate('/about')}
            className="mt-8 h-[50px] px-6 rounded-xl font-bold uppercase tracking-[0.053em] border-2 transition-all duration-150 hover:bg-[#f0f9fe]"
            style={{ borderColor: '#afafaf', color: '#1cb0f6', fontSize: 15, background: 'transparent' }}
          >
            READ THE METHODOLOGY →
          </button>
        </div>

        {/* City illustration — right on desktop, above text on mobile */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <img
            src={cityMapImg}
            alt="3D isometric city map illustration with pedestrians following an orange route path"
            className="w-full max-w-[480px] object-contain"
            style={{ maxHeight: 460 }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── "safer. smarter. simpler." centered CTA ────────────────────────────────

function BigCTA() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal();
  return (
    <section className="w-full text-center" style={{ paddingTop: 100, paddingBottom: 100, background: 'white', borderTop: '1.5px solid #e5e5e5' }}>
      <div
        ref={revealRef}
        className="section-reveal max-w-[800px] mx-auto px-6"
      >
        <h2
          className="font-black"
          style={{
            fontFamily: 'Nunito, sans-serif',
            fontSize: 'clamp(52px, 8vw, 88px)',
            color: '#F26A21',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
          }}
        >
          {/* Each word is a separate block span so they typewrite in one-by-one on scroll reveal */}
          <span className="word-reveal" style={{ animationDelay: '0ms' }}>safer.</span>
          <span className="word-reveal" style={{ animationDelay: '140ms' }}>smarter.</span>
          <span className="word-reveal" style={{ animationDelay: '280ms' }}>simpler.</span>
        </h2>
        <p className="mt-6 mx-auto" style={{ fontSize: 17, color: '#777777', maxWidth: 440 }}>
          Start planning pedestrian-friendly routes in Ridgewood today. Free to use, private by design,
          built for Bergen County.
        </p>
        <button
          onClick={() => navigate('/welcome')}
          onMouseDown={(e) => e.currentTarget.classList.add('was-active')}
          className="btn-spring mt-8 h-[56px] px-10 rounded-xl text-white font-bold uppercase tracking-[0.053em] border-b-[4px] transition-colors duration-150 hover:opacity-90 active:scale-[0.97]"
          style={{ background: '#F26A21', borderColor: '#D94E0D', fontSize: 16 }}
        >
          GET STARTED
        </button>
      </div>
    </section>
  );
}

// ─── Feature section 3: private, not invasive ──────────────────────────────

function GuardianVisual() {
  return (
    <div className="w-full" style={{ maxWidth: 440 }}>
      <div className="rounded-2xl overflow-hidden" style={{ border: '2px solid #e5e5e5' }}>
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1.5px solid #e5e5e5' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#D8F4EE' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L4 5v6c0 3.3 2.6 6.4 6 7 3.4-.6 6-3.7 6-7V5L10 2z" fill="#168B82" fillOpacity="0.2" stroke="#168B82" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M7 10l2 2 4-4" stroke="#168B82" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-black text-[15px]" style={{ fontFamily: 'Nunito, sans-serif', color: '#263238' }}>Guardian Mode</div>
            <div className="text-[12px] font-semibold" style={{ color: '#168B82' }}>Active · Mom notified at arrival</div>
          </div>
          <div className="ml-auto text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#D8F4EE', color: '#168B82' }}>ON</div>
        </div>
        <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1.5px solid #e5e5e5' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-[16px] flex-shrink-0" style={{ background: '#FFE3CC', color: '#F26A21', fontFamily: 'Nunito, sans-serif' }}>M</div>
          <div className="flex-1">
            <div className="text-[14px] font-bold" style={{ color: '#263238' }}>Mom</div>
            <div className="text-[12px] font-semibold" style={{ color: '#777777' }}>Will get a text when you arrive · 4:32 PM est.</div>
          </div>
        </div>
        {[
          { icon: '✓', text: 'Arrival notification when you reach your destination', color: '#168B82' },
          { icon: '✓', text: 'Optional check-in messages you draft and approve first', color: '#168B82' },
          { icon: '✓', text: 'One-tap pickup request with optional location share', color: '#168B82' },
          { icon: '✗', text: 'No automatic location sharing. No live tracking.', color: '#D9534F' },
        ].map(item => (
          <div key={item.text} className="px-5 py-3 flex items-start gap-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
            <span className="text-[14px] font-black flex-shrink-0 mt-0.5" style={{ color: item.color }}>{item.icon}</span>
            <span className="text-[13px] font-semibold leading-snug" style={{ color: '#263238' }}>{item.text}</span>
          </div>
        ))}
        <div className="px-5 py-3" style={{ background: '#f9f9f9' }}>
          <span className="text-[11px] font-semibold" style={{ color: '#afafaf' }}>SafeRoute+ never shares location without your explicit approval.</span>
        </div>
      </div>
    </div>
  );
}

function FeaturePrivate() {
  const navigate = useNavigate();
  const revealRef = useScrollReveal();
  return (
    <section className="bg-white w-full" style={{ borderTop: '1.5px solid #e5e5e5' }}>
      <div
        ref={revealRef}
        className="section-reveal max-w-[1200px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center"
        style={{ paddingTop: 80, paddingBottom: 80 }}
      >
        <div className="flex justify-center md:justify-start">
          <GuardianVisual />
        </div>
        <div>
          <h2
            className="font-black leading-[1.1]"
            style={{ fontFamily: 'Nunito, sans-serif', fontSize: 'clamp(36px, 4.5vw, 52px)', color: '#F26A21', letterSpacing: '-0.02em' }}
          >
            private, not invasive.
          </h2>
          <p className="mt-5 leading-[1.55]" style={{ fontSize: 17, color: '#777777', maxWidth: 440 }}>
            Guardian Mode lets walkers share optional check-ins, request a pickup, or get reminded about
            arrival times — without automatic alerts or live location sharing. You draft every message.
            Nothing sends without your approval.
          </p>
          <button
            onClick={() => navigate('/welcome')}
            className="mt-8 h-[50px] px-6 rounded-xl font-bold uppercase tracking-[0.053em] border-2 transition-all duration-150 hover:bg-[#f0f9fe]"
            style={{ borderColor: '#afafaf', color: '#1cb0f6', fontSize: 15, background: 'transparent' }}
          >
            SET UP GUARDIAN MODE →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Bergen pilot strip ──────────────────────────────────────────────────────

function PilotStrip() {
  const revealRef = useScrollReveal();
  const cities = [
    { name: 'Ridgewood', active: true },
    { name: 'Glen Rock', active: false },
    { name: 'Wyckoff', active: false },
    { name: 'Paramus', active: false },
    { name: 'Fair Lawn', active: false },
    { name: 'Hackensack', active: false },
  ];
  return (
    <section className="w-full" style={{ background: '#FFF9F4', borderTop: '1.5px solid #e5e5e5', borderBottom: '1.5px solid #e5e5e5' }}>
      <div
        ref={revealRef}
        className="section-reveal max-w-[1200px] mx-auto px-6 md:px-8 text-center"
        style={{ paddingTop: 64, paddingBottom: 64 }}
      >
        <p className="font-bold uppercase tracking-[0.1em] text-[12px] mb-3" style={{ color: '#afafaf' }}>BERGEN COUNTY PILOT</p>
        <h3 className="font-black mb-8" style={{ fontFamily: 'Nunito, sans-serif', fontSize: 28, color: '#263238', letterSpacing: '-0.01em' }}>
          Expanding coverage, one municipality at a time.
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {cities.map(c => (
            <span
              key={c.name}
              className="px-4 py-2 rounded-full text-[14px] font-bold flex items-center gap-1.5"
              style={{ background: c.active ? '#F26A21' : 'white', color: c.active ? 'white' : '#777777', border: c.active ? 'none' : '1.5px solid #e5e5e5' }}
            >
              {c.name}
              {!c.active && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: '#f0f0f0', color: '#afafaf' }}>Soon</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer (full-bleed navy band) ───────────────────────────────────────────

function Footer() {
  const navigate = useNavigate();
  const cols = [
    { heading: 'Product', links: [{ label: 'Plan a Route', to: '/welcome' }, { label: 'Active Trip', to: '/active-trip' }] },
    { heading: 'Transparency', links: [{ label: 'Transparency', to: '/about' }] },
    { heading: 'About', links: [{ label: 'About', to: '/about' }] },
  ];

  return (
    <footer style={{ background: '#18384A' }}>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8" style={{ paddingTop: 64, paddingBottom: 48 }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <img src={logoImg} alt="SafeRoute+" className="w-auto object-contain" style={{ height: 56 }} />
          
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {cols.map(col => (
            <div key={col.heading}>
              <p className="font-bold uppercase tracking-[0.08em] text-[11px] mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{col.heading}</p>
              <ul className="flex flex-col gap-2">
                {col.links.map(l => (
                  <li key={l.label}>
                    <button
                      onClick={() => navigate(l.to)}
                      className="text-[14px] font-semibold transition-colors duration-150 text-left hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div className="pt-6 flex flex-col md:flex-row gap-4 items-start md:items-center" style={{ borderTop: '1.5px solid rgba(255,255,255,0.12)' }}>
          <p className="text-[12px] leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            SafeRoute+ suitability scores describe visible street characteristics derived from open data.
            They are not a guarantee of safety and should not be used as a substitute for personal judgment.
            © 2026 SafeRoute+ Bergen Pilot.
          </p>
          <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
            {['Privacy', 'Methodology', 'About'].map(l => (
              <button key={l} onClick={() => navigate('/about')} className="text-[12px] font-semibold transition-colors duration-150 hover:text-white" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function HomepageScreen() {
  return (
    <div className="min-h-screen" style={{ background: 'white' }}>
      <Nav />
      <Hero />
      <FeatureEffective />
      <FeatureTransparent />
      <BigCTA />
      <FeaturePrivate />
      <PilotStrip />
      <Footer />
    </div>
  );
}
