const forumModel = require('../models/forumModel');

// ===== POSTS =====

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await forumModel.getAllPosts();

    // Fetch and attach replies and like count for each post
    const postsWithRepliesAndLikes = await Promise.all(
      posts.map(async (post) => {
        const replies = await forumModel.getRepliesByPostId(post.id);
        const likes = await forumModel.getLikeCount(post.id);

        return {
          ...post,
          replies,
          likes, // Total like count
        };
      })
    );

    res.json(postsWithRepliesAndLikes);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user?.id;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  try {
    const newPost = await forumModel.createPost(userId, title, content);
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, content } = req.body;
  const userId = req.user?.id;

  try {
    const updated = await forumModel.updatePost(postId, userId, title, content);
    if (!updated) return res.status(404).json({ error: 'Post not found or unauthorized' });
    res.json(updated);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.id;

  try {
    await forumModel.deletePost(postId, userId);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};

// ===== REPLIES =====

exports.getReplies = async (req, res) => {
  const { postId } = req.params;
  try {
    const replies = await forumModel.getRepliesByPostId(postId);
    res.json(replies);
  } catch (err) {
    console.error('Error fetching replies:', err);
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
};

exports.addReply = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  if (!content) return res.status(400).json({ error: 'Reply content is required' });

  try {
    const newReply = await forumModel.addReply(postId, userId, content);
    res.status(201).json(newReply);
  } catch (err) {
    console.error('Error adding reply:', err);
    res.status(500).json({ error: 'Failed to add reply' });
  }
};

// ===== LIKES =====

exports.toggleLike = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user?.id;

  try {
    const result = await forumModel.toggleLike(postId, userId);
    res.json(result);
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

exports.getLikeCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const count = await forumModel.getLikeCount(postId);
    res.json({ count });
  } catch (err) {
    console.error('Error getting like count:', err);
    res.status(500).json({ error: 'Failed to get like count' });
  }
};
