export type EducationStackParamList = {
  Courses: undefined;
  CourseDetail: { courseId: string };
  Payment: { courseId: string };
  Lesson: { courseId: string; lessonId: string };
};

export interface Lesson {
    id: string;
    title: string;
    type: 'video' | 'text';
    contentUri?: string;
    contentText?: string;
    duration?: number;
  }
  
 export interface Course {
    id: string;
    title: string;
    description: string;
    imageUri: string;
    category: string;
    lessons: Lesson[];
    price: number;
  }