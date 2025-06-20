// // AuthProvider.tsx

import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

type AuthData = {
    token: string | null;
    // id: string | null;
};

type AuthContextType = {
    authData: AuthData;
    setAuthData: (data: AuthData) => void;
    clearAuthData: () => void;
};

export const AuthContext = createContext<AuthContextType>({ 
    authData: { token: null },
    setAuthData: () => {},
    clearAuthData: () => {},});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }: any) => {

    const [authData, setAuthDataState] = useState<AuthData>({ token: null });

    const setAuthData = (data: AuthData) => {
        setAuthDataState(data);
        
    };

    const clearAuthData = () => {
        setAuthDataState({ token: null });
    };

    const value = { authData, setAuthData, clearAuthData };
    console.log(authData)

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>;
};
