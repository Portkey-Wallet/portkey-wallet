import CodePush, {
  DownloadProgress,
  HandleBinaryVersionMismatchCallback,
  LocalPackage,
  RemotePackage,
} from 'react-native-code-push';
import * as Application from 'expo-application';
import ActionSheet from 'components/ActionSheet';
import CommonToast from 'components/CommonToast';
import EventEmitter from 'events';
import UpdateOverlay from 'components/UpdateOverlay';
import OverlayModal from 'components/OverlayModal';
import { ButtonRowProps } from 'components/ButtonRow';

export type TUpdateInfo = {
  version: string;
  label: string;
  title?: string;
  content?: string;
  isForceUpdate?: boolean;
  updatedTitle?: string;
  updatedContent?: string;
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
};
export type TRemotePackageInfo = { remotePackage: RemotePackage | null; time: number };

export const RemotePackageExpiration = 1000 * 60 * 5;

export class CodePushOperator extends EventEmitter implements ICodePushOperator {
  public localPackage: ICodePushOperator['localPackage'];
  public getUpdateMetadata: typeof CodePush.getUpdateMetadata;
  public sync: typeof CodePush.sync;
  public deploymentKey: string;
  public syncStatus?: CodePush.SyncStatus;
  public progress?: DownloadProgress;
  protected _progressEventName = Symbol();
  public remotePackageInfo?: TRemotePackageInfo;
  constructor({ deploymentKey }: TCodePushOperatorOptions) {
    super();
    this.deploymentKey = deploymentKey;
    this.getUpdateMetadata = CodePush.getUpdateMetadata;
    this.sync = CodePush.sync;
  }
  public addProgressListener(listener: (p: DownloadProgress) => void) {
    this.addListener(this._progressEventName, listener);
    const remove = () => {
      this.removeListener(this._progressEventName, listener);
    };
    return { remove };
  }
  public async getUpdateInfo(label: string): Promise<TUpdateInfo> {
    const version = Application.nativeApplicationVersion || '';
    console.log(label);
    return {
      version: '1.5.0',
      label: 'v1',
      title: 'title',
      content: 'content',
      isForceUpdate: false,
    };
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

  public async showCheckUpdate() {
    try {
      const updateInfo = await this.checkForUpdate();
      console.log(updateInfo, '=======showCheckUpdate');

      if (!updateInfo) return;
      const info = await this.getUpdateInfo(updateInfo.label);
      console.log(info, '=========info');

      if (info.isForceUpdate) return this.syncData(updateInfo, true);
      if (info.label && info.version) return info;
    } catch (error) {
      console.log(error, '======error');
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

  public restartApp(isForceUpdate?: boolean) {
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
      onPress: () => {
        CodePush.restartApp();
      },
    });
    ActionSheet.alert({
      title: 'The download is complete. Is the update immediate?',
      buttons,
    });
  }
  public async syncData(updateInfo: RemotePackage | null, isForceUpdate?: boolean) {
    try {
      let start = false;
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
          if (!start) UpdateOverlay.show();
          start = true;
          this.emit(this._progressEventName, progress);
          this.progress = progress;
        },
      );
      if (syncStatus === CodePush.SyncStatus.SYNC_IN_PROGRESS) {
        return CommonToast.info('Downloading updates');
      }
      if (updateInfo && syncStatus === CodePush.SyncStatus.UP_TO_DATE) {
        // CodePush.clearUpdates
        await CodePush.clearUpdates();
        this.syncData(updateInfo);
      }
      console.log(syncStatus, '======syncStatus');
    } catch (error) {
      CommonToast.fail('Please try again later.');
      console.log(error, '======error');
    }
  }
  public async checkToUpdate() {
    console.log(this.syncStatus, '=====this.syncStatus');

    if (this.syncStatus === CodePush.SyncStatus.DOWNLOADING_PACKAGE) {
      return CommonToast.info('Downloading updates');
    }
    if (this.syncStatus === CodePush.SyncStatus.UPDATE_INSTALLED) {
      this.restartApp();
      return;
    }
    try {
      const updateInfo = await this.checkForUpdate();
      console.log(updateInfo, '====updateInfo');
      const [currentData, pendingData] = await Promise.all([
        this.getUpdateMetadata(CodePush.UpdateState.RUNNING),
        this.getUpdateMetadata(CodePush.UpdateState.PENDING),
      ]);
      console.log(currentData, pendingData, '=====currentData, pendingData');

      if (!updateInfo) {
        if (pendingData && pendingData?.packageHash !== currentData?.packageHash) {
          this.restartApp();
        }
        return;
      }

      if (updateInfo.packageHash === currentData?.packageHash) {
        return CommonToast.info('Installed');
      }
      if (updateInfo.packageHash === pendingData?.packageHash) {
        return this.restartApp();
      }
      const info = await this.getUpdateInfo(updateInfo.label);
      ActionSheet.alert({
        messageStyle: { textAlign: 'left' },
        titleStyle: { marginBottom: 0 },
        title: info.title || 'New version found. Is an update made?',
        message: info.content,
        buttons: [
          { title: 'Later', type: 'outline' },
          {
            title: 'Download',
            onPress: () => {
              this.syncData(updateInfo);
            },
          },
        ],
      });
    } catch (error) {
      console.log(error, '====error');
    }
  }
}

export const codePushOperator = new CodePushOperator({ deploymentKey: 'IQcprlvYIWyYbUKD_qd8cSyy5gPUhjOnL9O_k' });

export function parseLabel(label?: string) {
  return label?.replace('v', '');
}
