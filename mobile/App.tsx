import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { AppNav } from "./navigation/AppNav";
import { StatusBar } from "expo-status-bar";
import { EducationProvider } from "./context/EduProvider";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";

const AppWrapper = () => {
  return (
    <CartProvider>
    <EducationProvider>
      <NavigationContainer>
        <AppNav />
        <StatusBar style="auto" />
      </NavigationContainer>
    </EducationProvider>
    </CartProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  );
}
