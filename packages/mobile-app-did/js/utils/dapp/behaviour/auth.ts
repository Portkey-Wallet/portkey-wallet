export default interface WebsiteAuthentication {
  hostName: string;
  avatarImg?: string;
  websiteName?: string;
}

export interface DappAuthenticationBehaviour {
  checkPermission: (websiteAuthentication: WebsiteAuthentication) => Promise<boolean>;
  onHostPermitted: (websiteAuthentication: WebsiteAuthentication) => Promise<void>;
  onHostDenied: (hosts: Array<string>) => Promise<void>;
}
