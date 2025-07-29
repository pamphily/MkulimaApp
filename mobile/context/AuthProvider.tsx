// AuthProvider.tsx

import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthData = {
  token: string | null;
  name?: string;
  email?: string;
  id?: number;
};

type AuthContextType = {
  authData: AuthData;
  setAuthData: (data: AuthData) => void;
  clearAuthData: () => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  authData: { token: null },
  setAuthData: () => {},
  clearAuthData: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [authData, setAuthDataState] = useState<AuthData>({ token: null });
  const [isLoading, setIsLoading] = useState(true);
  console.log(authData)

  const setAuthData = async (data: AuthData) => {
    console.log(data)
    setAuthDataState(data);
    await AsyncStorage.setItem('user', JSON.stringify(data)); // Save user session
  };

  const clearAuthData = async () => {
    setAuthDataState({ token: null });
    await AsyncStorage.removeItem('user'); // Clear session
  };

  const loadStoredUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('user');
      if (stored) {
        const userData = JSON.parse(stored);
        setAuthDataState(userData);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false); // App is ready
    }
  };

  useEffect(() => {
    loadStoredUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authData, setAuthData, clearAuthData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
