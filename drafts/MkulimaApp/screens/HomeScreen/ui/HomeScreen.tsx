import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const NUM_COLUMNS = 2;
const SCREEN_WIDTH = Dimensions.get("window").width;
const HORIZONTAL_PADDING = 20;
const GAP = 16;
const CARD_WIDTH =
  (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;

type Product = {
  id: string;
  title: string;
  image: string;
  stock: number;
};

const HomeScreen = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    const demoData: Product[] = [
      {
        id: "1",
        title: "Farming Tools",
        image:
          "https://ik.imagekit.io/efarm/images/4c76e17e-2357-4168-a65b-1a5fa390fd49.jpg?tr=w-600,ar-1000-667,l-image,i-@@website-machine-images-watermarks@@watermark_DZDDMXPYs_M9F2mQxfH.png,lx-6,ly-6,w-90,l-end",
        stock: 12,
      },
      {
        id: "2",
        title: "Fresh Bananas",
        image:
          "https://images.unsplash.com/photo-1523667864248-fc55f5bad7e2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        stock: 0,
      },
      {
        id: "3",
        title: "Tomatoes",
        image: "../../../assets/image/tomato.png",
        stock: 5,
      },
      {
        id: "4",
        title: "Carrots",
        image: "../../../assets/image/carrot.png",
        stock: 20,
      },
    ];
    setTimeout(() => {
      setProducts(demoData);
      setLoading(false);
    }, 500);
  }, []);

  const renderProductCard = ({ item }: { item: Product }) => {
    const inStock = item.stock > 0;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate("Products");
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.cardContent}>
          <View>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.stockContainer}>
              <Ionicons
                name={inStock ? "checkmark-circle" : "close-circle"}
                size={16}
                color={inStock ? "#4caf50" : "#f44336"}
                style={{ marginRight: 4 }}
              />
              <Text style={styles.stockText}>
                {inStock ? `In stock: ${item.stock}` : "Out of stock"}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.cartButton, !inStock && styles.cartButtonDisabled]}
            disabled={!inStock}
            onPress={() => {
              console.log("Add to cart", item.id);
            }}
          >
            <Ionicons name="eye" size={18} color={inStock ? "#fff" : "#ccc"} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading || products === null) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProductCard}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: GAP,
          }}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <View style={styles.featureCard}>
                <View style={styles.featureCardContent}>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Free consultation</Text>
                    <Text style={styles.featureDescription}>
                      Get free support from our{"\n"}customer service chatbot
                      AI{"\n"}support about any inquiries
                    </Text>
                    <TouchableOpacity style={styles.chatButton}>
                      <Text style={styles.chatButtonText}>Chat Now</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={require("../../../assets/image/Picture4.png")}
                    style={styles.featureImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <Text style={styles.sectionTitle}>Featured Content</Text>
            </>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBF1",
  },
  featureCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featureCard: {
    overflow: "hidden",
    marginBottom: 24,
    elevation: 2,
  },
  featureImage: {
    width: "60%",
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
  },
  featureTextContainer: {
    flex: 1,
    zIndex: 10,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C6E49",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  chatButton: {
    backgroundColor: "#19551B",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  chatButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgba(0,0,0,0.87)",
    marginBottom: 16,
    marginTop: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: CARD_WIDTH * 0.75,
    backgroundColor: "#e0e0e0",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2C6E49",
    marginBottom: 4,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stockText: {
    fontSize: 10,
    color: "#555",
  },
  cartButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 100,
    paddingHorizontal: 14,
  },
  cartButtonDisabled: {
    backgroundColor: "#ccc",
  },
});

export default HomeScreen;
