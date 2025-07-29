import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { EducationStackParamList } from "../../../types/Education";

type Course = {
  id: number;
  fullname: string;
  shortname: string;
  summary: string;
  categoryid: number;
  image?: string | null;
};

const MOODLE_TOKEN = "207aff44288f676104b5d9eb7b0191fb";
const DOMAIN = "https://lms.dlab.or.tz";
const COURSE_ENDPOINT = `${DOMAIN}/webservice/rest/server.php?wstoken=${MOODLE_TOKEN}&wsfunction=core_course_get_courses&moodlewsrestformat=json`;
const CATEGORY_ENDPOINT = `${DOMAIN}/webservice/rest/server.php?wstoken=${MOODLE_TOKEN}&wsfunction=core_course_get_categories&moodlewsrestformat=json`;

type CourseListNavigationProp = StackNavigationProp<EducationStackParamList, 'CourseList'>;

const CourseList = () => {
    const navigation = useNavigation<CourseListNavigationProp>();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const fetchCourses = async () => {
    try {
      const [courseRes, categoryRes] = await Promise.all([
        fetch(COURSE_ENDPOINT),
        fetch(CATEGORY_ENDPOINT),
      ]);
      const coursesData = await courseRes.json();
      const categoriesData = await categoryRes.json();

      const filteredCourses: Course[] = coursesData
        .filter((course: any) => course.id !== 1)
        .map((course: any) => {
          const image = course.overviewfiles?.find((file: any) =>
            file.mimetype?.startsWith("image/")
          )?.fileurl;

          return {
            id: course.id,
            fullname: course.fullname,
            shortname: course.shortname,
            summary: course.summary,
            categoryid: course.categoryid,
            image: image ? `${image}&token=${MOODLE_TOKEN}` : null,
          };
        });

      setCourses(filteredCourses);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to load courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === null || course.categoryid === selectedCategory;
    const matchesSearch = course.fullname
      .toLowerCase()
      .includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderCourse = ({ item }: { item: Course }) => {
    return (
      <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}>
        <Image
          source={{
            uri: item.image || "https://via.placeholder.com/150x100.png?text=Course",
          }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.fullname}</Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {item.summary
              ? item.summary.replace(/<\/?[^>]+(>|$)/g, "")
              : "No summary available"}
          </Text>
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
    <View style={styles.container}>
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

      {/* Categories */}
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

          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() =>
                setSelectedCategory((prev) =>
                  prev === cat.id ? null : cat.id
                )
              }
              style={({ pressed }) => [
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipSelected,
                pressed && styles.categoryChipPressed,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextSelected,
                ]}
              >
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredCourses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default CourseList;

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 120;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FBF1", padding: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f7e9",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 40,
  },
  searchInput: { flex: 1, fontSize: 14 },

  categoriesWrapper: { marginBottom: 16 },
  categoriesContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 4,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: "transparent",
  },
  categoryChipSelected: {
    borderColor: "#2e7d32",
    backgroundColor: "#e2f1e9",
  },
  categoryChipPressed: { opacity: 0.7 },
  categoryText: { fontSize: 13, color: "#333" },
  categoryTextSelected: { color: "#2e7d32", fontWeight: "600" },

  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f1f7e9",
    borderRadius: 12,
    overflow: "hidden",
    height: CARD_HEIGHT,
  },
  cardImage: { width: CARD_HEIGHT * (4 / 3), height: CARD_HEIGHT },
  cardContent: { flex: 1, padding: 10, justifyContent: "space-between" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  cardDesc: { fontSize: 13, color: "#666" },
  list: { paddingBottom: 20 },
});
