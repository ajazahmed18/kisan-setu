import CommunityPost from '../models/CommunityPost.js';
import CommunityMessage from '../models/CommunityMessage.js';
import Notification from '../models/Notification.js';
import Report from '../models/Report.js';
import { isDbConnected } from '../config/db.js';
import { store } from '../store.js';

export async function getPosts(req, res) {
  try {
    const { crop, postType, search, tag } = req.query;

    if (isDbConnected()) {
      try {
        const filter = {};
        if (crop && crop !== 'All') filter.cropTag = new RegExp(crop, 'i');
        if (tag && tag !== 'All') filter.cropTag = new RegExp(tag, 'i');
        if (postType && postType !== 'All') filter.postType = postType;
        if (search) {
          filter.$or = [
            { title: new RegExp(search, 'i') },
            { content: new RegExp(search, 'i') },
            { cropTag: new RegExp(search, 'i') },
            { authorName: new RegExp(search, 'i') },
          ];
        }

        const posts = await CommunityPost.find(filter).sort({ isPinned: -1, createdAt: -1 });
        return res.json(posts);
      } catch (e) {
        // Fallback
      }
    }

    let list = [...store.communityPosts];
    const cropFilter = crop || tag;
    if (cropFilter && cropFilter !== 'All') {
      list = list.filter((p) => p.cropTag?.toLowerCase().includes(cropFilter.toLowerCase()));
    }
    if (postType && postType !== 'All') {
      list = list.filter((p) => p.postType === postType);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q) ||
          p.cropTag?.toLowerCase().includes(q) ||
          p.authorName?.toLowerCase().includes(q)
      );
    }

    res.json(list);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ error: 'Failed to fetch community posts' });
  }
}

export async function getPostById(req, res) {
  try {
    if (isDbConnected()) {
      try {
        const post = await CommunityPost.findOne({ id: req.params.id });
        if (post) return res.json(post);
      } catch (e) {
        // Fallback
      }
    }

    const post = store.communityPosts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
}

export async function createPost(req, res) {
  try {
    const data = req.body;
    const postId = `post-${Date.now()}`;

    const newPost = {
      id: postId,
      authorId: data.authorId || req.user?.id || 'usr-farmer',
      authorName: data.authorName || req.user?.name || 'Farmer Member',
      authorAvatar: data.authorAvatar || req.user?.photoURL || '',
      authorLocation: data.authorLocation || req.user?.location || 'Telangana',
      authorRole: data.authorRole || req.user?.role || 'farmer',
      title: data.title || '',
      content: data.content,
      cropTag: data.cropTag || 'General Agriculture',
      postType: data.postType || 'discussion',
      isFieldClip: Boolean(data.isFieldClip),
      videoUrl: data.videoUrl || null,
      imageUrl: data.imageUrl || null,
      likesCount: 0,
      likedBy: [],
      savedBy: [],
      comments: [],
      verifiedSolutionCount: 0,
      createdAt: new Date().toISOString(),
    };

    store.communityPosts.unshift(newPost);

    if (isDbConnected()) {
      try {
        await new CommunityPost(newPost).save();
      } catch (err) {
        console.warn('MongoDB save post notice:', err.message);
      }
    }

    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: error.message || 'Failed to create post' });
  }
}

