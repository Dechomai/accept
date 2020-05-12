export const getPrimaryImage = ({photos, primaryPhotoId}) => {
  if (!photos.length || !primaryPhotoId) return null;
  return photos.find(p => p.id === primaryPhotoId).url;
};

export const getOrderedPhotos = ({photos, primaryPhotoId}) => {
  if (!primaryPhotoId) {
    return photos;
  }
  const primaryPhoto = photos.find(photo => photo.id === primaryPhotoId);
  const orderedPhotos = photos.filter(photo => photo !== primaryPhoto);
  orderedPhotos.unshift(primaryPhoto);
  return orderedPhotos;
};

export const getImageThumbnail = (img, {width = 200, height = 200, crop = 'fill'} = {}) => {
  const transformations = [`w_${width}`, `h_${height}`, `c_${crop}`].join(',');
  // add transformations
  // remove extension
  const urlWithTransformations = img
    .replace('image/upload/', `image/upload/${transformations}/`)
    .replace(/\.\w+$/, '');
  // replace http with https on https page
  if (window.location.protocol === 'https:')
    return urlWithTransformations.replace('http://', 'https://');
  return urlWithTransformations;
};
