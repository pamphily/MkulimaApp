// screens/EducationScreen/ui/CourseDetailScreen.tsx

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
import { EducationStackParamList } from '../../../navigation/EducationNav';
import { useEducation } from '../../../context/EducationProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { demoCourses, Course } from '../../../services/courses';

type CourseDetailRouteProp = RouteProp<EducationStackParamList, 'CourseDetail'>;
type CourseDetailNavigationProp = StackNavigationProp<EducationStackParamList, 'CourseDetail'>;

const ICON_MAP: Record<string, JSX.Element> = {
  Sustainability: <MaterialCommunityIcons name="leaf" size={20} color="#2e7d32" />,
  'Crop Management': <MaterialCommunityIcons name="corn" size={20} color="#E69138" />,
  'Pest Management': <MaterialCommunityIcons name="bug" size={20} color="#D9534F" />,
  'Soil Management': <MaterialCommunityIcons name="soil" size={20} color="#8B4513" />,
};

const CourseDetailScreen: React.FC = () => {
  const route = useRoute<CourseDetailRouteProp>();
  const navigation = useNavigation<CourseDetailNavigationProp>();
  const { courseId } = route.params;
  const { isEnrolled, completedLessons } = useEducation();

  // Language state for toggle
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const found = demoCourses.find(c => c.id === courseId) || null;
    setCourse(found);
    setEnrolled(isEnrolled(courseId));
    setLoading(false);
  }, [courseId, isEnrolled]);

  // Helper function to get course description based on language
  const getDescriptionText = (desc: string | { en: string; sw: string }) => {
    if (typeof desc === 'string') return desc;
    return language === 'en' ? desc.en : desc.sw;
  };

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
  const progressPercent = enrolled ? Math.round((completed / totalLessons) * 100) : 0;

  const handleEnroll = () => {
    const nextLesson = course.lessons[0];
    navigation.navigate('Lesson', { courseId, lessonId: nextLesson.id });
  };

  const handleContinue = () => {
    const completedIds = completedLessons(courseId);
    const nextLesson = course.lessons.find(l => !completedIds.includes(l.id)) || course.lessons[0];
    navigation.navigate('Lesson', { courseId, lessonId: nextLesson.id });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: course.imageUri }} style={styles.headerImage} />

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{course.title}</Text>
          {ICON_MAP[course.category] && <View style={styles.iconWrapper}>{ICON_MAP[course.category]}</View>}
        </View>
        <Text style={styles.categoryText}>{course.category}</Text>

        {/* Language Toggle */}
        <View style={styles.languageToggleContainer}>
          <TouchableOpacity
            onPress={() => setLanguage('en')}
            style={[styles.langButton, language === 'en' && styles.langButtonActive]}
          >
            <Text style={language === 'en' ? styles.langTextActive : styles.langText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setLanguage('sw')}
            style={[styles.langButton, language === 'sw' && styles.langButtonActive, { marginLeft: 12 }]}
          >
            <Text style={language === 'sw' ? styles.langTextActive : styles.langText}>Swahili</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.description}>{getDescriptionText(course.description)}</Text>

        <View style={styles.progressWrapper}>
          <View style={styles.progressBackground}>
            <View style={[styles.progressBar, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {enrolled
              ? `${progressPercent}% completed (${completed}/${totalLessons})`
              : 'Not enrolled'}
          </Text>
        </View>

        {!enrolled ? (
          <TouchableOpacity style={styles.enrollButton} onPress={handleEnroll}>
            <Text style={styles.enrollButtonText}>Enroll Now</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue Course</Text>
          </TouchableOpacity>
        )}
      </View>

      {enrolled && (
        <View style={styles.lessonsContainer}>
          <Text style={styles.lessonsHeader}>Lessons</Text>
          {course.lessons.map(lesson => {
            const completedIds = completedLessons(courseId);
            const done = completedIds.includes(lesson.id);
            return (
              <TouchableOpacity
                key={lesson.id}
                style={styles.lessonItem}
                onPress={() => navigation.navigate('Lesson', { courseId, lessonId: lesson.id })}
              >
                <View style={styles.lessonLeft}>
                  <Ionicons
                    name={lesson.type === 'video' ? 'play-circle-outline' : 'document-text-outline'}
                    size={24}
                    color="#2e7d32"
                  />
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                </View>
                {done && <Ionicons name="checkmark-circle-outline" size={20} color="#2e7d32" />}
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

  languageToggleContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2e7d32',
    borderRadius: 20,
  },
  langButtonActive: {
    backgroundColor: '#2e7d32',
  },
  langText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  langTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

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
