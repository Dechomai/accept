import './Header.scss';

import React from 'react';

const HeaderPlain = () => {
  return (
    <header className="header header__plain">
      <div className="header__logo">
        <span to="/" className="header__logo__link">
          <img className="header__logo__img" src="/assets/logo-dark.svg" alt="Accept" />
        </span>
      </div>
    </header>
  );
};

HeaderPlain.propTypes = {};

export default HeaderPlain;
