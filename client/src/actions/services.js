import serviceService from '../services/service';
import {toast} from 'react-toastify';

export const CREATE_SERVICE_REQUEST = 'CREATE_SERVICE_REQUEST';
export const CREATE_SERVICE_SUCCESS = 'CREATE_SERVICE_SUCCESS';
export const CREATE_SERVICE_FAILURE = 'CREATE_SERVICE_FAILURE';

export const FETCH_SERVICES_REQUEST = 'FETCH_SERVICES_REQUEST';
export const FETCH_SERVICES_SUCCESS = 'FETCH_SERVICES_SUCCESS';
export const FETCH_SERVICES_FAILURE = 'FETCH_SERVICES_FAILURE';

export const UPDATE_SERVICE_REQUEST = 'UPDATE_SERVICE_REQUEST';
export const UPDATE_SERVICE_SUCCESS = 'UPDATE_SERVICE_SUCCESS';
export const UPDATE_SERVICE_FAILURE = 'UPDATE_SERVICE_FAILURE';

export const DELETE_SERVICE_REQUEST = 'DELETE_SERVICE_REQUEST';
export const DELETE_SERVICE_SUCCESS = 'DELETE_SERVICE_SUCCESS';
export const DELETE_SERVICE_FAILURE = 'DELETE_SERVICE_FAILURE';

export const FETCH_SERVICE_DETAILS_REQUEST = 'FETCH_SERVICE_DETAILS_REQUEST';
export const FETCH_SERVICE_DETAILS_SUCCESS = 'FETCH_SERVICE_DETAILS_SUCCESS';
export const FETCH_SERVICE_DETAILS_FAILURE = 'FETCH_SERVICE_DETAILS_FAILURE';

// CREATE

export const createServiceRequest = () => ({
  type: CREATE_SERVICE_REQUEST,
  payload: {}
});

export const createServiceSuccess = service => ({
  type: CREATE_SERVICE_SUCCESS,
  payload: {
    service
  }
});

export const createServiceFailure = error => ({
  type: CREATE_SERVICE_FAILURE,
  payload: {
    error
  }
});

export const createService = (service, files, primaryPhotoIndex) => dispatch => {
  dispatch(createServiceRequest());

  return serviceService
    .createService(service, files, primaryPhotoIndex)
    .then(
      data => dispatch(createServiceSuccess(data.service)),
      err => Promise.reject(dispatch(createServiceFailure(err)))
    );
};

// UPDATE

export const updateServiceRequest = serviceId => ({
  type: UPDATE_SERVICE_REQUEST,
  serviceId,
  payload: {}
});

export const updateServiceSuccess = (service, serviceId) => ({
  type: UPDATE_SERVICE_SUCCESS,
  serviceId,
  payload: {
    service
  }
});

export const updateServiceFailure = (error, serviceId) => ({
  type: UPDATE_SERVICE_FAILURE,
  serviceId,
  payload: {
    error
  }
});

export const updateService = (service, serviceId, primaryPhotoIndex) => dispatch => {
  dispatch(updateServiceRequest(serviceId));

  return serviceService
    .updateService(service, serviceId, primaryPhotoIndex)
    .then(
      data => dispatch(updateServiceSuccess(data.service, serviceId)),
      err => Promise.reject(dispatch(updateServiceFailure(err, serviceId)))
    );
};

// FETCH LIST
// scope = 'all' | 'user' | userId;

export const fetchServicesRequest = ({scope, skip, limit}) => ({
  type: FETCH_SERVICES_REQUEST,
  scope,
  skip,
  limit,
  payload: {}
});
export const fetchServicesSuccess = ({scope, skip, limit}, data, count) => ({
  type: FETCH_SERVICES_SUCCESS,
  scope,
  skip,
  limit,
  payload: {
    data,
    count
  }
});
export const fetchServicesFailure = ({scope, skip, limit}, error) => ({
  type: FETCH_SERVICES_FAILURE,
  scope,
  skip,
  limit,
  payload: {
    error
  }
});

export const fetchServices = ({scope, skip, limit}) => dispatch => {
  dispatch(fetchServicesRequest({scope, skip, limit}));

  let servicesPromise;

  switch (scope) {
    case 'all':
      servicesPromise = serviceService.getServices({skip, limit});
      break;
    case 'user':
      servicesPromise = serviceService.getUserServices('current', {skip, limit});
      break;
    default:
      servicesPromise = serviceService.getUserServices(scope, {skip, limit});
  }

  return servicesPromise.then(
    data => dispatch(fetchServicesSuccess({scope, skip, limit}, data.services, data.count)),
    err => Promise.reject(dispatch(fetchServicesFailure({scope, skip, limit}, err)))
  );
};

//Service by ID
export const fetchServiceByIdRequest = serviceId => ({
  type: FETCH_SERVICE_DETAILS_REQUEST,
  serviceId,
  payload: {}
});

export const fetchServiceByIdSuccess = (serviceId, service) => ({
  type: FETCH_SERVICE_DETAILS_SUCCESS,
  serviceId,
  payload: {
    service
  }
});

export const fetchServiceByIdFailure = (serviceId, error) => ({
  type: FETCH_SERVICE_DETAILS_FAILURE,
  serviceId,
  payload: {
    error
  }
});

export const fetchServiceById = serviceId => dispatch => {
  dispatch(fetchServiceByIdRequest(serviceId));

  return serviceService
    .getServiceById(serviceId)
    .then(
      data => dispatch(fetchServiceByIdSuccess(serviceId, data.service)),
      err => Promise.reject(dispatch(fetchServiceByIdFailure(serviceId, err)))
    );
};

// DELETE

export const deleteServiceRequest = () => ({
  type: DELETE_SERVICE_REQUEST,
  payload: {}
});

export const deleteServiceSuccess = () => ({
  type: DELETE_SERVICE_SUCCESS,
  payload: {}
});

export const deleteServiceFailure = error => ({
  type: DELETE_SERVICE_FAILURE,
  payload: {
    error
  }
});

export const deleteService = serviceId => dispatch => {
  dispatch(deleteServiceRequest());

  return serviceService.deleteService(serviceId).then(
    () => {
      toast.success('Service removed successfully');
      return dispatch(deleteServiceSuccess(serviceId));
    },
    err => Promise.reject(dispatch(deleteServiceFailure(err)))
  );
};
