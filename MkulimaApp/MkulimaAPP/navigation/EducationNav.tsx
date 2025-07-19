import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EducationScreen from '../screens/EducationScreen/ui/CourseListScreen';
import CourseDetailScreen from '../screens/EducationScreen/ui/CourseDetailScreen';
import LessonScreen from '../screens/EducationScreen/ui/LessonsScreen';
import PaymentScreen from '../screens/EducationScreen/ui/CoursePaymentScreen';

import { EducationProvider } from '../context/EducationProvider';
import { LanguageProvider } from '../context/LanguageProvider'; // ✅ Add LanguageProvider

export type EducationStackParamList = {
  CourseList: undefined;
  CourseDetail: { courseId: string };
  Payment: { courseId: string };
  Lesson: { courseId: string; lessonId: string };
};

const Stack = createStackNavigator<EducationStackParamList>();

const EducationStack: React.FC = () => {
  return (
    <EducationProvider>
      <LanguageProvider> {/* ✅ Wrap only the education stack */}
        <Stack.Navigator initialRouteName="CourseList">
          <Stack.Screen
            name="CourseList"
            component={EducationScreen}
            options={{ title: 'Courses' }}
          />
          <Stack.Screen
            name="CourseDetail"
            component={CourseDetailScreen}
            options={{ title: 'Course Details' }}
          />
          <Stack.Screen
            name="Lesson"
            component={LessonScreen}
            options={{ title: 'Lesson' }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: 'Payment' }}
          />
        </Stack.Navigator>
      </LanguageProvider>
    </EducationProvider>
  );
};

export default EducationStack;
