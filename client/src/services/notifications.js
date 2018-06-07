import api from '../utils/api';

const notificationsService = {
  getNotifications(since) {
    const query = since ? `?since=${since}` : '';
    return api.get(`/notifications${query}`);
  },

  markAsRead(id) {
    return api.post(`/notifications/${id}`);
  }
};

export default notificationsService;
