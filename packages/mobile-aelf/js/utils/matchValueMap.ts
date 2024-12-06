import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import * as Application from 'expo-application';
const MatchValueMap = {
  installationTime: '0',
  deviceType: String(isIOS ? VersionDeviceType.iOS : VersionDeviceType.Android),
  version: Application.nativeApplicationVersion || undefined,
  async init() {
    try {
      this.installationTime = String(await Application.getInstallationTimeAsync());
      return this;
    } catch (error) {
      console.log(error, '======error');
    }
  },
};

export default MatchValueMap;
