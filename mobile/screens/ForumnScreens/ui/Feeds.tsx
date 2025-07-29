// ForumScreen.tsx
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Card } from '../component/Card';
import { demoPosts, Post, Comment } from '../dummy/store';

import PostDetails from './PostDetails';

const ForumScreen: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(demoPosts);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPost = posts.find((p) => p.id === selectedId) || null;

  const handleVotePost = (postId: string, type: 'up' | 'down') => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              upvotes: type === 'up' ? p.upvotes + 1 : p.upvotes,
              downvotes: type === 'down' ? p.downvotes + 1 : p.downvotes,
            }
          : p
      )
    );
  };

  const handleVoteComment = (commentId: string, type: 'up' | 'down') => {
    if (!selectedPost) return;
    const updatedComments = selectedPost.comments.map((c) =>
      c.id === commentId
        ? { ...c,
            upvotes: type === 'up' ? c.upvotes + 1 : c.upvotes,
            downvotes: type === 'down' ? c.downvotes + 1 : c.downvotes }
        : c
    );
    const updatedPost = { ...selectedPost, comments: updatedComments };
    setPosts((prev) =>
      prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    const newC: Comment = {
      id: `c${Date.now()}`,
      author: 'CurrentUser',
      content,
      upvotes: 0,
      downvotes: 0,
      createdAt: 'Just now',
    };
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments: [...p.comments, newC] }
          : p
      )
    );
  };

  if (selectedPost) {
    return (
      <PostDetails
        post={selectedPost}
        onBack={() => setSelectedId(null)}
        onVotePost={handleVotePost}
        onVoteComment={handleVoteComment}
        onAddComment={handleAddComment}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card post={item} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f7' },
  list: { paddingVertical: 12 },
});

export default ForumScreen;
