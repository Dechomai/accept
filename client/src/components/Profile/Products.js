import './Products.scss';
import React from 'react';
import ItemTile from '../common/ItemTile/ItemTile';
import NewItemTile from '../common/ItemTile/NewItemTile';

const TILE_SIZE = 'col-6 col-sm-3';

class ProfileProduct extends React.Component {
  componentDidMount() {
    const {products} = this.props;
    if (!products || (products && !products.listValid)) {
      this.props.fetchProducts();
    }
  }

  renderProductsList() {
    const {products} = this.props;
    if (!products || products.loading) return <div className="loader" />;

    if (products.data) {
      return [
        <NewItemTile key="new" type="products" sizes={TILE_SIZE} placeholder="Add listing" />
      ].concat(
        products.data.map(product => (
          <ItemTile
            key={product.id}
            link={`/products/${product.id}`}
            sizes={TILE_SIZE}
            editable={true}
            photo={product.photos.length ? product.photos.find(p => p.primary).uri : null}
            price={product.price}
            title={product.title}
          />
        ))
      );
    }
  }

  render() {
    return (
      <div className="profile-products">
        <h6 className="profile-products__title">All products</h6>
        <div className="profile-products__content">
          <div className="row">{this.renderProductsList()}</div>
        </div>
      </div>
    );
  }
}

export default ProfileProduct;
