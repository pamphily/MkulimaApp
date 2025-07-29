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
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Make sure this matches your real token
const token = '207aff44288f676104b5d9eb7b0191fb';
const userId = 3; // replace with actual logged-in user ID
const roleId = 5; // typically 5 for student

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = width * 0.5;

interface RouteParams {
  CourseDetail: { courseId: number };
}

const CourseDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RouteParams, 'CourseDetail'>>();
  const { courseId } = route.params;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          wstoken: token,
          wsfunction: 'core_course_get_courses',
          moodlewsrestformat: 'json',
        });
        params.append('options[ids][0]', courseId.toString());

        const res = await fetch(
          `https://lms.dlab.or.tz/webservice/rest/server.php?${params.toString()}`
        );
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setCourse(data[0]);
          setEnrolled(false);
        } else {
          setCourse(null);
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to fetch course details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      const body = new URLSearchParams({
        wstoken: token,
        wsfunction: 'enrol_manual_enrol_users',
        moodlewsrestformat: 'json',
      });
      body.append('enrolments[0][roleid]', roleId.toString());
      body.append('enrolments[0][userid]', userId.toString());
      body.append('enrolments[0][courseid]', courseId.toString());

      const response = await fetch(
        'https://lms.dlab.or.tz/webservice/rest/server.php',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        }
      );

      const result = await response.json();
      if (Array.isArray(result) && result.length === 0) {
        Alert.alert('Success', 'Successfully enrolled in course.');
        setEnrolled(true);
      } else {
        Alert.alert('Error', JSON.stringify(result));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to enroll.');
    } finally {
      setEnrolling(false);
    }
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

  const now = Date.now() / 1000;
  const hasAutoEnd = course.courseformatoptions?.some(
    (opt: any) => opt.name === 'automaticenddate' && opt.value === 1
  );
  const start = course.startdate;
  const end = course.enddate;
  let expiryPercent = 0;
  if (hasAutoEnd && start && end && now > start) {
    const totalDuration = end - start;
    const elapsed = Math.min(now - start, totalDuration);
    expiryPercent = (elapsed / totalDuration) * 100;
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri:'https://lms.dlab.or.tz/webservice/pluginfile.php/107/course/summary/Gangster%20movies.jpeg'
        }}
        style={styles.headerImage}
      />

      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{course.fullname}</Text>
         
        </View>
        <Text style={styles.categoryText}> {course.shortname}</Text>
        <Text style={styles.description}>
          {course.summary.replace(/<[^>]+>/g, '')}
        </Text>
        {hasAutoEnd && (
          <View style={styles.expiryContainer}>
            <Text style={styles.expiryText}>Time to Expiry</Text>
            <View style={styles.expiryBarBg}>
              <View
                style={[styles.expiryBar, { width: `${expiryPercent}%` }]}
              />
            </View>
          </View>
        )}

        <View style={styles.groupContainer}>
          <Ionicons
            name={course.groupmode ? 'people' : 'people-outline'}
            size={20}
            color={course.groupmode ? '#2e7d32' : '#888'}
          />
          <Text style={styles.groupText}>
            {course.groupmode ? 'Group Mode Enabled' : 'No Groups'}
          </Text>
          {course.badges?.length > 0 && (
            <MaterialCommunityIcons
              name="badge-account-outline"
              size={24}
              color="#FFD700"
              style={styles.badgeIcon}
            />
          )}
          <View style={{ flexDirection: 'row', alignContent: 'center', paddingLeft: 20}}>
          <Ionicons
            name="globe-outline"
            size={20}
            color={course.groupmode ? '#2e7d32' : '#888'}
          />
          <Text style={styles.groupText}>{course.lang == "sw" ? "Swahili": "English"}</Text>

          </View>
    
         
        </View>

        <TouchableOpacity
          style={[styles.enrollButton, enrolled && styles.enrolledButton]}
          onPress={handleEnroll}
          disabled={enrolling || enrolled}
        >
          <Text style={styles.enrollButtonText}>
            {enrolled
              ? 'Enrolled'
              : enrolling
              ? 'Enrolling...'
              : 'Enroll Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CourseDetailScreen;

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
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#333', flex: 1 },
  badgeIcon: { marginLeft: 8 },
  categoryText: { fontSize: 14, color: '#666', marginVertical: 4 },
  description: { fontSize: 14, color: '#555', lineHeight: 20, marginBottom: 16 },
  expiryContainer: { marginBottom: 16 },
  expiryText: { fontSize: 12, color: '#888', marginBottom: 4 },
  expiryBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  expiryBar: { height: 8, backgroundColor: '#D9534F' },
  groupContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, },
  groupText: { marginLeft: 8, fontSize: 14, color: '#333' },
  enrollButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  enrolledButton: { backgroundColor: '#888' },
  enrollButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
