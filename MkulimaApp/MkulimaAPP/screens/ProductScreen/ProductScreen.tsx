// screens/AgriculturalProductsScreen.tsx
import React, { useState, useCallback, useRef } from "react";
import { View, SafeAreaView, FlatList, ActivityIndicator, Dimensions, Text, Alert } from "react-native";
import ProductCard from "../../components/ProductCardComponent"; 
import BottomSheet, { BottomSheetRefProps } from '../../components/BottomSheetComponent';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OrderModalScreen from "../OrderScreen/OrderModalScreen";
import { useCart } from "../../context/CartProvider";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const formatTZS = (price: number) => `TZS ${price.toLocaleString('en-TZ')}`;

type AgriProduct = {
  id: string;
  productName: string;
  description: string;
  price: number;
  imageUri?: string;
  tags?: string[];
  comments?: { id: string; username: string; text: string }[];
};

const demoAgriProducts: AgriProduct[] = [
  {
    id: "p1",
    productName: "Corn Thresher Machine",
    description: "Powerful corn thresher machine suitable for medium to large farms.",
    price: 950000,
    imageUri: "https://pictures-tanzania.jijistatic.com/7299905_MzAwLTMwMC04ZDcwN2ZmYzNj.webp",
    tags: ["Equipment", "Machinery"],
    comments: [
      { id: "c1", username: "FarmerJoe", text: "Improved my yield by 3x." },
      { id: "c2", username: "JaneDoe", text: "Very efficient!" },
    ],
  },
  {
    id: "p2",
    productName: "Mini Power Tiller Petrol",
    description: "Portable petrol-powered tiller for garden and small farm use.",
    price: 450000,
    imageUri: "https://pictures-tanzania.jijistatic.com/6335417_MzAwLTY2Ny04OGUyMzAwYzNl.webp",
    tags: ["Tiller", "Machinery"],
    comments: [
      { id: "c3", username: "EcoGrower", text: "Compact and powerful." },
    ],
  },
  {
    id: "p3",
    productName: "Irrigation Pump",
    description: "Electric pump system for efficient irrigation.",
    price: 320000,
    imageUri: "https://pictures-tanzania.jijistatic.com/3208498_MzAwLTY2Ny1hOTE2MDQwNDA2.webp",
    tags: ["Irrigation", "Pump"],
    comments: [
      { id: "c4", username: "IrrigatePro", text: "Does the job perfectly." },
    ],
  },
  {
    id: "p4",
    productName: "Corn Seeds",
    description: "High-yield corn hybrid seeds for dry regions.",
    price: 18000,
    imageUri: "https://ik.imagekit.io/efarm/images/237f09c6-7b89-40ba-8a2a-982dd68ae148.jpg?tr=w-600,ar-1000-667",
    tags: ["Seeds", "Grains"],
    comments: [],
  },
  {
    id: "p5",
    productName: "Handheld Sprayer",
    description: "Manual sprayer for pesticides and foliar feeds.",
    price: 30000,
    imageUri: "https://ik.imagekit.io/efarm/images/4c76e17e-2357-4168-a65b-1a5fa390fd49.jpg?tr=w-600,ar-1000-667",
    tags: ["Tools", "Sprayer"],
    comments: [
      { id: "c5", username: "GrowMaster", text: "Very handy and easy to clean." },
    ],
  },
  {
    id: "p6",
    productName: "Potato Seed Tubers",
    description: "Certified seed tubers for quality potato harvest.",
    price: 25000,
    imageUri: "https://via.placeholder.com/600x400.png?text=Potato+Seed+Tubers",
    tags: ["Seeds", "Vegetables"],
    comments: [],
  },
  {
    id: "p7",
    productName: "Fresh Bananas",
    description: "Locally harvested, fresh and organic bananas.",
    price: 12000,
    imageUri: "https://images.unsplash.com/photo-1523667864248-fc55f5bad7e2?q=80&w=1170",
    tags: ["Fruits"],
    comments: [],
  },
  {
    id: "p8",
    productName: "Tomatoes",
    description: "Juicy and red ripe tomatoes directly from farm.",
    price: 8000,
    imageUri: "https://via.placeholder.com/600x400.png?text=Tomatoes",
    tags: ["Vegetables"],
    comments: [],
  }
];

const ProductScreen: React.FC = () => {
  const [products, setProducts] = useState<AgriProduct[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  const [selectedProduct, setSelectedProduct] = useState<AgriProduct | null>(null);
  const { addToCart } = useCart();

  React.useEffect(() => {
    setTimeout(() => {
      setProducts(demoAgriProducts);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddToCart = useCallback(
    (productId: string) => {
      const prod = products?.find((p) => p.id === productId);
      if (prod) {
        addToCart(prod, 1);
        Alert.alert("Added to Cart", `${prod.productName} added.`);
      }
    },
    [products, addToCart]
  );

  const handleOrder = useCallback((productId: string) => {
    const prod = products?.find((p) => p.id === productId) || null;
    if (prod) {
      setSelectedProduct(prod);
      bottomSheetRef.current?.scrollTo(MAX_TRANSLATE_Y);
    }
  }, [products]);

  const handleRefer = useCallback((productId: string) => {
    console.log("Refer pressed for:", productId);
  }, []);

  const handlePostComment = useCallback((productId: string, commentText: string) => {
    setProducts((prev) =>
      prev
        ? prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  comments: [
                    { id: Date.now().toString(), username: "You", text: commentText },
                    ...(p.comments || []),
                  ],
                }
              : p
          )
        : prev
    );
  }, []);

  const renderItem = ({ item }: { item: AgriProduct }) => (
    <ProductCard
      productName={item.productName}
      description={item.description}
      price={item.price}
      imageUri={item.imageUri}
      tags={item.tags}
      comments={item.comments}
      onAddToCart={() => handleAddToCart(item.id)}
      onOrder={() => handleOrder(item.id)}
      onRefer={() => handleRefer(item.id)}
      onPostComment={(text) => handlePostComment(item.id, text)}
    />
  );

  if (loading || products === null) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F7FBF1" }}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
        <BottomSheet ref={bottomSheetRef}>
          {selectedProduct ? (
            <OrderModalScreen
              product={selectedProduct}
              onClose={() => {
                bottomSheetRef.current?.scrollTo(0);
                setSelectedProduct(null);
              }}
            />
          ) : (
            <View style={{ padding: 16 }}>
              <Text>Select a product to order.</Text>
            </View>
          )}
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ProductScreen;
