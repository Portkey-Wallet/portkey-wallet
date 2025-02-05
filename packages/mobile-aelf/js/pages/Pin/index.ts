import SetPin from './SetPin';
import ConfirmPin from './ConfirmPin';
import SetBiometrics from './SetBiometrics';
const stackNav = [
  { name: 'SetPin', component: SetPin, options: { gestureEnabled: false } },
  { name: 'ConfirmPin', component: ConfirmPin, options: { gestureEnabled: false } },
  { name: 'SetBiometrics', component: SetBiometrics, options: { gestureEnabled: false } },
] as const;

export default stackNav;
