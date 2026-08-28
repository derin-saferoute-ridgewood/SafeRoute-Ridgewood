import { createContext, useContext, useState, ReactNode } from 'react';

export type Profile = 'child' | 'older-adult' | 'general';
export type RouteOption = 'fastest' | 'balanced' | 'pedestrian';

interface AppContextType {
  profile: Profile;
  setProfile: (p: Profile) => void;
  selectedRoute: RouteOption;
  setSelectedRoute: (r: RouteOption) => void;
  guardianMode: boolean;
  setGuardianMode: (v: boolean) => void;
  preferenceValue: number;
  setPreferenceValue: (v: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>('child');
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>('balanced');
  const [guardianMode, setGuardianMode] = useState(false);
  const [preferenceValue, setPreferenceValue] = useState(62);

  return (
    <AppContext.Provider value={{
      profile, setProfile,
      selectedRoute, setSelectedRoute,
      guardianMode, setGuardianMode,
      preferenceValue, setPreferenceValue,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
