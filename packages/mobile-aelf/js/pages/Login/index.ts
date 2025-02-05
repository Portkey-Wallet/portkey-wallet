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
import ImportByCloud from './ImportWallet/ImportByCloud';
import ImportByCloudDecrypt from './ImportWallet/ImportByCloud/Decrypt';
import CloudBackup from './CloudBackup';
import CloudBackupDev from './CloudBackup/cases';

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
  { name: 'ImportByCloud', component: ImportByCloud },
  { name: 'ImportByCloudDecrypt', component: ImportByCloudDecrypt },
  { name: 'ConfirmBackup', component: ConfirmBackup },
  { name: 'ManualBackup', component: ManualBackup },
  { name: 'CloudBackup', component: CloudBackup },
  { name: 'CloudBackupDev', component: CloudBackupDev },
  { name: 'ManualBackupSuccess', component: ManualBackupSuccess },
] as const;

export default stackNav;
