import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  ToastAndroid,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderMenu from '../../../components/HeaderComponent';
import API_BASE from '../../../api/api';
import { getUserData } from '../../../services/UserService';

const ForumScreen = () => {
  const [posts, setPosts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [likeAnimations, setLikeAnimations] = useState({});

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 25000);
    return () => clearInterval(interval);
  }, []);

  const initAnimationForPost = (postId) => {
    if (!likeAnimations[postId]) {
      setLikeAnimations((prev) => ({
        ...prev,
        [postId]: new Animated.Value(1),
      }));
    }
  };

  const animateLike = (postId) => {
    const anim = likeAnimations[postId];
    if (!anim) return;
    Animated.sequence([
      Animated.timing(anim, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/forum/posts`);
      const data = await res.json();
      data.forEach(post => initAnimationForPost(post.id));
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      ToastAndroid.show('⚠️ Failed to load posts', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAddPost = async () => {
    if (!title || !content) {
      return ToastAndroid.show('⚠️ All fields are required', ToastAndroid.SHORT);
    }
    try {
      const { token } = await getUserData();
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`${API_BASE}/api/forum/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) throw new Error('Failed to create post');
      const newPost = await res.json();
      initAnimationForPost(newPost.id);
      setPosts((prev) => [newPost, ...prev]);
      setTitle('');
      setContent('');
      setModalVisible(false);
      ToastAndroid.show('✅ Post created!', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error creating post:', error);
      ToastAndroid.show('❌ Failed to create post', ToastAndroid.SHORT);
    }
  };

  const handleReplyChange = (postId, text) => {
    setReplyInputs((prev) => ({ ...prev, [postId]: text }));
  };

  const handleAddReply = async (postId) => {
    const replyText = replyInputs[postId];
    if (!replyText) return;
    try {
      const { token } = await getUserData();
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`${API_BASE}/api/forum/posts/${postId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: replyText }),
      });
      if (!res.ok) throw new Error('Failed to send reply');
      const newReply = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, replies: [...(post.replies || []), newReply] } : post
        )
      );
      setReplyInputs((prev) => ({ ...prev, [postId]: '' }));
      ToastAndroid.show('💬 Reply sent', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error sending reply:', error);
      ToastAndroid.show('❌ Failed to send reply', ToastAndroid.SHORT);
    }
  };

  const toggleReplies = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleLike = async (postId) => {
    try {
      const { token } = await getUserData();
      if (!token) throw new Error('Not authenticated');
      const res = await fetch(`${API_BASE}/api/forum/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to like post');
      const result = await res.json();
      animateLike(postId);
      ToastAndroid.show(result.liked ? '❤️ Liked' : '💔 Unliked', ToastAndroid.SHORT);
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const newLikesCount = result.likeCount ?? (result.liked ? (post.likes || 0) + 1 : (post.likes || 0) - 1);
            return { ...post, likes: newLikesCount, likedByUser: result.liked };
          }
          return post;
        })
      );
    } catch (error) {
      console.error('Error liking post:', error);
      ToastAndroid.show('❌ Failed to like post', ToastAndroid.SHORT);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Forum</Text>
          <HeaderMenu />
        </View>
        <ScrollView
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchPosts();
              }}
              colors={['#1BB582']}
            />
          }
        >
          {loading ? (
            <ActivityIndicator size="large" color="#19551B" />
          ) : (
            posts.map((post) => {
              const isLiked = post.likedByUser === undefined ? false : post.likedByUser;
              const animValue = likeAnimations[post.id] || new Animated.Value(1);
              return (
                <View key={post.id} style={styles.postCard}>
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <Text style={styles.postContent}>{post.content}</Text>
                  <Text style={styles.postMeta}>
                    By {post.user_name}
                    {post.user_title === 'Expert' && <Text style={{ color: '#1BB582' }}> • Expert</Text>} • {formatDate(post.created_at)}
                  </Text>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      onPress={() => handleLike(post.id)}
                      style={styles.iconBtn}
                      activeOpacity={0.7}
                    >
                      <Animated.View style={{ transform: [{ scale: animValue }] }}>
                        <Ionicons
                          name={isLiked ? 'heart' : 'heart-outline'}
                          size={22}
                          color={isLiked ? 'red' : '#19551B'}
                        />
                      </Animated.View>
                      <Text style={styles.iconLabel}>{post.likes || 0} Likes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleReplies(post.id)} style={styles.iconBtn}>
                      <Ionicons name="chatbubble-outline" size={22} color="#19551B" />
                      <Text style={styles.iconLabel}>
                        {expandedPostId === post.id ? 'Hide Replies' : `${post.replies?.length || 0} Replies`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {expandedPostId === post.id && (
                    <View style={styles.repliesSection}>
                      {post.replies?.map((reply) => (
                        <View key={reply.id} style={styles.replyBox}>
                          <Text style={styles.replyUser}>
                            {reply.user_name}
                            {reply.user_title === 'Expert' && <Text style={{ color: '#1BB582' }}> • Expert</Text>} • {formatDate(reply.created_at)}
                          </Text>
                          <Text style={styles.replyText}>{reply.content}</Text>
                        </View>
                      ))}
                      <View style={styles.replyInputSection}>
                        <TextInput
                          placeholder="Write a reply..."
                          style={styles.replyInput}
                          value={replyInputs[post.id] || ''}
                          onChangeText={(text) => handleReplyChange(post.id, text)}
                        />
                        <TouchableOpacity
                          style={styles.sendButton}
                          onPress={() => handleAddReply(post.id)}
                        >
                          <Ionicons name="send" size={20} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </ScrollView>
        <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
        <Modal visible={isModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Post</Text>
              <TextInput
                placeholder="Title"
                style={styles.modalInput}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                placeholder="Content"
                multiline
                style={styles.modalInputLarge}
                value={content}
                onChangeText={setContent}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#19551B' }]}
                  onPress={handleAddPost}
                >
                  <Text style={styles.modalButtonText}>Post</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#888' }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ForumScreen;


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FBF1' },
  wrapper: { flex: 1, position: 'relative' },
  container: { padding: 16, paddingBottom: 100 },
  header: {
    padding: 16,
    backgroundColor: '#F7FBF1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: { fontSize: 22, color: '#1BB582', fontWeight: 'bold' },
  postCard: {
    backgroundColor: '#f1f7e9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  postTitle: { fontSize: 18, fontWeight: 'bold', color: '#19551B' },
  postContent: { marginTop: 4, fontSize: 14, color: '#333' },
  postMeta: { fontSize: 12, color: '#555', marginTop: 6 },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-start',
    gap: 20,
  },
  iconBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconLabel: { fontSize: 13, color: '#19551B' },
  repliesSection: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  replyBox: { marginBottom: 8 },
  replyUser: { fontWeight: '600', color: '#19551B', fontSize: 13 },
  replyText: { color: '#444' },
  replyInputSection: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  replyInput: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#19551B',
    padding: 10,
    borderRadius: 6,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#19551B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19551B',
    marginBottom: 10,
  },
  modalInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalInputLarge: {
    height: 80,
    textAlignVertical: 'top',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
