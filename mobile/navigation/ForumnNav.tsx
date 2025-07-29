import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ForumnStackParamList } from "../types/Forumn";
import { ForumScreen, PostDetails } from "../screens/ForumnScreens";
import { Header } from "../component/Header";

const Stack = createStackNavigator<ForumnStackParamList>();

export const ForumnNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feeds"
        component={ForumScreen}
        options={{
          headerShown: true,
          headerRight: () => <Header />,
          headerStyle: { backgroundColor: "#F7FBF1" },
          headerTitleStyle: { color: "#1BB582" },
        }}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetails}
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
