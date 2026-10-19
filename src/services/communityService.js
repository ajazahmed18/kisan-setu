import api from './api.js';

export const communityService = {
  async getPosts(params = {}) {
    const res = await api.get('/community/posts', { params });
    return res.data;
  },

  async getPostById(id) {
    const res = await api.get(`/community/posts/${id}`);
    return res.data;
  },

  async createPost(postData) {
    const res = await api.post('/community/posts', postData);
    return res.data;
  },

  async toggleLikePost(id, userId) {
    const res = await api.put(`/community/posts/${id}/like`, { userId });
    return res.data;
  },

  async addComment(id, commentData) {
    const res = await api.post(`/community/posts/${id}/comments`, commentData);
    return res.data;
  },

  async markCommentSolution(postId, commentId) {
    const res = await api.put(`/community/posts/${postId}/comments/${commentId}/solution`);
    return res.data;
  },

  async toggleSavePost(id, userId) {
    const res = await api.put(`/community/posts/${id}/save`, { userId });
    return res.data;
  },

  async getFieldClips() {
    const res = await api.get('/community/clips');
    return res.data;
  },

  async getMessages(params = {}) {
    const res = await api.get('/community/messages', { params });
    return res.data;
  },

  async sendMessage(msgData) {
    const res = await api.post('/community/messages', msgData);
    return res.data;
  },

  async getNotifications(userId) {
    const res = await api.get('/community/notifications', { params: { userId } });
    return res.data;
  },

  async markNotificationRead(id) {
    const res = await api.put(`/community/notifications/${id}/read`);
    return res.data;
  },

  async markAllNotificationsRead(userId) {
    const res = await api.put('/community/notifications/read-all', { userId });
    return res.data;
  },

  async createReport(reportData) {
    const res = await api.post('/community/reports', reportData);
    return res.data;
  },
};

export default communityService;
