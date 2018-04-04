import './ProfileSection.scss';

import React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'reactstrap';
import classNames from 'classnames';

import Icon from '../../common/Icon/Icon';

const ProfileSection = ({
  className,
  imageUrl,
  placeholder,
  btnText,
  btnIcon,
  onClick,
  children
}) => {
  const isEmpty = !((Array.isArray(children) && children.length) || children);
  return (
    <div className={classNames('profile-section', className)}>
      {isEmpty ? (
        <div className="profile-section__empty">
          <img className="profile-section__image" src={imageUrl} />
          <small className="profile-section__placeholder text-muted">{placeholder}</small>
          <Button
            outline
            className={classNames('profile-section__button', {'btn-with-icon': btnIcon})}
            onClick={onClick}>
            {btnIcon && <Icon size="16" name={btnIcon} />}
            <span>{btnText}</span>
          </Button>
        </div>
      ) : (
        <div className="profile-section__content">{children}</div>
      )}
    </div>
  );
};

ProfileSection.propTypes = {
  className: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  btnIcon: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

ProfileSection.defaultProps = {
  className: ''
};

export default ProfileSection;
