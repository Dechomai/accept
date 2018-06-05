import './AvatarUpload.scss';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FileUpload from '../FileUpload/FileUpload';
import Icon from '../Icon/Icon';

const AvatarUpload = ({className, avatar, onAccept, onReject, onSelect}) => (
  <FileUpload
    className={classNames('avatar-upload', avatar && 'avatar-upload--filled', className)}
    accept="image/jpeg,image/png,image/gif"
    maxSize={2.5 * 1024 * 1024} // ~2.5Mb
    imgUrl={typeof avatar === 'string' ? avatar : null} // do not pass File object, only url
    onAccept={onAccept}
    onReject={onReject}
    onSelect={onSelect}>
    <div className="avatar-upload__caption">
      <Icon name="camera" />
      <span>Upload photo</span>
    </div>
  </FileUpload>
);

AvatarUpload.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onAccept: PropTypes.func,
  onReject: PropTypes.func,
  onSelect: PropTypes.func
};

export default AvatarUpload;
