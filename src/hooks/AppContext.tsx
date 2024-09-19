import { useState, useContext, createContext } from "react";
import { useDeskproAppEvents } from "@deskpro/app-sdk";
import type { FC, PropsWithChildren } from "react";
import type { Settings } from "../types";

const AppContext = createContext<{ settings: Settings|null }>({ settings: null });

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<Settings|null>(null);

  useDeskproAppEvents({
    onAdminSettingsChange: setSettings,
  });
  
  return (
    <AppContext.Provider value={{ settings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
