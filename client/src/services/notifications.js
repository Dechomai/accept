import api from '../utils/api';

const notificationsService = {
  getNotifications() {
    return api.get('/notifications');
  },

  markAsRead(id) {
    return api.post(`/notifications/${id}`);
  }
};

export default notificationsService;
