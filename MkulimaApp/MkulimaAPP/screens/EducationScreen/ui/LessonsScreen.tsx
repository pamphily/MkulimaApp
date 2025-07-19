import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EducationStackParamList } from '../../../navigation/EducationNav';
import { demoCourses, Lesson } from '../../../services/courses';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useEducation } from '../../../context/EducationProvider';
import { useLang } from '../../../context/LanguageProvider';

type LessonRouteProp = RouteProp<EducationStackParamList, 'Lesson'>;
type LessonNavigationProp = StackNavigationProp<EducationStackParamList, 'Lesson'>;

const LessonScreen: React.FC = () => {
  const route = useRoute<LessonRouteProp>();
  const navigation = useNavigation<LessonNavigationProp>();
  const { courseId, lessonId } = route.params;

  const { completedLessons, markLessonCompleted } = useEducation();
  const { lang, setLang } = useLang();

  const [courseLessons, setCourseLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const course = demoCourses.find(c => c.id === courseId);
    if (!course) {
      setCourseLessons([]);
      setLoading(false);
      return;
    }

    setCourseLessons(course.lessons);
    setCompleted(completedLessons(courseId).includes(lessonId));
    setLoading(false);
  }, [courseId, lessonId, completedLessons]);

  const lesson = courseLessons.find(l => l.id === lessonId) || null;

  const markComplete = async () => {
    await markLessonCompleted(courseId, lessonId);
    setCompleted(true);
  };

  const currentIndex = courseLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Lesson not found.</Text>
      </View>
    );
  }

  const title =
    typeof lesson.title === 'string'
      ? lesson.title
      : lesson.title?.[lang] || lesson.title?.en || 'Untitled';

  const content =
    typeof lesson.contentText === 'string'
      ? lesson.contentText
      : lesson.contentText?.[lang] || lesson.contentText?.en || 'No content available';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.toggleRow}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          style={styles.langToggle}
          onPress={() => setLang(lang === 'en' ? 'sw' : 'en')}
        >
          <Text style={styles.langToggleText}>
            {lang === 'en' ? '🇬🇧 EN' : '🇹🇿 SW'}
          </Text>
        </TouchableOpacity>
      </View>

      {lesson.type === 'text' && content && (
        <Text style={styles.textContent}>{content}</Text>
      )}

      {lesson.type === 'video' && lesson.contentUri && (
        <Video
          source={{ uri: lesson.contentUri }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping={false}
        />
      )}

      <TouchableOpacity
        style={[
          styles.button,
          completed ? styles.buttonCompleted : styles.buttonIncomplete,
        ]}
        onPress={markComplete}
        disabled={completed}
      >
        <Ionicons
          name={completed ? 'checkmark-circle' : 'checkbox-outline'}
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>
          {completed ? 'Completed' : 'Mark as Completed'}
        </Text>
      </TouchableOpacity>

      <View style={styles.navigation}>
        {prevLesson && (
          <TouchableOpacity
            onPress={() =>
              navigation.replace('Lesson', {
                courseId,
                lessonId: prevLesson.id,
              })
            }
            style={styles.navButton}
          >
            <Ionicons name="arrow-back" size={20} color="#2e7d32" />
            <Text style={styles.navText}>Previous</Text>
          </TouchableOpacity>
        )}
        {nextLesson && (
          <TouchableOpacity
            onPress={() =>
              navigation.replace('Lesson', {
                courseId,
                lessonId: nextLesson.id,
              })
            }
            style={styles.navButton}
          >
            <Text style={styles.navText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#2e7d32" />
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default LessonScreen;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  langToggle: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  langToggleText: {
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2e7d32',
    flex: 1,
    paddingRight: 8,
  },
  textContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  video: {
    width: width - 32,
    height: (width - 32) * (9 / 16),
    backgroundColor: '#000',
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonCompleted: { backgroundColor: '#4caf50' },
  buttonIncomplete: { backgroundColor: '#2e7d32' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navText: {
    color: '#2e7d32',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#D9534F',
  },
});
