const pool = require('../db'); // Assuming db.js exports your pool connection

// ===== POSTS =====

exports.getAllPosts = async () => {
  const res = await pool.query(`
    SELECT posts.*, users.name AS user_name
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
  `);
  return res.rows;
};

exports.getPostById = async (postId) => {
  const res = await pool.query(`
    SELECT posts.*, users.name AS user_name
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.id = $1
  `, [postId]);
  return res.rows[0];
};

exports.createPost = async (userId, title, content) => {
  const res = await pool.query(`
    INSERT INTO posts (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [userId, title, content]);
  return res.rows[0];
};

exports.updatePost = async (postId, userId, title, content) => {
  const res = await pool.query(`
    UPDATE posts
    SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $3 AND user_id = $4
    RETURNING *
  `, [title, content, postId, userId]);
  return res.rows[0];
};

exports.deletePost = async (postId, userId) => {
  await pool.query(`
    DELETE FROM posts WHERE id = $1 AND user_id = $2
  `, [postId, userId]);
};

// ===== REPLIES =====

exports.getRepliesByPostId = async (postId) => {
  const res = await pool.query(`
    SELECT replies.*, users.name AS user_name
    FROM replies
    JOIN users ON replies.user_id = users.id
    WHERE post_id = $1
    ORDER BY replies.created_at ASC
  `, [postId]);
  return res.rows;
};

exports.addReply = async (postId, userId, content) => {
  const res = await pool.query(`
    INSERT INTO replies (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [postId, userId, content]);
  return res.rows[0];
};

// ===== LIKES =====

exports.toggleLike = async (postId, userId) => {
  const exists = await pool.query(`
    SELECT * FROM likes WHERE post_id = $1 AND user_id = $2
  `, [postId, userId]);

  if (exists.rows.length > 0) {
    await pool.query(`DELETE FROM likes WHERE post_id = $1 AND user_id = $2`, [postId, userId]);
    return { liked: false };
  } else {
    await pool.query(`INSERT INTO likes (post_id, user_id) VALUES ($1, $2)`, [postId, userId]);
    return { liked: true };
  }
};

exports.getLikeCount = async (postId) => {
  const res = await pool.query(`SELECT COUNT(*) FROM likes WHERE post_id = $1`, [postId]);
  return parseInt(res.rows[0].count);
};
