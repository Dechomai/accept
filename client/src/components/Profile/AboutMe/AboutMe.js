import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';

import Icon from '../../common/Icon/Icon';
import ProfileSection from '../ProfileSection/ProfileSection';

const LabelWithPlusSign = text => (
  <React.Fragment>
    <Icon
      name="plus"
      style={{
        position: 'absolute',
        left: '18px'
      }}
    />
    <span>{text}</span>
  </React.Fragment>
);

class AboutMe extends React.Component {
  constructor(props) {
    super(props);
    const {description} = this.props.user;

    this.state = {description};

    autobind(this);
  }

  editDescription() {
    this.setState({isEditMode: true});
  }

  cancelDescriptionEditing() {
    this.setState({isEditMode: false});
  }

  saveDescription() {
    const {description} = this.state;
    const {updateProfile} = this.props;

    updateProfile({description});
    this.cancelDescriptionEditing();
  }

  toggleFullDescription() {
    const {isFullDescriptionShown} = this.state;

    this.setState({isFullDescriptionShown: !isFullDescriptionShown});
  }

  handleDescriptionChange(event) {
    this.setState({description: event.target.value});
  }

  getDescription() {
    const {isEditMode, isFullDescriptionShown} = this.state;
    const {description} = this.state;

    if (isEditMode) {
      return (
        <React.Fragment>
          <textarea
            ref={element => (this.descriptionInput = element)}
            className="profile__description--editing"
            placeholder="Tell people a little about yourself"
            value={description || ''}
            onChange={this.handleDescriptionChange}
            rows="10"
          />
          <div className="profile__description__actions">
            <button className="btn btn-light" onClick={this.cancelDescriptionEditing}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={this.saveDescription}>
              Save
            </button>
          </div>
        </React.Fragment>
      );
    }

    if (description) {
      return (
        <div className="profile__description">
          <div className="profile__description__content">{description}</div>
          <button
            className="btn-with-icon profile__description__more"
            onClick={this.toggleFullDescription}>
            <span>More</span>
            <Icon name={isFullDescriptionShown ? 'menu-up' : 'menu-down'} size="20" />
          </button>
          <button
            className="btn-with-icon profile__description__edit"
            onClick={this.editDescription}>
            <Icon name="pencil" size="20" />
            <span>Edit</span>
          </button>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <React.Fragment>
        <ProfileSection
          className="profile__description"
          imageUrl="/assets/img/about.png"
          placeholder="Write something about yourself..."
          buttonContent="Add description"
          onClick={this.editDescription.bind(this)}>
          {this.getDescription()}
        </ProfileSection>
        <ProfileSection
          className="profile__listings"
          imageUrl="/assets/img/product.png"
          placeholder="Here will be displayed your created listings"
          buttonContent={LabelWithPlusSign('Create listing')}
          onClick={() => {}}
        />
        <ProfileSection
          className="profile__services"
          imageUrl="/assets/img/service.png"
          placeholder="Here will be displayed your services"
          buttonContent={LabelWithPlusSign('Offer service')}
          onClick={() => {}}
        />
      </React.Fragment>
    );
  }
}

AboutMe.propTypes = {
  user: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired
};

export default AboutMe;
