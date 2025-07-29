import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CartScreen from "../screens/CartScreens/ui/Cart";
import { Header } from "../component/Header";

type CartStackParamList = {
  CartList: undefined;
};

const Stack = createStackNavigator<CartStackParamList>();

export const CartNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CartList"
        component={CartScreen}
        options={{
          headerShown: true,
          headerRight: () => <Header />,
          headerStyle: { backgroundColor: "#F7FBF1" },
          headerTitleStyle: { color: "#1BB582" },
        }}
      />
    </Stack.Navigator>
  );
};
