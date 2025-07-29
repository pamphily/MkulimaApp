// Card.tsx
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Video from 'react-native-video';
import { Post } from '../dummy/store';
import { useNavigation } from '@react-navigation/native';

interface CardProps {
  post: Post;
}

export const Card: React.FC<CardProps> = ({ post }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PostDetails', { postId: post.id })}
    >
      <View style={styles.header}>
        <Image source={{ uri: post.avatarUri }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>@{post.username}</Text>
          <Text style={styles.datetime}>{post.createdAt}</Text>
        </View>
      </View>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content} numberOfLines={2}>
        {post.content}
      </Text>
     
        <Image source={{ uri: post.mediaUri }} style={styles.thumbnail} />
  
      
      <View style={styles.footer}>
        <Text style={styles.voteUp}>▲ {post.upvotes}</Text>
        <Text style={styles.voteDown}>▼ {post.downvotes}</Text>
        <Text style={styles.commentCount}>💬 {post.comments.length}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 14,
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  userInfo: { flex: 1 },
  username: { fontWeight: '600', fontSize: 14 },
  datetime: { fontSize: 12, color: '#666' },
  title: { fontSize: 16, fontWeight: '700', marginVertical: 4 },
  content: { fontSize: 14, color: '#444' },
  thumbnail: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
  },
  voteUp: { color: '#28a745', fontWeight: '600' },
  voteDown: { color: '#dc3545', fontWeight: '600' },
  commentCount: { color: '#007bff', fontWeight: '600' },
});
