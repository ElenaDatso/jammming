import React, { createContext, useContext, useState } from 'react';

type AccessType = 'corfirmed' | 'denied' | 'unset';

type AuthContextType = {
  isAuthorized: boolean;
  accessStatus: AccessType;
  setIfAuthHandler: (ifAutherized: boolean) => void;
  setAccessStatusHandler: (status: AccessType) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessStatus, setAccess] = useState<AccessType>("unset");

  const setIfAuthHandler = (ifAutherized: boolean) => {
    setIsAuthorized(ifAutherized)
  }
  const setAccessStatusHandler = (status: AccessType) => {
    setAccess(status);
  }
  return (
    <AuthContext.Provider value={{ isAuthorized, accessStatus, setIfAuthHandler, setAccessStatusHandler }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useSongContext must be used within a SongProvider');
    }
    return context;
}