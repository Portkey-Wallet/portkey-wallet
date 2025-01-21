import LoginPortkey from './LoginPortkey';
import ScanLogin from './ScanLogin';
import SelectCountry from './SelectCountry';
import PrepareWallet from './PrepareWallet';
import LoginEmail from './LoginEmail';
import SignUpEmail from './SignUpEmail';
import LoginQRCode from './LoginQRCode';
import ImportWallet from './ImportWallet';
import ConfirmBackup from './ConfirmBackup';
import ManualBackup from './ManualBackup';
import ManualBackupSuccess from './ManualBackup/Success';
import WalletImportTypeSelect from './WalletImportTypeSelect';

const stackNav = [
  { name: 'LoginEmail', component: LoginEmail },
  { name: 'LoginQRCode', component: LoginQRCode },
  { name: 'SignUpEmail', component: SignUpEmail },
  { name: 'LoginPortkey', component: LoginPortkey },
  { name: 'ScanLogin', component: ScanLogin },
  { name: 'SelectCountry', component: SelectCountry },
  { name: 'PrepareWallet', component: PrepareWallet, options: { gestureEnabled: false } },
  { name: 'ImportWallet', component: ImportWallet },
  { name: 'WalletImportTypeSelect', component: WalletImportTypeSelect },
  { name: 'ConfirmBackup', component: ConfirmBackup },
  { name: 'ManualBackup', component: ManualBackup },
  { name: 'ManualBackupSuccess', component: ManualBackupSuccess },
] as const;

export default stackNav;
