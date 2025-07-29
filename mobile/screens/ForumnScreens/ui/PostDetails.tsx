// PostDetails.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Video from 'react-native-video';
import { Post, Comment, demoPosts } from '../dummy/store';
import { RouteProp, useRoute } from '@react-navigation/native';

interface Props {
  post: Post;
  onBack: () => void;
  onVotePost: (postId: string, type: 'up' | 'down') => void;
  onVoteComment: (commentId: string, type: 'up' | 'down') => void;
  onAddComment: (postId: string, content: string) => void;
}

type RouteParams = {
  Post: { postId: string };
};

const PostDetails: React.FC<Props> = ({
  onBack,
  onVotePost,
  onVoteComment,
  onAddComment,
}) => {
  const route = useRoute<RouteProp<RouteParams, 'Post'>>();
  const { postId } = route.params;
  const [commentText, setCommentText] = useState('');

  const [post, setPost] = useState<Post | undefined>();

  useEffect(() => {
    // Simulate fetching post by ID
    const foundPost = demoPosts.find(p => p.id === postId);
    setPost(foundPost);
  }, [postId]);

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading post...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.wrap}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.meta}>
          {post.author} • {post.createdAt}
        </Text>
        <Text style={styles.body}>{post.content}</Text>
        {post.mediaUri && post.mediaType === 'image' && (
          <Image source={{ uri: post.mediaUri }} style={styles.media} />
        )}
        {post.mediaUri && post.mediaType === 'video' && (
          <Video source={{ uri: post.mediaUri }} style={styles.media} controls />
        )}
        <View style={styles.voteRow}>
          <TouchableOpacity onPress={() => onVotePost(post.id, 'up')}>
            <Ionicons name='arrow-up' size={24} color='#4CAF50' />
          </TouchableOpacity>
          <Text style={styles.voteCount}>{post.upvotes}</Text>
          <TouchableOpacity onPress={() => onVotePost(post.id, 'down')}>
            <Ionicons name='arrow-down' size={24} color='#F44336' />
          </TouchableOpacity>
          <Text style={styles.voteCount}>{post.downvotes}</Text>
        </View>
        <Text style={styles.section}>Comments</Text>
        {post.comments.map((c) => (
          <View key={c.id} style={styles.comment}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentAuthor}>{c.author}</Text>
              <Text style={styles.commentTime}>{c.createdAt}</Text>
            </View>
            <Text style={styles.commentContent}>{c.content}</Text>
            <View style={styles.voteRowSmall}>
              <TouchableOpacity onPress={() => onVoteComment(c.id, 'up')}>
                <Ionicons name='arrow-up' size={18} color='#4CAF50'/>
              </TouchableOpacity>
              <Text style={styles.voteCount}>{c.upvotes}</Text>
              <TouchableOpacity onPress={() => onVoteComment(c.id, 'down')}>
                <Ionicons name='arrow-down' size={18} color='#F44336'/>
              </TouchableOpacity>
              <Text style={styles.voteCount}>{c.downvotes}</Text>
            </View>
          </View>
        ))}
        <TextInput
          style={styles.input}
          placeholder='Add a comment...'
          multiline
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity
          style={styles.commentBtn}
          onPress={() => {
            onAddComment(post.id, commentText.trim());
            setCommentText('');
          }}
        >
          <Text style={styles.commentBtnText}>Comment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const mediaHeight = width * 0.6;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  back: { padding: 12 },
  backText: { fontSize: 16, color: '#4CAF50' },
  wrap: { padding: 14 },
  title: { fontSize: 20, fontWeight: '700' },
  meta: { fontSize: 12, color: '#666', marginBottom: 6 },
  body: { fontSize: 16, color: '#333', marginVertical: 8 },
  media: {
    width: '100%',
    height: mediaHeight,
    borderRadius: 8,
    marginVertical: 8,
  },
  voteRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  voteCount: { marginHorizontal: 8, fontSize: 16, color: '#333' },
  section: { fontSize: 18, fontWeight: '600', marginVertical: 12 },
  comment: { marginBottom: 14, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  commentAuthor: { fontWeight: '600' },
  commentTime: { fontSize: 12, color: '#666' },
  commentContent: { fontSize: 14, color: '#333', marginVertical: 4 },
  voteRowSmall: { flexDirection: 'row', alignItems: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    height: 80,
    padding: 8,
    marginVertical: 12,
    textAlignVertical: 'top',
  },
  commentBtn: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  commentBtnText: { color: '#fff', fontWeight: '600' },
});
export default PostDetails;
