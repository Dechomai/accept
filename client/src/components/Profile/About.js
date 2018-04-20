import './About.scss';

import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobindr';
import {Button} from 'reactstrap';
import classNames from 'classnames';

import Icon from '../common/Icon/Icon';
import Text from '../common/Text/Text';
import ProfileSection from './ProfileSection/ProfileSection';
import ItemsPreview from './ItemsPreview/ItemsPreview';

const PREVIEW_ITEMS_COUNT = 3;
const MAX_SHORT_DESCRIPTION_LENGTH = 200;

class About extends React.Component {
  constructor(props) {
    super(props);

    this.state = {description: ''};

    autobind(this);
  }

  componentWillReceiveProps(nextProps) {
    const {user} = nextProps;
    const description = !user || !user.data || user.loading ? '' : user.data.description;

    this.setState({description});
  }

  componentDidMount() {
    const {user, userId, products, isCurrentUser} = this.props;

    if (!user || (!user.data && !user.loading && !user.error)) {
      this.props.fetchUser(userId);
    }

    if (
      !products ||
      (!products.data && !products.loading && !products.error) ||
      (!products.loading && !products.listValid)
    ) {
      const scope = isCurrentUser ? 'user' : userId;

      this.props.fetchProducts({
        scope,
        skip: 0,
        limit: isCurrentUser ? PREVIEW_ITEMS_COUNT : PREVIEW_ITEMS_COUNT + 1
      });
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
    const {isCurrentUser} = this.props;
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
          {isCurrentUser && (
            <Button
              size="sm"
              color="link"
              className="p-0 btn-with-icon about__description__edit"
              onClick={this.handleEditDescriptionClick}>
              <Icon name="pencil" size="20" />
              <span>Edit</span>
            </Button>
          )}
        </div>
      );
    }

    return null;
  }

  getProducts() {
    const {router, products, isCurrentUser, userId} = this.props;
    const showProducts = products && products.data && products.data.length;
    if (!showProducts) return null;
    return (
      <ItemsPreview
        title="Products"
        type="products"
        viewAllLink={isCurrentUser ? '/profile/products' : `/users/${userId}/products`}
        newPlaceholder="Add listing"
        items={products.data}
        editable={isCurrentUser}
        onEditClick={(e, productId) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/products/edit/${productId}`);
        }}
      />
    );
  }

  getServices() {
    const {services, isCurrentUser, userId} = this.props;
    const showServices = services && services.data && services.data.length;
    if (!showServices) return null;
    return (
      <ItemsPreview
        title="Sroducts"
        type="services"
        viewAllLink={isCurrentUser ? '/profile/services' : `/users/${userId}/services`}
        newPlaceholder="Offer service"
        items={services.data}
        editable={isCurrentUser}
      />
    );
  }

  render() {
    const {isCurrentUser, onAddProductClick, onAddServiceClick} = this.props;
    return (
      <div className="about">
        <ProfileSection
          imageUrl="/assets/img/about.png"
          placeholder={
            isCurrentUser
              ? 'Write something about yourself...'
              : 'User has not provided any information yet'
          }
          btnText="Add description"
          onBtnClick={this.handleEditDescriptionClick}
          editable={isCurrentUser}>
          {this.getDescription()}
        </ProfileSection>
        <ProfileSection
          imageUrl="/assets/img/product.png"
          placeholder={
            isCurrentUser ? 'Here will be displayed your created listings' : 'No listings yet'
          }
          btnText="Create listing"
          btnIcon="plus"
          onBtnClick={onAddProductClick}
          editable={isCurrentUser}>
          {this.getProducts()}
        </ProfileSection>
        <ProfileSection
          imageUrl="/assets/img/service.png"
          placeholder={isCurrentUser ? 'Here will be displayed your services' : 'No services yet'}
          btnText="Offer service"
          btnIcon="plus"
          onBtnClick={onAddServiceClick}
          editable={isCurrentUser}>
          {this.getServices()}
        </ProfileSection>
      </div>
    );
  }
}

About.propTypes = {
  isCurrentUser: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  user: PropTypes.object,
  products: PropTypes.any,
  services: PropTypes.any,
  fetchUser: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  onAddProductClick: PropTypes.func.isRequired,
  onAddServiceClick: PropTypes.func.isRequired
};

export default About;
