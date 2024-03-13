import { IStorage, StorageBaseLoader } from 'packages/types/storage';
import { request } from 'packages/api/api-did';
import { RequestConfig } from '../../types';
import { LoginKeyType } from 'packages/types/types-ca/wallet';
import { OperationTypeEnum } from 'packages/types/verifier';

type VerifierInfo = {
  verifierSessionId: string;
  time: number;
};

export interface SendVerificationConfig extends RequestConfig {
  params: {
    type: LoginKeyType;
    guardianIdentifier?: string;
    verifierId?: string;
    chainId: string | number;
    operationType: OperationTypeEnum;
  };
}

export const IntervalErrorMessage = 'The interval between sending two verification codes is less than 60s';
export class Verification extends StorageBaseLoader {
  private readonly _defaultKeyName = 'portkey_did_wallet';
  private readonly _expirationTime = 58 * 1000;
  public verifierMap: {
    [key: string]: VerifierInfo;
  };
  constructor(store: IStorage) {
    super(store);
    this.verifierMap = {};
    this.load();
  }
  public async load() {
    try {
      const storageVerifierMap = await this._store.getItem(this._defaultKeyName);
      if (storageVerifierMap) this.verifierMap = JSON.parse(storageVerifierMap);
      if (typeof this.verifierMap !== 'object') this.verifierMap = {};
    } catch (error) {
      console.log(error, '====load-verification');
    }
  }
  public async save() {
    this._store.setItem(this._defaultKeyName, JSON.stringify(this.verifierMap));
  }
  public get(key: string): void | VerifierInfo {
    const info = this.verifierMap[key];
    if (!info) return;
    const endTime = info.time + this._expirationTime;
    if (endTime > Date.now()) {
      return info;
    } else {
      this.delete(key);
    }
  }
  public delete(key: string) {
    delete this.verifierMap[key];
    this.save();
  }
  public async set(key: string, value: VerifierInfo) {
    this.verifierMap[key] = value;
    await this.save();
  }

  public async sendVerificationCode(config: SendVerificationConfig) {
    const { guardianIdentifier, verifierId } = config.params;
    const key = (guardianIdentifier || '') + (verifierId || '');
    try {
      const req = await request.verify.sendVerificationRequest(config);
      await this.set(key, { ...req, time: Date.now() });
      return req;
    } catch (error: any) {
      const { message } = error?.error || error || {};
      const item = this.get(key);
      if (message === IntervalErrorMessage && item) return item;
      throw error;
    }
  }
  public async checkVerificationCode(config: RequestConfig) {
    const { guardianIdentifier, verifierId } = config.params || {};
    const key = (guardianIdentifier || '') + (verifierId || '');
    const req = await request.verify.checkVerificationCode(config);
    this.delete(key);
    return req;
  }
}
