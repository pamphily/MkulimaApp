const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const authMiddleware = require('../middleware/authenticate');

// ===== Forum Posts =====
router.get('/posts', forumController.getAllPosts);
router.post('/posts', authMiddleware, forumController.createPost);
router.put('/posts/:postId', authMiddleware, forumController.updatePost);
router.delete('/posts/:postId', authMiddleware, forumController.deletePost);

// ===== Replies =====
router.get('/posts/:postId/replies', forumController.getReplies);
router.post('/posts/:postId/replies', authMiddleware, forumController.addReply);

// ===== Likes =====
router.post('/posts/:postId/like', authMiddleware, forumController.toggleLike);
router.get('/posts/:postId/likes', forumController.getLikeCount);

module.exports = router;
