import React, { useContext } from 'react';

type GlobalSettings = {
  isMobile: boolean;
  isTablet: boolean;
};

const GlobalSettingsContext = React.createContext<GlobalSettings>({
  isMobile: false,
  isTablet: false,
});

export const useGlobalSettings = () => {
  return useContext(GlobalSettingsContext);
};

interface GlobalSettingsProviderProps extends GlobalSettings {
  children: React.ReactNode;
}

export const GlobalSettingsProvider = (props: GlobalSettingsProviderProps) => {
  const { children, isMobile, isTablet } = props;
  return (
    <GlobalSettingsContext.Provider value={{ isMobile, isTablet }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};
