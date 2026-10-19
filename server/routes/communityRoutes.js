import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  toggleLikePost,
  addComment,
  markCommentSolution,
  toggleSavePost,
  getFieldClips,
  getMessages,
  sendMessage,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createReport,
} from '../controllers/communityController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/community/posts', getPosts);
router.get('/community/posts/:id', getPostById);
router.post('/community/posts', optionalAuth, createPost);
router.put('/community/posts/:id/like', toggleLikePost);
router.post('/community/posts/:id/comments', optionalAuth, addComment);
router.put('/community/posts/:postId/comments/:commentId/solution', markCommentSolution);
router.put('/community/posts/:id/save', toggleSavePost);
router.get('/community/clips', getFieldClips);

router.get('/community/messages', getMessages);
router.post('/community/messages', optionalAuth, sendMessage);

router.get('/community/notifications', getNotifications);
router.put('/community/notifications/:id/read', markNotificationRead);
router.put('/community/notifications/read-all', markAllNotificationsRead);

router.post('/community/reports', optionalAuth, createReport);

export default router;
