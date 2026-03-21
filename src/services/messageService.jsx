import api from './api';

const messageService = {
  getConversations: () => api.get('/messages/conversations'),
  getConversationMessages: (conversationId) => api.get(`/messages/${conversationId}`),
  sendMessage: (data) => api.post('/messages', data),
  deleteMessage: (id) => api.delete(`/messages/${id}`)
};

export default messageService;