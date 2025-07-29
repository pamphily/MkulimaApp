import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import { Home } from "../screens/HomeScreens";
import { CourseList } from "../screens/EducationScreens";
import { ForumScreen } from "../screens/ForumnScreens";
import { Cart } from "../screens/CartScreens";
import { Header } from "../component/Header";
import { EducationNav } from "./EducationNav";
import { useAuth } from "../context/AuthProvider";
import { LoginScreen } from "../screens/AuthScreens";
import { SplashScreen, WelcomeScreen } from "../screens/WelcomeScreens";
import RegisterScreen from "../screens/AuthScreens/ui/RegisterScreen";
import { ForumnNav } from "./ForumnNav";
import { CartNav } from "./CartNav";
import { ProductScreen, ProductViewScreen } from "../screens/ProductScreen";
import ProfileScreen from "../screens/ProfileScreen/ProfileScreen";

function BottomNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#eaf7da",
          borderTopColor: "#e0e0e0",
          borderTopWidth: 1,
          display: "flex",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Education") {
            iconName = focused ? "school" : "school-outline";
          } else if (route.name === "Forumn") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Cart") {
            iconName = focused ? "bag" : "bag-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: true,
          headerRight: () => <Header />,
          headerStyle: { backgroundColor: "#F7FBF1" },
          headerTitleStyle: { color: "#1BB582" },
        }}
      />
      <Tab.Screen
        name="Education"
        component={EducationNav}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Forumn"
        component={ForumnNav}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Cart"
        component={CartNav}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export const AppNav = () => {
  const { authData } = useAuth();
  console.log(authData.token)
  return (
    <Stack.Navigator>
      {authData.token ? (
        <>
         <Stack.Screen
          name="MainTab"
          component={BottomNavigator}
          options={{ headerShown: false }}
        />
         <Stack.Screen name="Products" component={ProductScreen} options={{ headerShown: false }} />
         <Stack.Screen name="ProductDetails" component={ProductViewScreen} options={{ headerShown: true }} />
         <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </>
       
        
      ) : (
        <>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};
