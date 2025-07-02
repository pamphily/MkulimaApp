import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen/ui/HomeScreen';
import EducationScreen from '../screens/EducationScreen/ui/CourseListScreen';
import ForumnScreen from '../screens/ForumnScreen/ui/ForumnScreen';
import CartScreen from '../screens/CartScreen/ui/CartScreen';
import SplashScreen from '../screens/WelcomeScreen/ui/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen/ui/WelcomeScreen';
import LoginScreen from '../screens/AuthScreen/LoginScreen';
import RegisterScreen from '../screens/AuthScreen/RegisterScreen';
import ProductScreen from '../screens/ProductScreen/ProductScreen';
import ProductViewScreen from '../screens/ProductScreen/ProductViewScreen';
import EducationStack from './EducationNav';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import HeaderMenu from '../components/HeaderComponent';
import ChatBotScreen from '../screens/ChatBotScreen/ChatBotScreen';
import ChatListScreen from '../screens/ChatScreen/ChatListScreen';
import ChatScreen from '../screens/ChatScreen/ChatScreen';

import { useAuth } from '../context/AuthProvider';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#eaf7da',
          borderTopColor: '#e0e0e0',
          borderTopWidth: 1,
          display: 'flex',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Education') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Forumn') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'bag' : 'bag-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          headerRight: () => <HeaderMenu />,
          headerStyle: { backgroundColor: '#F7FBF1' },
          headerTitleStyle: { color: '#1BB582' },
        }}
      />
      <Tab.Screen name="Education" component={EducationStack} options={{ headerShown: false }} />
      <Tab.Screen name="Forumn" component={ForumnScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  const { authData } = useAuth();

  return (
    <Stack.Navigator initialRouteName={authData.token ? "MainTab" : "Splash"}>
      {authData.token ? (
        <>
          <Stack.Screen name="MainTab" component={BottomNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Products" component={ProductScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ProductDetails" component={ProductViewScreen} options={{ headerShown: true }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="Chatbot" component={ChatBotScreen} />
          <Stack.Screen name="ChatList" component={ChatListScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
