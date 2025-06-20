import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderMenu from '../../../components/HeaderComponent';

const mockPosts = [
  {
    id: '1',
    title: 'How to prevent maize diseases?',
    content: 'Looking for ways to prevent common diseases in maize.',
    replies: [
      { id: 'r1', user: 'John', text: 'Use crop rotation and resistant varieties.' },
      { id: 'r2', user: 'Anna', text: 'Apply fungicides at early stages.' },
    ],
  },
  {
    id: '2',
    title: 'What is the best fertilizer for tomatoes?',
    content: 'Need advice on tomato fertilization.',
    replies: [{ id: 'r3', user: 'Paul', text: 'NPK 20-20-20 is great early on.' }],
  },
];

const ForumScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});

  const toggleReplies = (postId: string) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleReplyChange = (postId: string, text: string) => {
    setReplyInputs((prev) => ({ ...prev, [postId]: text }));
  };

  const handleAddReply = (postId: string) => {
    const replyText = replyInputs[postId];
    if (!replyText) return;
    // Here you'd send to API and update state
    alert(`Replied to post ${postId}: ${replyText}`);
    handleReplyChange(postId, '');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum</Text>
        <HeaderMenu />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.newPostButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.newPostButtonText}>+ New Post</Text>
        </TouchableOpacity>

        {mockPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>

            <TouchableOpacity onPress={() => toggleReplies(post.id)}>
              <Text style={styles.replyToggle}>
                {expandedPostId === post.id
                  ? 'Hide Replies'
                  : `${post.replies.length} ${post.replies.length === 1 ? 'Reply' : 'Replies'}`}
              </Text>
            </TouchableOpacity>

            {expandedPostId === post.id && (
              <View style={styles.repliesSection}>
                {post.replies.map((reply) => (
                  <View key={reply.id} style={styles.replyBox}>
                    <Text style={styles.replyUser}>{reply.user}:</Text>
                    <Text style={styles.replyText}>{reply.text}</Text>
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
        ))}
      </ScrollView>

      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Post</Text>
            <TextInput placeholder="Title" style={styles.modalInput} />
            <TextInput placeholder="Content" multiline style={styles.modalInputLarge} />
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ForumScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FBF1',
  },
  container: {
    padding: 16,
  },
  header: {
    padding: 16,
    backgroundColor: '#F7FBF1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    color: '#1BB582',
    fontWeight: 'bold',
  },
  newPostButton: {
    backgroundColor: '#19551B',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  newPostButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  postCard: {
    backgroundColor: '#f1f7e9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#19551B',
  },
  postContent: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
  replyToggle: {
    marginTop: 8,
    color: '#19551B',
    fontWeight: '600',
  },
  repliesSection: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  replyBox: {
    marginBottom: 8,
  },
  replyUser: {
    fontWeight: '600',
    color: '#19551B',
  },
  replyText: {
    color: '#444',
  },
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
  modalButton: {
    backgroundColor: '#19551B',
    padding: 10,
    borderRadius: 6,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
