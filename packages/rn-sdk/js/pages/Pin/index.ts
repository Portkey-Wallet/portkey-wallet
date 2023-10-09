import SetPin from './SetPin';
import CheckPin from './check-pin';
import ConfirmPin from './confirm-pin';
import SetBiometrics from './set-biometrics';
const stackNav = [
  { name: 'SetPin', component: SetPin, options: { gestureEnabled: false } },
  { name: 'ConfirmPin', component: ConfirmPin },
  { name: 'SetBiometrics', component: SetBiometrics },
  { name: 'CheckPin', component: CheckPin },
] as const;

export default stackNav;
