import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";
import { EducationProvider } from "./context/EducationProvider";
import SarufiChatbox from "react-sarufi-chatbox";

export default function App() {
  return (
    <AuthProvider>
          <EducationProvider>

      <CartProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CartProvider>
      </EducationProvider>
    </AuthProvider>
  );
}
