import SignupPortkey from './SignupPortkey';
import LoginPortkey from './LoginPortkey';
import ScanLogin from './ScanLogin';
import SelectCountry from './SelectCountry';
import PrepareWallet from './PrepareWallet';
import LoginEmail from './LoginEmail';

const stackNav = [
  { name: 'LoginEmail', component: LoginEmail },
  { name: 'SignupPortkey', component: SignupPortkey },
  { name: 'LoginPortkey', component: LoginPortkey },
  { name: 'ScanLogin', component: ScanLogin },
  { name: 'SelectCountry', component: SelectCountry },
  { name: 'PrepareWallet', component: PrepareWallet },
] as const;

export default stackNav;
