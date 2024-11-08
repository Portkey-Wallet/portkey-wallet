import Security from '.';
import AutoLock from './AutoLock';
import Beometic from '../AccountSettings/Biometric';

const stackNav = [
  {
    name: 'Security',
    component: Security,
  },
  {
    name: 'AutoLock',
    component: AutoLock,
  },
  {
    name: 'Beometic',
    component: Beometic,
  },
] as const;

export default stackNav;
