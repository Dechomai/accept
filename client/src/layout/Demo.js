import React from 'react';

import Button from '../components/Button/Button';

const Demo = () => {
  return (
    <div>
      <Button>Primary Button</Button>
      <Button type="secondary">Secondary Button</Button>

      <Button size="small">Small Primary Button</Button>
      <Button type="secondary" size="small">
        Small Secondary Button
      </Button>
    </div>
  );
};

export default Demo;
