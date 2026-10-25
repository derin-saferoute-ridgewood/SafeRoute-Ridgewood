import { createContext, useContext, useState, ReactNode } from 'react';

export type Profile = 'child' | 'older-adult' | 'general';
export type RouteOption = 'fastest' | 'safest';
export type CrashDataset = 'low' | 'high' | 'unverified';

interface AppContextType {
  profile: Profile;
  setProfile: (p: Profile) => void;
  selectedRoute: RouteOption;
  setSelectedRoute: (r: RouteOption) => void;
  crashDataset: CrashDataset;
  setCrashDataset: (dataset: CrashDataset) => void;
  guardianMode: boolean;
  setGuardianMode: (v: boolean) => void;
  preferenceValue: number;
  setPreferenceValue: (v: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>('general');
  const [selectedRoute, setSelectedRoute] = useState<RouteOption>('fastest');
  const [crashDataset, setCrashDataset] = useState<CrashDataset>('low');
  const [guardianMode, setGuardianMode] = useState(false);
  const [preferenceValue, setPreferenceValue] = useState(72);

  return (
    <AppContext.Provider value={{
      profile, setProfile,
      selectedRoute, setSelectedRoute,
      crashDataset, setCrashDataset,
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
