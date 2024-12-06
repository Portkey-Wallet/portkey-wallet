import SetPin from './SetPin';
import CheckPin from './CheckPin';
import ConfirmPin from './ConfirmPin';
import SetBiometrics from './SetBiometrics';
const stackNav = [
  { name: 'SetPin', component: SetPin, options: { gestureEnabled: false } },
  { name: 'ConfirmPin', component: ConfirmPin, options: { gestureEnabled: false } },
  { name: 'SetBiometrics', component: SetBiometrics, options: { gestureEnabled: false } },
  { name: 'CheckPin', component: CheckPin },
] as const;

export default stackNav;
