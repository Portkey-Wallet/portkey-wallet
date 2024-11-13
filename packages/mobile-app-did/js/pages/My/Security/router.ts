import Security from '.';
import AutoLock from './AutoLock';
import Biometric from '../AccountSettings/Biometric';

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
    name: 'Biometric',
    component: Biometric,
  },
] as const;

export default stackNav;
