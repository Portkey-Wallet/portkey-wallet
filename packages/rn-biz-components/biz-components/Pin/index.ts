import SetPin from './SetPin';
import CheckPin from './CheckPin';
import ConfirmPin from './ConfirmPin';
import SetBiometrics from './SetBiometrics';
const stackNav = [
  { name: 'SetPin', component: SetPin, options: { gestureEnabled: false } },
  { name: 'ConfirmPin', component: ConfirmPin },
  { name: 'SetBiometrics', component: SetBiometrics },
  { name: 'CheckPin', component: CheckPin },
] as const;

export default stackNav;
