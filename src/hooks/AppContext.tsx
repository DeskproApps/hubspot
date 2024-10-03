import { useState, useEffect, useContext, createContext } from "react";
import { useDeskproAppEvents } from "@deskpro/app-sdk";
import type { FC, PropsWithChildren } from "react";
import type { Settings } from "../types";

type Context = {
  settings: Settings|null;
  isLoading: boolean;
};

const AppContext = createContext<Context>({
  settings: null,
  isLoading: true,
});

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const [settings, setSettings] = useState<Settings|null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => setIsLoading(!settings), [settings]);

  useDeskproAppEvents({
    onAdminSettingsChange: setSettings,
  });
  
  return (
    <AppContext.Provider value={{ settings, isLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
