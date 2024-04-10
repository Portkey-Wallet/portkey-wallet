declare type Config = {
  environment: 'APP' | 'SDK';
};
declare class Inject {
  private isInit: boolean;
  private config: Config;
  inject(config: { environment: 'APP' | 'SDK' }): void;
  getConfig(): Config;
  isAPP(): boolean;
  isSDK(): boolean;
}
declare const _default: Inject;
export default _default;
