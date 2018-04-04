import './AboutMe.scss';

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';
import {Button} from 'reactstrap';

import Icon from '../../common/Icon/Icon';
import ProfileSection from '../ProfileSection/ProfileSection';

class AboutMe extends React.Component {
  constructor(props) {
    super(props);
    const {description} = this.props.user;

    this.state = {description};

    autobind(this);
  }

  handleEditDescriptionClick() {
    this.setState({isEditMode: true});
  }

  handleCancelEditDescriptionClick() {
    this.setState({isEditMode: false});
  }

  handleSaveDescriptionClick() {
    const {description} = this.state;
    const {updateProfile} = this.props;

    updateProfile({description});
    this.handleCancelEditDescriptionClick();
  }

  handleToggleFullDescription() {
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
        <div className="about__description--edit">
          <textarea
            ref={element => (this.descriptionInput = element)}
            className="about__description--editing"
            placeholder="Tell people a little about yourself"
            value={description || ''}
            onChange={this.handleDescriptionChange}
            rows="10"
          />
          <div className="about__description__actions">
            <Button color="light" size="sm" onClick={this.handleCancelEditDescriptionClick}>
              Cancel
            </Button>
            <Button color="primary" size="sm" onClick={this.handleSaveDescriptionClick}>
              Save
            </Button>
          </div>
        </div>
      );
    }

    if (description) {
      return (
        <div className="about__description">
          <div className="about__description__content">{description}</div>
          <div className="row">
            <Button
              size="sm"
              color="link"
              className="btn-with-icon about__description__more"
              onClick={this.handleToggleFullDescription}>
              <span>{isFullDescriptionShown ? 'Less' : 'More'}</span>
              <Icon name={isFullDescriptionShown ? 'menu-up' : 'menu-down'} size="12" />
            </Button>
            <Button
              size="sm"
              color="light"
              className="btn-with-icon about__description__edit"
              onClick={this.handleEditDescriptionClick}>
              <Icon name="pencil" size="12" />
              <span>Edit</span>
            </Button>
          </div>
        </div>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="about">
        <ProfileSection
          className="about__description"
          imageUrl="/assets/img/about.png"
          placeholder="Write something about yourself..."
          btnText="Add description"
          onClick={this.handleEditDescriptionClick}>
          {this.getDescription()}
        </ProfileSection>
        <ProfileSection
          className="about__listings"
          imageUrl="/assets/img/product.png"
          placeholder="Here will be displayed your created listings"
          btnText="Create listing"
          btnIcon="plus"
          onClick={() => {}}
        />
        <ProfileSection
          className="about__services"
          imageUrl="/assets/img/service.png"
          placeholder="Here will be displayed your services"
          btnText="Offer service"
          btnIcon="plus"
          onClick={() => {}}
        />
      </div>
    );
  }
}

AboutMe.propTypes = {
  user: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired
};

export default AboutMe;
