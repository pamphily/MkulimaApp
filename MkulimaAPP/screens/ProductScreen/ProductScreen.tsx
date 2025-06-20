// screens/AgriculturalProductsScreen.tsx
import React, { useState, useCallback, useRef } from "react";
import { View, SafeAreaView, FlatList, ActivityIndicator, Dimensions, Text, Alert } from "react-native";
import ProductCard from "../../components/ProductCardComponent"; 
import BottomSheet, { BottomSheetRefProps } from '../../components/BottomSheetComponent';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OrderModalScreen from "../OrderScreen/OrderModalScreen";
import { useCart } from "../../context/CartProvider";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50; // same logic as BottomSheetComponent

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
    description: "High-yield hybrid tomato seeds. Perfect for home gardens and small farms.",
    price: 5.99,
    imageUri: "https://pictures-tanzania.jijistatic.com/7299905_MzAwLTMwMC04ZDcwN2ZmYzNj.webp",
    tags: ["Seeds", "Vegetables"],
    comments: [
      { id: "c1", username: "FarmerJoe", text: "Germinated well in my greenhouse." },
      { id: "c2", username: "GardenGal", text: "Tasty tomatoes, recommended!" },
    ],
  },
  {
    id: "p2",
    productName: "Mini Power Tallor Petrol",
    description: "Natural compost-based fertilizer to improve soil health and boost yields.",
    price: 12.5,
    imageUri: "https://pictures-tanzania.jijistatic.com/6335417_MzAwLTY2Ny04OGUyMzAwYzNl.webp",
    tags: ["Fertilizer", "Organic"],
    comments: [
      { id: "c3", username: "EcoGrower", text: "Made a big difference in my soil." },
    ],
  },
  {
    id: "p3",
    productName: "Irrigation Pump",
    description: "Portable electric irrigation pump for small fields and greenhouses.",
    price: 149.99,
    imageUri: "https://pictures-tanzania.jijistatic.com/3208498_MzAwLTY2Ny1hOTE2MDQwNDA2.webp",
    tags: ["Equipment", "Watering"],
    comments: [
      { id: "c4", username: "IrrigatePro", text: "Good flow rate, durable build." },
    ],
  },
  {
    id: "p4",
    productName: "Corn Seeds",
    description: "Drought-tolerant corn hybrid seeds with high germination rate.",
    price: 7.25,
    imageUri: "https://ik.imagekit.io/efarm/images/237f09c6-7b89-40ba-8a2a-982dd68ae148.jpg?tr=w-600,ar-1000-667,l-image,i-@@website-machine-images-watermarks@@watermark_DZDDMXPYs_M9F2mQxfH.png,lx-6,ly-6,w-90,l-end",
    tags: ["Seeds", "Grains"],
    comments: [],
  },
  {
    id: "p5",
    productName: "Handheld Sprayer",
    description: "Lightweight sprayer for pesticides, herbicides, and foliar feeding.",
    price: 24.99,
    imageUri: "https://ik.imagekit.io/efarm/images/4c76e17e-2357-4168-a65b-1a5fa390fd49.jpg?tr=w-600,ar-1000-667,l-image,i-@@website-machine-images-watermarks@@watermark_DZDDMXPYs_M9F2mQxfH.png,lx-6,ly-6,w-90,l-end",
    tags: ["Tools", "Sprayer"],
    comments: [
      { id: "c5", username: "GrowMaster", text: "Easy to use, strong pump." },
    ],
  },
  {
    id: "p6",
    productName: "Potato Seed Tubers",
    description: "Certified disease-free potato seed tubers for planting.",
    price: 15.0,
    imageUri: "https://via.placeholder.com/600x400.png?text=Potato+Seed+Tubers",
    tags: ["Seeds", "Vegetables"],
    comments: [],
  },
  // ...add more
];

const ProductScreen: React.FC = () => {
  const [products, setProducts] = useState<AgriProduct[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const bottomSheetRef = useRef<BottomSheetRefProps>(null);
  const [selectedProduct, setSelectedProduct] = useState<AgriProduct | null>(null);
  const { addToCart } = useCart(); // get addToCart


  // Simulation demo
  React.useEffect(() => {
    // In real app, replace with fetch/axios call to your backend
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
        Alert.alert("Added to Cart", `${prod.productName} has been added to your cart.`);
      }
    },
    [products, addToCart]
  );

  const handleOrder = useCallback((productId: string) => {
    const prod = products?.find((p) => p.id === productId) || null;
    if (prod) {
      setSelectedProduct(prod);
      // Open bottom sheet
      bottomSheetRef.current?.scrollTo(MAX_TRANSLATE_Y);
    }
  }, [products]);

  const handleRefer = useCallback((productId: string) => {
    console.log("Refer pressed for:", productId);

  }, []);

  const handlePostComment = useCallback((productId: string, commentText: string) => {
    console.log("Post comment for:", productId, commentText);
    // call backend to post comment, then refresh comments for that product
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

  // Render each product card
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
