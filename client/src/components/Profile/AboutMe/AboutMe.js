import './AboutMe.scss';

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';
import {Button} from 'reactstrap';
import classNames from 'classnames';
import {map, find, prop, compose} from 'ramda';

import Icon from '../../common/Icon/Icon';
import Text from '../../common/Text/Text';
import ProfileSection from '../ProfileSection/ProfileSection';
import ItemsPreview from '../ItemsPreview/ItemsPreview';

const MAX_SHORT_DESCRIPTION_LENGTH = 200;

class AboutMe extends React.Component {
  constructor(props) {
    super(props);
    const {description} = this.props.user;

    this.state = {description};

    autobind(this);
  }

  componentDidMount() {
    const {products} = this.props;
    if (!products || (products.loading && (!products.listValid || products.error))) {
      // TODO: Obtain user id if someone visits other user's profile page
      const scope = this.props.isCurrentUser ? 'user' : 'id';

      this.props.fetchProducts(scope, 0, 3);
    }
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
      const isDescriptionLong = description.length > MAX_SHORT_DESCRIPTION_LENGTH;
      return (
        <div className="about__description">
          <Text
            className="about__description__content"
            maxCharacters={!isFullDescriptionShown && MAX_SHORT_DESCRIPTION_LENGTH}>
            {description}
          </Text>
          {isDescriptionLong && (
            <Button
              size="sm"
              color="link"
              className="p-0 btn-with-icon about__description__more"
              onClick={this.handleToggleFullDescription}>
              <span>{isFullDescriptionShown ? 'Less' : 'More'}</span>
              <Icon name={isFullDescriptionShown ? 'menu-up' : 'menu-down'} size="20" />
            </Button>
          )}
          <Button
            size="sm"
            color="link"
            className="p-0 btn-with-icon about__description__edit"
            onClick={this.handleEditDescriptionClick}>
            <Icon name="pencil" size="20" />
            <span>Edit</span>
          </Button>
        </div>
      );
    }

    return null;
  }

  render() {
    let {products} = this.props;

    if (products && products.data && !products.loading) {
      products = map(
        product => ({
          title: product.title,
          price: product.price,
          type: 'product',
          currency: '£',
          imageUrl: compose(prop('uri'), find(photo => photo.primary), prop('photos'))(product)
        }),
        products.data
      );
    }

    const services = [];

    return (
      <div className="about">
        <ProfileSection
          imageUrl="/assets/img/about.png"
          placeholder="Write something about yourself..."
          btnText="Add description"
          onBtnClick={this.handleEditDescriptionClick}>
          {this.getDescription()}
        </ProfileSection>
        <ProfileSection
          imageUrl="/assets/img/product.png"
          placeholder="Here will be displayed your created listings"
          btnText="Create listing"
          btnIcon="plus"
          onBtnClick={this.props.onAddProductClick}>
          {products &&
            products.length > 0 && (
              <ItemsPreview
                title="Products"
                type="products"
                viewAllLink="/profile/products"
                newPlaceholder="Add listing"
                items={products}
              />
            )}
        </ProfileSection>
        <ProfileSection
          imageUrl="/assets/img/service.png"
          placeholder="Here will be displayed your services"
          btnText="Offer service"
          btnIcon="plus"
          onBtnClick={this.props.onAddServiceClick}>
          {services &&
            services.length > 0 && (
              <ItemsPreview
                title="Services"
                type="services"
                viewAllLink="/profile/services"
                newPlaceholder="Offer service"
                items={services}
              />
            )}
        </ProfileSection>
      </div>
    );
  }
}

AboutMe.propTypes = {
  isCurrentUser: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  products: PropTypes.object.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  onAddProductClick: PropTypes.func.isRequired,
  onAddServiceClick: PropTypes.func.isRequired
};

export default AboutMe;
