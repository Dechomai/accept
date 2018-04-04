import './AboutMe.scss';

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';
import {Button} from 'reactstrap';
import classNames from 'classnames';

import Icon from '../../common/Icon/Icon';
import Text from '../../common/Text/Text';
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

    updateProfile({description}).then(
      () => this.setState({isEditMode: false}),
      reason => {
        const {errors} = reason.payload.error;

        if (errors && errors.description) {
          this.setState({isDescriptionInvalid: true});
        }
      }
    );
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
    const {description, isDescriptionInvalid} = this.state;

    if (isEditMode) {
      return (
        <div className="about__description--edit">
          <textarea
            className={classNames('about__description--editing', {
              'about__description--invalid': isDescriptionInvalid
            })}
            placeholder="Tell people a little about yourself"
            value={description || ''}
            onChange={this.handleDescriptionChange}
            rows="10"
          />
          {isDescriptionInvalid ? (
            <span className="about__description__error">
              The description cannot have more then 800 characters.
            </span>
          ) : null}
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
          <Text
            className="about__description__content"
            maxCharacters={isFullDescriptionShown ? null : 200}>
            {description}
          </Text>
          <div className="d-flex justify-content-between">
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
              color="link"
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
