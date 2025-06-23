// services/UserService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to decode JWT token payload
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT token:', e);
    return null;
  }
};

export const getUserToken = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed?.token || null;
    }
    return null;
  } catch (error) {
    console.error('Error reading token from storage:', error);
    return null;
  }
};

export const getUserId = async () => {
  try {
    const token = await getUserToken();
    if (!token) return null;

    const payload = parseJwt(token);
    return payload?.id || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};
