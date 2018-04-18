export const getProductPrimaryImage = ({photos, primaryPhotoId}) => {
  if (!photos.length || !primaryPhotoId) return null;
  return photos.find(p => p.id === primaryPhotoId).url;
};

export const getImageThumbnail = (img, {width = 200, height = 200, crop = 'fill'} = {}) => {
  const transformations = [`w_${width}`, `h_${height}`, `c_${crop}`].join(',');
  return img.replace('image/upload/', `image/upload/${transformations}/`);
};