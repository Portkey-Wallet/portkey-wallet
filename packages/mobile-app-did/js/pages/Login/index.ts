import SignupPortkey from './SignupPortkey';
import LoginPortkey from './LoginPortkey';
import ScanLogin from './ScanLogin';
import SelectCountry from './SelectCountry';
import H5Login from './H5Login';

const stackNav = [
  { name: 'SignupPortkey', component: SignupPortkey },
  { name: 'LoginPortkey', component: LoginPortkey },
  { name: 'ScanLogin', component: ScanLogin },
  { name: 'SelectCountry', component: SelectCountry },
  { name: 'H5Login', component: H5Login },
] as const;

export default stackNav;
