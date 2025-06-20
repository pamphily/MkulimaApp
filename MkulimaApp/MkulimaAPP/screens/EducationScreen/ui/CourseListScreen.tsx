// screens/EducationScreen/CourseListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { EducationStackParamList } from '../../../navigation/EducationNav';
import { useEducation } from '../../../context/EducationProvider';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text';
  contentUri?: string;
  contentText?: string;
  duration?: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  category: string;
  lessons: Lesson[];
  price: number;
}

const demoCourses: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to Sustainable Farming',
    description: 'Learn principles of sustainable agriculture to improve yield and protect environment.',
    imageUri: 'https://via.placeholder.com/300x200.png?text=Sustainable+Farming',
    category: 'Sustainability',
    lessons: [
      { id: 'l1', title: 'What is Sustainable Farming?', type: 'text', contentText: 'Sustainable farming is ...' },
      { id: 'l2', title: 'Soil Health', type: 'video', contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    price: 40900.99,
  },
  {
    id: 'c2',
    title: 'Crop Rotation Techniques',
    description: 'Understand crop rotation and its benefits.',
    imageUri: 'https://via.placeholder.com/300x200.png?text=Crop+Rotation',
    category: 'Crop Management',
    lessons: [
      { id: 'l1', title: 'Basics of Crop Rotation', type: 'text', contentText: 'Crop rotation means ...' },
      { id: 'l2', title: 'Planning Rotation Schedules', type: 'video', contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    price: 49.99,
  },
  {
    id: 'c3',
    title: 'Organic Pest Control',
    description: 'Natural methods to manage pests without harmful chemicals.',
    imageUri: 'https://via.placeholder.com/300x200.png?text=Organic+Pest+Control',
    category: 'Pest Management',
    lessons: [
      { id: 'l1', title: 'Common Pests and Identification', type: 'text', contentText: 'Pests include ...' },
      { id: 'l2', title: 'Natural Predators', type: 'video', contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    price: 49.99,
  },
  {
    id: 'c4',
    title: 'Soil Testing Basics',
    description: 'Learn how to test soil pH and nutrients for optimal yield.',
    imageUri: 'https://via.placeholder.com/300x200.png?text=Soil+Testing',
    category: 'Soil Management',
    lessons: [
      { id: 'l1', title: 'Why Test Soil?', type: 'text', contentText: 'Testing soil helps ...' },
      { id: 'l2', title: 'DIY Testing Methods', type: 'video', contentUri: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    ],
    price: 49.99,
  },
];

type CourseListNavigationProp = StackNavigationProp<EducationStackParamList, 'CourseList'>;

const ICON_MAP: Record<string, JSX.Element> = {
  'Sustainability': <MaterialCommunityIcons name="leaf" size={16} color="#2e7d32" />,
  'Crop Management': <MaterialCommunityIcons name="corn" size={16} color="#E69138" />,
  'Pest Management': <MaterialCommunityIcons name="bug" size={16} color="#D9534F" />,
  'Soil Management': <MaterialCommunityIcons name="soil" size={16} color="#8B4513" />,
};

const EducationScreen: React.FC = () => {
  const navigation = useNavigation<CourseListNavigationProp>();
  const { isEnrolled, completedLessons } = useEducation();

  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const categories = Array.from(new Set(demoCourses.map(c => c.category)));

  useEffect(() => {
    setTimeout(() => {
      setCourses(demoCourses);
      setFiltered(demoCourses);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let data = courses;
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      data = data.filter(
        c =>
          c.title.toLowerCase().includes(lower) ||
          c.description.toLowerCase().includes(lower)
      );
    }
    if (selectedCategory) {
      data = data.filter(c => c.category === selectedCategory);
    }
    setFiltered(data);
  }, [searchText, selectedCategory, courses]);

  const renderCourse = ({ item }: { item: Course }) => {
    const enrolled = isEnrolled(item.id);
    const completed = completedLessons(item.id).length;
    const total = item.lessons.length;
    const progress = enrolled ? completed / total : 0;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('CourseDetail', { courseId: item.id })
        }
      >
        <Image source={{ uri: item.imageUri }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.cardFooter}>
            {ICON_MAP[item.category] && (
              <View style={styles.categoryIconContainer}>
                {ICON_MAP[item.category]}
              </View>
            )}
            {enrolled ? (
              <View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${(progress * 100).toFixed(0)}%` },
                  ]}
                />
                <Text style={styles.progressText}>
                  {(progress * 100).toFixed(0)}%
                </Text>
              </View>
            ) : (
              <View style={styles.enrollBadge}>
                <Text style={styles.enrollBadgeText}>Free</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      extraScrollHeight={Platform.OS === 'ios' ? 80 : 100}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
      </View>

      {/* Categories Scrollable */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <Pressable
            onPress={() => setSelectedCategory(null)}
            style={({ pressed }) => [
              styles.categoryChip,
              selectedCategory === null && styles.categoryChipSelected,
              pressed && styles.categoryChipPressed,
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === null && styles.categoryTextSelected,
              ]}
            >
              All
            </Text>
          </Pressable>

          {categories.map(cat => (
            <Pressable
              key={cat}
              onPress={() =>
                setSelectedCategory(prev => (prev === cat ? null : cat))
              }
              style={({ pressed }) => [
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipSelected,
                pressed && styles.categoryChipPressed,
              ]}
            >
              <View style={styles.categoryContent}>
                {ICON_MAP[cat] || <Ionicons name="book" size={16} color="#555" />}
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === cat && styles.categoryTextSelected,
                    { marginLeft: 4 },
                  ]}
                >
                  {cat}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Course List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={renderCourse}
        contentContainerStyle={{ paddingBottom: 20 }}
        scrollEnabled={false}
      />
    </KeyboardAwareScrollView>
  );
};

export default EducationScreen;

const { width } = Dimensions.get('window');
const CARD_HEIGHT = 120;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FBF1' },
  contentContainer: { padding: 16, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f7e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 40,
  },
  searchInput: { flex: 1, fontSize: 14 },

  categoriesWrapper: { marginBottom: 16 },
  categoriesContainer: {
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 16,
    flexDirection: 'row',
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  categoryChipSelected: { borderColor: '#2e7d32' },
  categoryChipPressed: { opacity: 0.7 },
  categoryText: { fontSize: 13, color: '#333' },
  categoryTextSelected: { color: '#2e7d32', fontWeight: '600' },
  categoryContent: { flexDirection: 'row', alignItems: 'center' },

  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f1f7e9',
    borderRadius: 12,
    overflow: 'hidden',
    height: CARD_HEIGHT,
  },
  cardImage: { width: CARD_HEIGHT * (4 / 3), height: CARD_HEIGHT },
  cardContent: { flex: 1, padding: 10, justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  cardDesc: { fontSize: 13, color: '#666' },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryIconContainer: { marginRight: 8 },
  enrollBadge: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  enrollBadgeText: { color: '#fff', fontSize: 12 },
  progressContainer: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    height: 10,
    overflow: 'hidden',
  },
  progressBar: { height: 10, backgroundColor: '#2e7d32' },
  progressText: {
    position: 'absolute',
    top: -18,
    right: 0,
    fontSize: 10,
    color: '#333',
  },
});
