import {getImageThumbnail, getPrimaryImage} from '../img';

describe('Utils > img', () => {
  describe('getImageThumbnail', () => {
    it('should add cognito transformation options to url', () => {
      expect(getImageThumbnail('abc/image/upload/def')).toEqual(
        'abc/image/upload/w_200,h_200,c_fill/def'
      );
    });
    it('should create transformation string based on params', () => {
      expect(getImageThumbnail('abc/image/upload/def', {width: 100, height: 50})).toEqual(
        'abc/image/upload/w_100,h_50,c_fill/def'
      );
    });
    it('should remove image extension', () => {
      expect(getImageThumbnail('abc/image/upload/def.png')).toEqual(
        'abc/image/upload/w_200,h_200,c_fill/def'
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
      expect(getPrimaryImage(withoutPhoto)).toEqual(null);
    });
    it('should return uri of primary photo', () => {
      expect(getPrimaryImage(withPhoto)).toEqual('2');
    });
  });
});
