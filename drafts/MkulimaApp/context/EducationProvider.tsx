import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: string[];
}

interface EducationContextType {
  enrolledCourses: Record<string, string[]>; // courseId -> completed lessonIds
  enrollCourse: (courseId: string) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  completedLessons: (courseId: string) => string[];
  markLessonCompleted: (courseId: string, lessonId: string) => Promise<void>;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);
export const useEducation = (): EducationContextType => {
  const ctx = useContext(EducationContext);
  if (!ctx) throw new Error('useEducation must be used within EducationProvider');
  return ctx;
};

const STORAGE_KEY = 'EducationProgress';

export const EducationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, string[]>>({});

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setEnrolledCourses(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load education progress', err);
      }
    })();
  }, []);

  const persist = async (data: Record<string, string[]>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to persist education progress', err);
    }
  };

  const enrollCourse = async (courseId: string) => {
    if (!enrolledCourses[courseId]) {
      const updated = { ...enrolledCourses, [courseId]: [] };
      setEnrolledCourses(updated);
      await persist(updated);
    }
  };

  const isEnrolled = (courseId: string): boolean => {
    return Array.isArray(enrolledCourses[courseId]);
  };

  const completedLessons = (courseId: string): string[] => {
    return enrolledCourses[courseId] || [];
  };

  const markLessonCompleted = async (courseId: string, lessonId: string) => {
    const curr = enrolledCourses[courseId] || [];
    if (!curr.includes(lessonId)) {
      const updatedList = [...curr, lessonId];
      const updated = { ...enrolledCourses, [courseId]: updatedList };
      setEnrolledCourses(updated);
      await persist(updated);
    }
  };

  return (
    <EducationContext.Provider
      value={{ enrolledCourses, enrollCourse, isEnrolled, completedLessons, markLessonCompleted }}>
      {children}
    </EducationContext.Provider>
  );
};
