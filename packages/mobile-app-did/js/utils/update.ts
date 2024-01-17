import { Alert } from 'react-native';
import CodePush, {
  DownloadProgress,
  HandleBinaryVersionMismatchCallback,
  LocalPackage,
  UpdateDialog,
} from 'react-native-code-push';

export interface ICodePushOperator {
  localPackage: LocalPackage | null | undefined;
  initLocalPackage: () => Promise<ICodePushOperator['localPackage']>;
  getLabel: () => Promise<string | undefined>;
  getUpdateMetadata: typeof CodePush.getUpdateMetadata;
  checkForUpdate: typeof CodePush.checkForUpdate;
  sync: typeof CodePush.sync;
  checkToUpdate: () => Promise<void>;
}

export type TCodePushOperatorOptions = {
  deploymentKey: string;
};

export class CodePushOperator implements ICodePushOperator {
  public localPackage: ICodePushOperator['localPackage'];
  public getUpdateMetadata: typeof CodePush.getUpdateMetadata;
  public sync: typeof CodePush.sync;
  public deploymentKey: string;
  public syncStatus?: CodePush.SyncStatus;
  public progress?: DownloadProgress;
  public updateDialog: UpdateDialog;
  constructor({ deploymentKey }: TCodePushOperatorOptions) {
    this.deploymentKey = deploymentKey;
    this.getUpdateMetadata = CodePush.getUpdateMetadata;
    this.sync = CodePush.sync;
    this.updateDialog = {
      optionalIgnoreButtonLabel: 'later',
      optionalInstallButtonLabel: 'update immediately',
      optionalUpdateMessage: 'Found a new version, update?',
      title: 'Update tips',
    };
  }
  public async checkForUpdate(
    deploymentKey?: string | undefined,
    handleBinaryVersionMismatchCallback?: HandleBinaryVersionMismatchCallback | undefined,
  ) {
    return CodePush.checkForUpdate(deploymentKey || this.deploymentKey, handleBinaryVersionMismatchCallback);
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

  public restartApp() {
    Alert.alert('Download completed', 'Restart now?', [
      {
        text: 'update immediately',
        onPress: () => {
          CodePush.restartApp();
        },
      },
      { text: 'later', style: 'cancel' },
    ]);
  }
  public async checkToUpdate() {
    if (
      this.syncStatus === CodePush.SyncStatus.DOWNLOADING_PACKAGE ||
      this.syncStatus === CodePush.SyncStatus.UPDATE_INSTALLED
    ) {
      // DOWNLOADING_PACKAGE, UPDATE_INSTALLED
      return;
    }
    const update = await this.checkForUpdate();
    if (update) {
      this.sync(
        {
          deploymentKey: this.deploymentKey,
          updateDialog: this.updateDialog,
        },
        status => {
          this.syncStatus = status;
          if (status === CodePush.SyncStatus.INSTALLING_UPDATE) this.restartApp();
        },
        progress => {
          this.progress = progress;
        },
      );
    }
  }
}

export const codePushOperator = new CodePushOperator({ deploymentKey: 'IQcprlvYIWyYbUKD_qd8cSyy5gPUhjOnL9O_k' });

export function parseLabel(label?: string) {
  return label?.replace('v', '');
}
