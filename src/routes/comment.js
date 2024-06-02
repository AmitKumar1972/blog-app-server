const express = require('express');
const validate = require('../middleware/validate');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const { commentSchema } = require('../validators/comment');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Add a comment to a blog
router.post('/:blogId', verifyToken, validate(commentSchema), async (req, res) => {
  const { text } = req.body;

  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog not found' });
    }

    const newComment = new Comment({
      text,
      user: req.user.id,
      blog: req.params.blogId,
    });

    const comment = await newComment.save();

    blog.comments.unshift(comment.id);
    await blog.save();

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a comment
router.delete('/:commentId', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await comment.remove();

    const blog = await Blog.findById(comment.blog);
    if (blog) {
      blog.comments = blog.comments.filter(
        (commentId) => commentId.toString() !== req.params.commentId
      );
      await blog.save();
    }

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
