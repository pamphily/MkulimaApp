import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { EducationStackParamList } from "../types/Education";
import { CourseList, CourseView } from "../screens/EducationScreens";
import { Header } from "../component/Header";

const Stack = createStackNavigator<EducationStackParamList>();

export const EducationNav = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Courses"
        component={CourseList}
        options={{
          headerShown: true,
          headerRight: () => <Header />,
          headerStyle: { backgroundColor: "#F7FBF1" },
          headerTitleStyle: { color: "#1BB582" },
        }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseView}
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
