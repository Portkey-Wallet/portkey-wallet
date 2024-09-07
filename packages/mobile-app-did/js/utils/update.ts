import CodePush, {
  DownloadProgress,
  HandleBinaryVersionMismatchCallback,
  LocalPackage,
  RemotePackage,
} from 'react-native-code-push';
import * as Application from 'expo-application';
import ActionSheet from 'components/ActionSheet';
import EventEmitter from 'events';
import UpdateOverlay from 'components/UpdateOverlay';
import OverlayModal from 'components/OverlayModal';
import { ButtonRowProps } from 'components/ButtonRow';
import { IStorage } from '@portkey-wallet/types/storage';
import { baseStore } from '@portkey-wallet/utils/mobile/storage';
import { getWallet } from 'utils/redux';
import { getCmsCodePoshControl } from '@portkey-wallet/hooks/hooks-ca/cms/util';
import { getDispatch } from './redux';
import { setUpdateInfo } from 'store/user/actions';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import CommonToast from 'components/CommonToast';
import { CODE_PUSH_OPTIONS } from 'constants/codePush';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { AppLifeCycleModule } from 'utils/nativeModules';
export type TUpdateInfo = {
  version?: string | null;
  label?: string | null;
  title?: string | null;
  content?: string | null;
  isForceUpdate?: boolean | null;
  updatedTitle?: string | null;
  updatedContent?: string | null;
};

export interface ICodePushOperator {
  localPackage: LocalPackage | null | undefined;
  initLocalPackage: () => Promise<ICodePushOperator['localPackage']>;
  getLabel: () => Promise<string | undefined>;
  getUpdateMetadata: typeof CodePush.getUpdateMetadata;
  checkForUpdate: typeof CodePush.checkForUpdate;
  sync: typeof CodePush.sync;
  checkToUpdate: () => Promise<void>;
  getUpdateInfo: (version: string, label: string) => Promise<TUpdateInfo>;
}

export type TCodePushOperatorOptions = {
  deploymentKey: string;
  storage: IStorage;
};
export type TRemotePackageInfo = { remotePackage: RemotePackage | null; time: number };

export const RemotePackageExpiration = 1000 * 60 * 5;

enum CODE_PUSH_ERROR {
  Downloading = 'Downloading updates',
  Installed = 'Installed',
  ReCheck = 'Too many requests. Please try again later.',
}

export class CodePushOperator extends EventEmitter implements ICodePushOperator {
  public localPackage: ICodePushOperator['localPackage'];
  public getUpdateMetadata: typeof CodePush.getUpdateMetadata;
  public sync: typeof CodePush.sync;
  public deploymentKey: string;
  public syncStatus?: CodePush.SyncStatus;
  public progress?: DownloadProgress;
  protected _progressEventName = Symbol();
  public remotePackageInfo?: TRemotePackageInfo;
  public storage: IStorage;
  public storageUpdateInfo: { [key: string]: boolean };
  public version: string;
  protected _storageKey = 'CodePushOperator';
  constructor({ deploymentKey, storage }: TCodePushOperatorOptions) {
    super();
    this.storage = storage;
    this.deploymentKey = deploymentKey;
    this.getUpdateMetadata = CodePush.getUpdateMetadata;
    this.sync = CodePush.sync;
    this.storageUpdateInfo = {};
    this.version = Application.nativeApplicationVersion || '';
    this.initUpdateInfo();
  }

  public async setStorageUpdateInfo(hash: string) {
    try {
      this.storageUpdateInfo[hash] = true;
      await this.storage.setItem(this._storageKey + this.version, JSON.stringify(this.storageUpdateInfo));
    } catch (error) {
      console.log(error, '=======error');
    }
  }

  public getStorageUpdateInfo(hash: string) {
    return this.storageUpdateInfo[hash];
  }

  public async initUpdateInfo() {
    try {
      const data = await this.storage.getItem(this._storageKey + this.version);
      if (!data) throw new Error('No update info');
      this.storageUpdateInfo = JSON.parse(data);
    } catch (error) {
      this.storageUpdateInfo = {};
    }
  }

  public addProgressListener(listener: (p: DownloadProgress) => void) {
    this.addListener(this._progressEventName, listener);
    const remove = () => {
      this.removeListener(this._progressEventName, listener);
    };
    return { remove };
  }
  public async getUpdateInfo(label: string): Promise<TUpdateInfo> {
    const version = this.version;
    const { currentNetwork: networkType } = getWallet();

    const result = await getCmsCodePoshControl({ version, label, networkType, isIOS });

    return result;
  }
  public isValidRemotePackageInfo(remotePackageInfo?: TRemotePackageInfo): remotePackageInfo is TRemotePackageInfo {
    return !!(
      remotePackageInfo &&
      remotePackageInfo.remotePackage &&
      Date.now() < RemotePackageExpiration + remotePackageInfo.time
    );
  }
  public async checkForUpdate(
    deploymentKey?: string | undefined,
    handleBinaryVersionMismatchCallback?: HandleBinaryVersionMismatchCallback | undefined,
  ) {
    if (this.isValidRemotePackageInfo(this.remotePackageInfo)) return this.remotePackageInfo.remotePackage;
    const remotePackage = await CodePush.checkForUpdate(
      deploymentKey || this.deploymentKey,
      handleBinaryVersionMismatchCallback,
    );
    this.remotePackageInfo = { remotePackage, time: Date.now() };
    return remotePackage;
  }

