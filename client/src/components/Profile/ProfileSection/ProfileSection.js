import './ProfileSection.scss';

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';

class ProfileSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {className, imageUrl, placeholder, buttonContent, onClick, children} = this.props;
    const isEmpty = !((Array.isArray(children) && children.length) || children);
    return (
      <div className={classNames('profile-section', className)}>
        {isEmpty ? (
          <div className="profile-section__empty">
            <img className="profile-section__image" src={imageUrl} />
            <span className="profile-section__placeholder">{placeholder}</span>
            <button className="profile-section__button" onClick={onClick}>
              {buttonContent}
            </button>
          </div>
        ) : (
          <div className="profile-section__content">{children}</div>
        )}
      </div>
    );
  }
}

ProfileSection.propTypes = {
  className: PropTypes.string,
  imageUrl: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  buttonContent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  onClick: PropTypes.func.isRequired
};

ProfileSection.defaultProps = {
  className: ''
};

export default ProfileSection;
