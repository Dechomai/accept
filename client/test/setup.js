// add React v16 adapter to Enzyme
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

// also, here you can
// setup Jest
// add globals, etc.