export async function toggleLikePost(req, res) {
  try {
    const post = store.communityPosts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.body.userId || req.user?.id || 'user-anon';
    if (!post.likedBy) post.likedBy = [];
    const index = post.likedBy.indexOf(userId);

    if (index >= 0) {
      post.likedBy.splice(index, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      post.likedBy.push(userId);
      post.likesCount += 1;
    }

    if (isDbConnected()) {
      try {
        await CommunityPost.updateOne({ id: req.params.id }, { $set: { likedBy: post.likedBy, likesCount: post.likesCount } });
      } catch (e) {
        // non-blocking
      }
    }

    res.json({ success: true, likesCount: post.likesCount, isLiked: index === -1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like post' });
  }
}

export async function addComment(req, res) {
  try {
    const post = store.communityPosts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const newComment = {
      id: `c-${Date.now()}`,
      authorId: req.body.authorId || req.user?.id || 'usr-farmer',
      authorName: req.body.authorName || req.user?.name || 'Farmer Member',
      authorAvatar: req.body.authorAvatar || req.user?.photoURL || '',
      authorRole: req.body.authorRole || req.user?.role || 'farmer',
      text: req.body.text,
      createdAt: new Date().toISOString(),
      isVerifiedAnswer: false,
    };

    if (!post.comments) post.comments = [];
    post.comments.push(newComment);

    if (isDbConnected()) {
      try {
        await CommunityPost.updateOne({ id: req.params.id }, { $push: { comments: newComment } });
      } catch (e) {
        // non-blocking
      }
    }

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
}

export async function markCommentSolution(req, res) {
  try {
    const { postId, commentId } = req.params;
    const post = store.communityPosts.find((p) => p.id === postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = post.comments?.find((c) => c.id === commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    comment.isVerifiedAnswer = !comment.isVerifiedAnswer;
    post.verifiedSolutionCount = post.comments.filter((c) => c.isVerifiedAnswer).length;

    if (isDbConnected()) {
      try {
        await CommunityPost.updateOne({ id: postId }, { $set: { comments: post.comments, verifiedSolutionCount: post.verifiedSolutionCount } });
      } catch (e) {
        // non-blocking
      }
    }

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark solution' });
  }
}

export async function toggleSavePost(req, res) {
  try {
    const post = store.communityPosts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.body.userId || req.user?.id || 'usr-current';
    if (!post.savedBy) post.savedBy = [];
    const index = post.savedBy.indexOf(userId);

    if (index >= 0) {
      post.savedBy.splice(index, 1);
    } else {
      post.savedBy.push(userId);
    }

    if (isDbConnected()) {
      try {
        await CommunityPost.updateOne({ id: req.params.id }, { $set: { savedBy: post.savedBy } });
      } catch (e) {
        // non-blocking
      }
    }

    res.json({ success: true, isSaved: index === -1 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save post' });
  }
}

export async function getFieldClips(req, res) {
  try {
    const clips = store.communityPosts.filter(
      (p) => p.isFieldClip || p.postType === 'field_clip' || p.videoUrl
    );
    res.json(clips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch field clips' });
  }
}

// Direct Messages
export async function getMessages(req, res) {
  try {
    const { currentUserId, partnerId } = req.query;
    const uid = currentUserId || req.user?.id || 'usr-farmer-ramesh';

    if (partnerId) {
      const messages = store.communityMessages.filter(
        (m) =>
          (m.senderId === uid && m.recipientId === partnerId) ||
          (m.senderId === partnerId && m.recipientId === uid)
      );
      return res.json(messages);
    }

    const partnersMap = new Map();
    store.communityMessages.forEach((m) => {
      const isSender = m.senderId === uid;
      const partnerIdVal = isSender ? m.recipientId : m.senderId;

      if (!partnersMap.has(partnerIdVal)) {
        partnersMap.set(partnerIdVal, {
          partnerId: partnerIdVal,
          partnerName: isSender ? m.recipientName : m.senderName,
          partnerAvatar: isSender ? '' : m.senderAvatar,
          lastMessage: m.text || 'Shared update',
          lastMessageTime: m.createdAt,
          unreadCount: !isSender && !m.isRead ? 1 : 0,
        });
      }
    });

    res.json(Array.from(partnersMap.values()));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

export async function sendMessage(req, res) {
  try {
    const data = req.body;
    const msgId = `msg-${Date.now()}`;

    const newMsg = {
      id: msgId,
      senderId: data.senderId || req.user?.id || 'usr-farmer',
      senderName: data.senderName || req.user?.name || 'Farmer Member',
      senderAvatar: data.senderAvatar || req.user?.photoURL || '',
      recipientId: data.recipientId,
      recipientName: data.recipientName || 'Fellow Member',
      text: data.text || '',
      photoUrl: data.photoUrl || null,
      cropProblemTag: data.cropProblemTag || null,
      sharedPost: data.sharedPost || null,
      isRead: false,
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    store.communityMessages.push(newMsg);

    if (isDbConnected()) {
      try {
        await new CommunityMessage(newMsg).save();
      } catch (e) {
        // non-blocking
      }
    }

    res.status(201).json(newMsg);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to send message' });
  }
}

// Notifications
export async function getNotifications(req, res) {
  try {
    const userId = req.query.userId || req.user?.id;
    const list = userId
      ? store.notifications.filter((n) => n.userId === userId)
      : store.notifications;
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}

export async function markNotificationRead(req, res) {
  try {
    const notif = store.notifications.find((n) => n.id === req.params.id);
    if (notif) notif.isRead = true;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
}

export async function markAllNotificationsRead(req, res) {
  try {
    store.notifications.forEach((n) => (n.isRead = true));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
}

// Reports
export async function createReport(req, res) {
  try {
    const data = req.body;
    const reportId = `rep-${Date.now()}`;

    const newReport = {
      id: reportId,
      reporterId: data.reporterId || req.user?.id || 'usr-farmer',
      reporterName: data.reporterName || req.user?.name || 'Farmer Member',
      targetType: data.targetType || 'post',
      targetId: data.targetId,
      targetTitleOrSnippet: data.targetTitleOrSnippet || '',
      reason: data.reason || 'Misleading farming information',
      details: data.details || '',
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    };

    store.reports.push(newReport);
    res.status(201).json({ success: true, message: 'Report submitted to moderators', report: newReport });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to submit report' });
  }
}
