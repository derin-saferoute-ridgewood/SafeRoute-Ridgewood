interface RidgewoodMapProps {
  selectedRoute?: 'fastest' | 'balanced' | 'pedestrian';
  showUserDot?: boolean;
  userOffRoute?: boolean;
  showAnnotations?: boolean;
  zoomSegment?: boolean;
  className?: string;
}

const ROUTES = {
  fastest: {
    color: '#2774C7',
    points: '298,82 275,82 275,152 83,152 83,218 50,218 50,258',
    strokeWidth: 3,
    strokeDasharray: 'none',
  },
  balanced: {
    color: '#F26A21',
    points: '298,82 185,82 185,152 140,152 112,178 83,195 83,258',
    strokeWidth: 5,
    strokeDasharray: 'none',
  },
  pedestrian: {
    color: '#168B82',
    points: '298,82 248,68 185,82 162,118 145,152 122,170 102,200 83,232 50,258',
    strokeWidth: 3,
    strokeDasharray: '8,5',
  },
};

export default function RidgewoodMap({
  selectedRoute = 'balanced',
  showUserDot = false,
  userOffRoute = false,
  showAnnotations = true,
  zoomSegment = false,
  className = '',
}: RidgewoodMapProps) {
  const viewBox = zoomSegment ? '0 100 250 200' : '0 0 390 310';

  const routeOrder: Array<'fastest' | 'balanced' | 'pedestrian'> = ['fastest', 'pedestrian', 'balanced'];
  const ordered = routeOrder.filter(r => r !== selectedRoute);
  ordered.push(selectedRoute);

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Land background */}
      <rect width="390" height="310" fill="#F5EFE4" />

      {/* Block fills (buildings area) */}
      <rect x="96" y="60" width="82" height="85" fill="#EDE8DF" rx="2" />
      <rect x="196" y="60" width="72" height="85" fill="#EDE8DF" rx="2" />
      <rect x="96" y="165" width="15" height="45" fill="#EDE8DF" rx="2" />
      <rect x="215" y="165" width="52" height="45" fill="#EDE8DF" rx="2" />
      <rect x="96" y="230" width="25" height="55" fill="#EDE8DF" rx="2" />
      <rect x="130" y="230" width="48" height="55" fill="#EDE8DF" rx="2" />
      <rect x="200" y="230" width="85" height="55" fill="#EDE8DF" rx="2" />

      {/* Park – Van Neste Square area */}
      <rect x="117" y="163" width="88" height="50" fill="#C2DBA8" rx="4" />
      <text x="161" y="194" textAnchor="middle" fill="#3A6E2F" fontSize="7" fontWeight="600" fontFamily="Nunito Sans, sans-serif">Van Neste Sq</text>

      {/* Streets – horizontals */}
      <rect x="0" y="148" width="390" height="11" fill="#CBBFA8" />
      <rect x="0" y="213" width="390" height="9" fill="#CBBFA8" />
      <rect x="0" y="275" width="390" height="7" fill="#D4CBBB" />

      {/* Streets – verticals */}
      <rect x="78" y="55" width="10" height="260" fill="#CBBFA8" />
      <rect x="180" y="55" width="8" height="260" fill="#D4CBBB" />
      <rect x="270" y="55" width="7" height="260" fill="#D4CBBB" />

      {/* Crosswalk at Franklin/Ridgewood Ave */}
      {[0, 6, 12, 18].map(i => (
        <rect key={i} x={76 + i * 3.5} y="148" width="2" height="11" fill="white" opacity="0.6" />
      ))}
      {/* Crosswalk at Franklin/Maple Ave */}
      {[0, 6, 12, 18].map(i => (
        <rect key={i} x={76 + i * 3.5} y="213" width="2" height="9" fill="white" opacity="0.6" />
      ))}

      {/* Street labels */}
      <text x="160" y="146" textAnchor="middle" fill="#18384A" fontSize="7.5" fontWeight="700" fontFamily="Nunito Sans, sans-serif">E RIDGEWOOD AVE</text>
      <text x="220" y="228" textAnchor="middle" fill="#18384A" fontSize="7" fontWeight="600" fontFamily="Nunito Sans, sans-serif">MAPLE AVE</text>
      <text x="68" y="100" textAnchor="middle" fill="#18384A" fontSize="7" fontWeight="600" fontFamily="Nunito Sans, sans-serif" transform="rotate(-90,68,100)">FRANKLIN AVE</text>
      <text x="175" y="100" textAnchor="middle" fill="#18384A" fontSize="6.5" fontWeight="600" fontFamily="Nunito Sans, sans-serif" transform="rotate(-90,175,100)">OAK ST</text>

      {/* School landmark */}
      <rect x="286" y="58" width="100" height="52" fill="#E8F0FB" stroke="#18384A" strokeWidth="1.5" rx="3" />
      <text x="336" y="79" textAnchor="middle" fill="#18384A" fontSize="7.5" fontWeight="700" fontFamily="Nunito Sans, sans-serif">RIDGEWOOD</text>
      <text x="336" y="90" textAnchor="middle" fill="#18384A" fontSize="7.5" fontWeight="700" fontFamily="Nunito Sans, sans-serif">HIGH SCHOOL</text>
      <circle cx="336" cy="102" r="4" fill="#F26A21" />

      {/* Station landmark */}
      <rect x="16" y="240" width="88" height="44" fill="#FFF0DC" stroke="#18384A" strokeWidth="1.5" rx="3" />
      <text x="60" y="259" textAnchor="middle" fill="#18384A" fontSize="7.5" fontWeight="700" fontFamily="Nunito Sans, sans-serif">RIDGEWOOD</text>
      <text x="60" y="270" textAnchor="middle" fill="#18384A" fontSize="7.5" fontWeight="700" fontFamily="Nunito Sans, sans-serif">TRAIN STATION</text>
      <circle cx="60" cy="278" r="4" fill="#18384A" />

      {/* Route lines – non-selected drawn first (under) */}
      {ordered.map(r => {
        const route = ROUTES[r];
        const isSelected = r === selectedRoute;
        return (
          <polyline
            key={r}
            points={route.points}
            fill="none"
            stroke={route.color}
            strokeWidth={isSelected ? route.strokeWidth : 2}
            strokeDasharray={route.strokeDasharray === 'none' ? undefined : route.strokeDasharray}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={isSelected ? 1 : 0.5}
          />
        );
      })}

      {/* Origin pin */}
      <circle cx="298" cy="82" r="7" fill="#F26A21" stroke="white" strokeWidth="2" />
      <circle cx="298" cy="82" r="3" fill="white" />

      {/* Destination pin */}
      <circle cx="50" cy="258" r="7" fill="#18384A" stroke="white" strokeWidth="2" />
      <circle cx="50" cy="258" r="3" fill="white" />

      {/* Annotations */}
      {showAnnotations && (
        <>
          {/* Red problem segment – Maple Ave crossing */}
          <circle cx="83" cy="218" r="14" fill="#D9534F" opacity="0.18" />
          <circle cx="83" cy="218" r="9" fill="#D9534F" opacity="0.3" />
          <text x="100" y="212" fill="#D9534F" fontSize="7" fontWeight="700" fontFamily="Nunito Sans, sans-serif">Higher speed</text>
          <text x="100" y="222" fill="#D9534F" fontSize="7" fontWeight="600" fontFamily="Nunito Sans, sans-serif">+ complex crossing</text>

          {/* Green positive segment */}
          <text x="120" y="173" fill="#168B82" fontSize="7" fontWeight="700" fontFamily="Nunito Sans, sans-serif">Sidewalk +</text>
          <text x="120" y="183" fill="#168B82" fontSize="7" fontWeight="600" fontFamily="Nunito Sans, sans-serif">residential street</text>
        </>
      )}

      {/* User location dot (active trip) */}
      {showUserDot && !userOffRoute && (
        <>
          <circle cx="185" cy="152" r="12" fill="#2774C7" opacity="0.15" />
          <circle cx="185" cy="152" r="7" fill="#2774C7" opacity="0.3" />
          <circle cx="185" cy="152" r="5" fill="#2774C7" stroke="white" strokeWidth="2" />
        </>
      )}

      {/* Off-route user dot (displaced from route) */}
      {showUserDot && userOffRoute && (
        <>
          <circle cx="155" cy="130" r="12" fill="#F6BD31" opacity="0.2" />
          <circle cx="155" cy="130" r="7" fill="#F6BD31" opacity="0.35" />
          <circle cx="155" cy="130" r="5" fill="#F26A21" stroke="white" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}
