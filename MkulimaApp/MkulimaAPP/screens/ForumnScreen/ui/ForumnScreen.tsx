// ForumScreen.tsx

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderMenu from '../../../components/HeaderComponent';
import API_BASE from '../../../api/api';
import { getUserId } from '../../../services/UserService';

const ForumScreen = () => {
  const [posts, setPosts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000); // Auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/forum/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      ToastAndroid.show('⚠️ Failed to load posts', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (!title || !content) {
      return ToastAndroid.show('⚠️ All fields are required', ToastAndroid.SHORT);
    }
    try {
      const userId = await getUserId();
      const res = await fetch(`${API_BASE}/api/forum/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, userId }),
      });
      const newPost = await res.json();
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
      const userId = await getUserId();
      const res = await fetch(`${API_BASE}/api/forum/posts/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyText, userId }),
      });
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
      const userId = await getUserId();
      const res = await fetch(`${API_BASE}/api/forum/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const result = await res.json();
      ToastAndroid.show(result.liked ? '❤️ Liked' : '💔 Unliked', ToastAndroid.SHORT);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: result.likeCount } : post
        )
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum</Text>
        <HeaderMenu />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#19551B" />
        ) : (
          posts.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postContent}>{post.content}</Text>
              <Text style={styles.postMeta}>
                By {post.user_name} • {formatDate(post.created_at)}
              </Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={() => handleLike(post.id)} style={styles.iconBtn}>
                  <Ionicons name="heart-outline" size={18} color="#19551B" />
                  <Text style={styles.iconLabel}>{post.likes || 0} Likes</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => toggleReplies(post.id)} style={styles.iconBtn}>
                  <Ionicons name="chatbubble-outline" size={18} color="#19551B" />
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
                        {reply.user_name} • {formatDate(reply.created_at)}
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
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setModalVisible(true)}
      >
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
    </SafeAreaView>
  );
};

export default ForumScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7FBF1' },
  container: { padding: 16, paddingBottom: 100 },
  header: {
    padding: 16,
    backgroundColor: '#F7FBF1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
