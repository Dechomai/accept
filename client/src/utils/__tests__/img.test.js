import {getImageThumbnail, getProductPrimaryImage} from '../img';

describe('Utils > img', () => {
  describe('getImageThumbnail', () => {
    it('should add cognito transformation options to url', () => {
      expect(
        getImageThumbnail(
          'http://res.cloudinary.com/abc/image/upload/v1523972389/products/63e1d447-eddf-47ca-974c-967b5007bf4b/69383a7b-abf1-490c-a615-dd04001e0d85.jpg'
        )
      ).toEqual(
        'http://res.cloudinary.com/abc/image/upload/w_200,h_200,c_fill/v1523972389/products/63e1d447-eddf-47ca-974c-967b5007bf4b/69383a7b-abf1-490c-a615-dd04001e0d85.jpg'
      );
    });
    it('should create transformation string based on params', () => {
      expect(getImageThumbnail('abc/image/upload/def', {width: 100, height: 50})).toEqual(
        'abc/image/upload/w_100,h_50,c_fill/def'
      );
    });
  });

  describe('getProductPrimaryImage', () => {
    const withPhoto = {
      photos: [{id: 1, url: '1'}, {id: 2, url: '2'}],
      primaryPhotoId: 2
    };
    const withoutPhoto = {
      photos: []
    };
    it('should return null if product does not contain photos', () => {
      expect(getProductPrimaryImage(withoutPhoto)).toEqual(null);
    });
    it('should return uri of primary photo', () => {
      expect(getProductPrimaryImage(withPhoto)).toEqual('2');
    });
  });
});
