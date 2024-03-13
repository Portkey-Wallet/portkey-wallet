export interface ISettingsService {
  settingsManager(): Promise<void>;
  paymentSecurityManager(): Promise<void>;
}
