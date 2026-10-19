import api from './api.js';

export const orderService = {
  async getOrders(params = {}) {
    const res = await api.get('/orders', { params });
    return res.data;
  },

  async getOrderById(id) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  async createOrder(orderData) {
    const res = await api.post('/orders', orderData);
    return res.data;
  },

  async updateOrder(id, orderData) {
    const res = await api.put(`/orders/${id}`, orderData);
    return res.data;
  },

  async getOffers(params = {}) {
    const res = await api.get('/offers', { params });
    return res.data;
  },

  async createOffer(offerData) {
    const res = await api.post('/offers', offerData);
    return res.data;
  },

  async updateOffer(id, updateData) {
    const res = await api.put(`/offers/${id}`, updateData);
    return res.data;
  },
};

export default orderService;
