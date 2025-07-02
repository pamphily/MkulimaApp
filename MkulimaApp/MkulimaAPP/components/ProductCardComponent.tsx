// components/ProductCard.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type ProductCardProps = {
  productName: string;
  description: string;
  price: number;
  imageUri?: string;
  tags?: string[];
  comments?: { id: string; username: string; text: string }[];
  onAddToCart?: () => void;
  onOrder?: () => void;
  onRefer?: () => void;
  onPostComment?: (commentText: string) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  productName,
  description,
  price,
  imageUri,
  tags = [],
  comments = [],
  onAddToCart,
  onOrder,
  onRefer,
  onPostComment,
}) => {
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  const toggleComments = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCommentsExpanded((prev) => !prev);
  };

  const handlePostComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    onPostComment?.(trimmed);
    setNewComment("");
  };

  const renderCommentItem = ({ item }: { item: { id: string; username: string; text: string } }) => (
    <View style={styles.commentItem}>
      <Text style={styles.commentUser}>{item.username}:</Text>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.cardContainer}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.thumbnail} resizeMode="cover" />
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.productName} numberOfLines={2}>
          {productName}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
        <Text style={styles.priceText}>TZS {price.toLocaleString()}</Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.iconButton} onPress={onAddToCart}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          <Text style={styles.iconLabel}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onOrder}>
          <MaterialCommunityIcons name="shopping" size={24} color="#333" />
          <Text style={styles.iconLabel}>Order</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onRefer}>
          <Ionicons name="share-social-outline" size={24} color="#333" />
          <Text style={styles.iconLabel}>Refer</Text>
        </TouchableOpacity>
      </View>

      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <FlatList
            data={tags}
            keyExtractor={(tag) => tag}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.tagChip}>
                <Text style={styles.tagText}>{item}</Text>
              </View>
            )}
          />
        </View>
      )}

      <TouchableOpacity onPress={toggleComments} style={styles.toggleCommentsButton}>
        <Text style={styles.toggleCommentsText}>
          {commentsExpanded ? "Hide Comments" : `Comments (${comments.length})`}
        </Text>
        <Ionicons
          name={commentsExpanded ? "chevron-up-outline" : "chevron-down-outline"}
          size={20}
          color="#333"
        />
      </TouchableOpacity>

      {commentsExpanded && (
        <View style={styles.commentsSection}>
          {comments.length > 0 ? (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={renderCommentItem}
              style={styles.commentsList}
            />
          ) : (
            <Text style={styles.noCommentsText}>No comments yet.</Text>
          )}

          <View style={styles.addCommentRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              placeholderTextColor="#666"
              value={newComment}
              onChangeText={setNewComment}
              returnKeyType="send"
              onSubmitEditing={handlePostComment}
            />
            <TouchableOpacity onPress={handlePostComment} style={styles.postCommentButton}>
              <Text style={styles.postCommentText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    backgroundColor: "#e0e0e0",
  },
  infoContainer: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#444",
    marginBottom: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e7d32",
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fafafa",
  },
  iconButton: {
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 12,
    color: "#333",
    marginTop: 2,
  },
  tagsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  tagChip: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#555",
  },
  toggleCommentsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  toggleCommentsText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  commentsSection: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: "#fafafa",
  },
  commentsList: {
    maxHeight: 150,
    marginBottom: 8,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  commentUser: {
    fontWeight: "600",
    marginRight: 4,
    color: "#333",
  },
  commentText: {
    flex: 1,
    color: "#333",
  },
  noCommentsText: {
    fontStyle: "italic",
    color: "#666",
    marginBottom: 8,
  },
  addCommentRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 8,
  },
  commentInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 18,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  postCommentButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#19551B",
    borderRadius: 18,
  },
  postCommentText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProductCard;
