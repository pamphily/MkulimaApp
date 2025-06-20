// screens/EducationScreen/CourseDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EducationStackParamList } from '../../../navigation/EducationNav'; // adjust path as needed
import { useEducation } from '../../../context/EducationProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Re-use or import your Course and Lesson interfaces / data source
interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text';
  contentUri?: string;
  contentText?: string;
  duration?: number; // optional
}
interface Course {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  category: string;
  lessons: Lesson[];
}

// Demo data; replace with real fetch
const demoCourses: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to Sustainable Farming',
    description:
      'Learn principles of sustainable agriculture to improve yield and protect environment.',
    imageUri:
      'https://via.placeholder.com/600x400.png?text=Sustainable+Farming',
    category: 'Sustainability',
    lessons: [
      {
        id: 'l1',
        title: 'What is Sustainable Farming?',
        type: 'text',
        contentText: 'Sustainable farming is ...',
      },
      {
        id: 'l2',
        title: 'Soil Health',
        type: 'video',
        contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
    ],
  },
  {
    id: 'c2',
    title: 'Crop Rotation Techniques',
    description: 'Understand crop rotation and its benefits.',
    imageUri:
      'https://via.placeholder.com/600x400.png?text=Crop+Rotation',
    category: 'Crop Management',
    lessons: [
      {
        id: 'l1',
        title: 'Basics of Crop Rotation',
        type: 'text',
        contentText: 'Crop rotation means ...',
      },
      {
        id: 'l2',
        title: 'Planning Rotation Schedules',
        type: 'video',
        contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
    ],
  },
  {
    id: 'c3',
    title: 'Organic Pest Control',
    description: 'Natural methods to manage pests without harmful chemicals.',
    imageUri:
      'https://via.placeholder.com/600x400.png?text=Organic+Pest+Control',
    category: 'Pest Management',
    lessons: [
      {
        id: 'l1',
        title: 'Common Pests and Identification',
        type: 'text',
        contentText: 'Pests include ...',
      },
      {
        id: 'l2',
        title: 'Natural Predators',
        type: 'video',
        contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
    ],
  },
  {
    id: 'c4',
    title: 'Soil Testing Basics',
    description:
      'Learn how to test soil pH and nutrients for optimal yield.',
    imageUri:
      'https://via.placeholder.com/600x400.png?text=Soil+Testing',
    category: 'Soil Management',
    lessons: [
      {
        id: 'l1',
        title: 'Why Test Soil?',
        type: 'text',
        contentText: 'Testing soil helps ...',
      },
      {
        id: 'l2',
        title: 'DIY Testing Methods',
        type: 'video',
        contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
    ],
  },
];

type CourseDetailRouteProp = RouteProp<EducationStackParamList, 'CourseDetail'>;
type CourseDetailNavigationProp = StackNavigationProp<
  EducationStackParamList,
  'CourseDetail'
>;

const ICON_MAP: Record<string, JSX.Element> = {
  Sustainability: <MaterialCommunityIcons name="leaf" size={20} color="#2e7d32" />,
  'Crop Management': (
    <MaterialCommunityIcons name="corn" size={20} color="#E69138" />
  ),
  'Pest Management': (
    <MaterialCommunityIcons name="bug" size={20} color="#D9534F" />
  ),
  'Soil Management': (
    <MaterialCommunityIcons name="soil" size={20} color="#8B4513" />
  ),
};

const CourseDetailScreen: React.FC = () => {
  const route = useRoute<CourseDetailRouteProp>();
  const navigation = useNavigation<CourseDetailNavigationProp>();
  const { courseId } = route.params;
  const { isEnrolled, enrollCourse, completedLessons } = useEducation();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch course data; here we simulate via demoCourses
    const found = demoCourses.find(c => c.id === courseId) || null;
    setCourse(found);
    setEnrolled(isEnrolled(courseId));
    setLoading(false);
  }, [courseId, isEnrolled]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFoundText}>Course not found.</Text>
      </View>
    );
  }

  const totalLessons = course.lessons.length;
  const completed = completedLessons(courseId).length;
  const progressPercent = enrolled
    ? Math.round((completed / totalLessons) * 100)
    : 0;

  const handleEnroll = async () => {
    navigation.navigate('Payment', { courseId });

  };

  const handleContinue = () => {
    // navigate to first incomplete lesson or first lesson
    const completedIds = completedLessons(courseId);
    const nextLesson =
      course.lessons.find(l => !completedIds.includes(l.id)) ||
      course.lessons[0];
    navigation.navigate('Lesson', {
      courseId,
      lessonId: nextLesson.id,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header image */}
      <Image source={{ uri: course.imageUri }} style={styles.headerImage} />

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{course.title}</Text>
          {ICON_MAP[course.category] && (
            <View style={styles.iconWrapper}>{ICON_MAP[course.category]}</View>
          )}
        </View>
        <Text style={styles.categoryText}>{course.category}</Text>
        <Text style={styles.description}>{course.description}</Text>

        {/* Progress bar */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressBar,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {enrolled
              ? `${progressPercent}% completed (${completed}/${totalLessons})`
              : 'Not enrolled'}
          </Text>
        </View>

        {/* Enroll / Continue button */}
        {!enrolled ? (
          <TouchableOpacity
            style={styles.enrollButton}
            onPress={handleEnroll}
          >
            <Text style={styles.enrollButtonText}>Enroll Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue Course</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lessons list */}
      {enrolled && (
        <View style={styles.lessonsContainer}>
          <Text style={styles.lessonsHeader}>Lessons</Text>
          {course.lessons.map((lesson, idx) => {
            const completedIds = completedLessons(courseId);
            const done = completedIds.includes(lesson.id);
            return (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonItem}
                onPress={() =>
                  navigation.navigate('Lesson', {
                    courseId,
                    lessonId: lesson.id,
                  })
                }
              >
                <View style={styles.lessonLeft}>
                  <Ionicons
                    name={
                      lesson.type === 'video'
                        ? 'play-circle-outline'
                        : 'document-text-outline'
                    }
                    size={24}
                    color="#2e7d32"
                  />
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                </View>
                {done && (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#2e7d32"
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default CourseDetailScreen;

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = width * 0.5;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontSize: 16, color: '#444' },
  headerImage: {
    width: '100%',
    height: HEADER_HEIGHT,
    backgroundColor: '#F7FBF1',
  },
  infoContainer: { padding: 16 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#333', flex: 1 },
  iconWrapper: { marginLeft: 8 },
  categoryText: { fontSize: 14, color: '#666', marginBottom: 12 },
  description: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 16 },
  progressWrapper: { marginBottom: 16 },
  progressBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#2e7d32',
  },
  progressText: { marginTop: 4, fontSize: 12, color: '#333' },
  enrollButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  enrollButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  lessonsContainer: { paddingHorizontal: 16, paddingBottom: 32 },
  lessonsHeader: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  lessonLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  lessonTitle: { marginLeft: 8, fontSize: 14, color: '#333', flexShrink: 1 },
});
