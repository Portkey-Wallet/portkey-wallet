import { isIOS } from '@portkey-wallet/utils/mobile/device';
import CodePush from 'react-native-code-push';
import Config from 'react-native-config';

export const CODE_PUSH_OPTIONS = {
  updateDialog: false,
  deploymentKey: (isIOS ? Config.CODE_PUSH_IOS_DEPLOYMENT_KEY : Config.CODE_PUSH_ANDROID_DEPLOYMENT_KEY) || '',
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
};
