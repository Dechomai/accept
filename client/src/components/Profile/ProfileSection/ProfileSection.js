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
  onBtnClick,
  editable,
  children
}) => {
  const isEmpty = !((Array.isArray(children) && children.length) || children);

  return (
    <div className={classNames('profile-section', className)}>
      {isEmpty ? (
        <div className="profile-section__empty">
          <img className="profile-section__image" src={imageUrl} />
          <small className="profile-section__placeholder text-muted">{placeholder}</small>
          {editable && (
            <Button
              outline
              className={classNames('profile-section__button', {
                'btn-with-icon': btnIcon
              })}
              disabled={!onBtnClick}
              onClick={onBtnClick}>
              {btnIcon && <Icon size="16" name={btnIcon} />}
              <span>{btnText}</span>
            </Button>
          )}
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
  onBtnClick: PropTypes.func,
  editable: PropTypes.bool
};

ProfileSection.defaultProps = {
  className: ''
};

export default ProfileSection;
