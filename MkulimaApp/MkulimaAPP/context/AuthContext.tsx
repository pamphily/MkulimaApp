import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthData = {
  token: string;
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  authData: AuthData | null;
  setAuthData: (data: AuthData | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  authData: null,
  setAuthData: () => {},
  logout: () => {},
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [authData, setAuthDataState] = useState<AuthData | null>(null);

  // Load auth data from AsyncStorage on app start
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const json = await AsyncStorage.getItem('authData');
        if (json) {
          setAuthDataState(JSON.parse(json));
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      }
    };
    loadAuthData();
  }, []);

  const setAuthData = async (data: AuthData | null) => {
    try {
      if (data) {
        await AsyncStorage.setItem('authData', JSON.stringify(data));
      } else {
        await AsyncStorage.removeItem('authData');
      }
      setAuthDataState(data);
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  const logout = async () => {
    await setAuthData(null);
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