  public async showUpdatedAlert() {
    try {
      const currentData = await this.getUpdateMetadata(CodePush.UpdateState.RUNNING);
      if (!currentData) return;
      if (this.getStorageUpdateInfo(currentData.packageHash)) return;
      const info = await this.getUpdateInfo(currentData.label);
      if (info.updatedContent || info.updatedTitle) {
        this.setStorageUpdateInfo(currentData.packageHash);
        ActionSheet.alert({
          messageStyle: { textAlign: 'left' },
          title: info.updatedTitle || '',
          message: info.updatedContent,
          buttons: [{ title: 'I Know' }],
        });
      }
    } catch (error) {
      console.log(error, '=====error-showUpdatedAlert');
    }
  }

  public async showCheckUpdate() {
    try {
      const updateInfo = await this.checkForUpdate();
      const [currentData] = await Promise.all([this.getUpdateMetadata(CodePush.UpdateState.RUNNING)]);
      if (updateInfo?.packageHash === currentData?.packageHash) return;
      if (!updateInfo) return;
      const info = await this.getUpdateInfo(updateInfo.label);
      if (info.isForceUpdate) {
        this.syncData(updateInfo, true);
        return;
      }
      if (info.label && info.version) return info;
    } catch (error) {
      console.log(error, '======showCheckUpdate-error');
    }
  }
  public async initLocalPackage() {
    try {
      this.localPackage = await this.getUpdateMetadata(CodePush.UpdateState.RUNNING);
      return this.localPackage;
    } catch (error) {
      return undefined;
    }
  }
  public async getLabel() {
    if (this.localPackage !== undefined) return this.localPackage?.label;
    return (await this.initLocalPackage())?.label;
  }

  public async restartApp(isForceUpdate?: boolean) {
    OverlayModal.hide();
    const buttons: ButtonRowProps['buttons'] = [];
    if (!isForceUpdate) {
      buttons.push({
        title: 'Not Now',
        type: 'outline',
      });
    }
    buttons.push({
      title: 'Update',
      onPress: async () => {
        getDispatch()(setUpdateInfo(undefined));
        await sleep(200);

        if (isIOS) {
          CodePush.restartApp();
        } else {
          AppLifeCycleModule?.restartApp?.();
        }
      },
    });
    ActionSheet.alert({
      title: 'The latest version is downloaded. You can update Portkey now.',
      buttons,
    });
  }
  public async syncData(updateInfo: RemotePackage | null, isForceUpdate?: boolean) {
    try {
      if (!isForceUpdate) UpdateOverlay.show();
      const syncStatus = await this.sync(
        {
          deploymentKey: this.deploymentKey,
          installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        },
        status => {
          this.syncStatus = status;
          if (status === CodePush.SyncStatus.INSTALLING_UPDATE) this.restartApp(isForceUpdate);
        },
        progress => {
          if (isForceUpdate) return;
          this.emit(this._progressEventName, progress);
          this.progress = progress;
        },
      );
      if (syncStatus === CodePush.SyncStatus.SYNC_IN_PROGRESS) throw Error(CODE_PUSH_ERROR.Downloading);

      if (updateInfo && syncStatus === CodePush.SyncStatus.UP_TO_DATE) {
        // CodePush.clearUpdates
        await CodePush.clearUpdates();
        this.syncData(updateInfo, isForceUpdate);
      }
    } catch (error) {
      const message = handleErrorMessage(error);
      if (message === CODE_PUSH_ERROR.Downloading) throw error;
      throw Error(CODE_PUSH_ERROR.ReCheck);
    }
  }
  public async checkToUpdate() {
    try {
      if (this.syncStatus === CodePush.SyncStatus.DOWNLOADING_PACKAGE) throw Error(CODE_PUSH_ERROR.Downloading);

      if (this.syncStatus === CodePush.SyncStatus.UPDATE_INSTALLED) {
        this.restartApp();
        return;
      }
      const updateInfo = await this.checkForUpdate();
      const [currentData, pendingData] = await Promise.all([
        this.getUpdateMetadata(CodePush.UpdateState.RUNNING),
        this.getUpdateMetadata(CodePush.UpdateState.PENDING),
      ]);
      if (!updateInfo) {
        if (pendingData && pendingData?.packageHash !== currentData?.packageHash) {
          this.restartApp();
        }
        return;
      }

      if (updateInfo.packageHash === currentData?.packageHash) throw Error(CODE_PUSH_ERROR.Installed);

      if (updateInfo.packageHash === pendingData?.packageHash) {
        return this.restartApp();
      }
      const info = await this.getUpdateInfo(updateInfo.label);
      ActionSheet.alert({
        messageStyle: { textAlign: 'left' },
        title: info.title || 'New version found. Is an update made?',
        message: info.content,
        buttons: [
          { title: 'Later', type: 'outline' },
          {
            title: 'Download',
            onPress: async () => {
              try {
                await this.syncData(updateInfo, !!info.isForceUpdate);
              } catch (error) {
                CommonToast.failError(error);
              }
            },
          },
        ],
      });
    } catch (error) {
      const message = handleErrorMessage(error);
      if (message === CODE_PUSH_ERROR.Installed || message === CODE_PUSH_ERROR.Installed) {
        CommonToast.fail(message);
      } else {
        CommonToast.fail(CODE_PUSH_ERROR.ReCheck);
      }
    }
  }
}

export const codePushOperator = new CodePushOperator({
  deploymentKey: CODE_PUSH_OPTIONS.deploymentKey,
  storage: baseStore,
});

export function parseLabel(label?: string) {
  return label?.replace('v', '');
}
