import api from '../utils/api';

const serviceService = {
  createService(service, photos, primaryPhotoIndex) {
    return api.postForm('/services', {...service, photos, primaryPhotoIndex});
  },
  updateService(service, serviceId, primaryPhotoIndex) {
    return api.putForm(`/services/${serviceId}`, {...service, primaryPhotoIndex});
  },
  deleteService(serviceId) {
    return api.delete(`/services/${serviceId}`);
  },
  getServices({skip, limit}) {
    return api.get(`/services?skip=${skip}&limit=${limit}`);
  },
  getUserServices(userId, {skip, limit}) {
    return api.get(`/services?user=${userId}&skip=${skip}&limit=${limit}`);
  },
  getServiceById(serviceId) {
    return api.get(`/services/${serviceId}`);
  }
};

export default serviceService;
