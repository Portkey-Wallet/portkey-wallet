import { isArray } from 'lodash';
import { getStorageData, storeStorageData } from 'utils/asyncStorage';
import WebsiteAuthentication, { DappAuthenticationBehaviour } from '../behaviour/auth';

export class DappAuthManager implements DappAuthenticationBehaviour {
  private static ins: DappAuthManager = new DappAuthManager();
  public static getIns(): DappAuthManager {
    return DappAuthManager.ins;
  }

  protected cachedHosts: Array<string> = [];
  public checkPermission = async ({ hostName }: WebsiteAuthentication): Promise<boolean> => {
    let isAuthenticated = false;
    isAuthenticated = this.cachedHosts.includes(hostName);
    if (!isAuthenticated) {
      try {
        const authenticatedHosts = await getStorageData('AUTHENTICATED_HOSTS');
        if (authenticatedHosts && authenticatedHosts?.length > 0) {
          const hosts = JSON.parse(authenticatedHosts)?.data as Array<string>;
          if (isArray(hosts)) {
            this.cachedHosts = hosts;
            isAuthenticated = hosts.includes(hostName);
          }
        }
      } catch (e) {}
    }
    return isAuthenticated;
  };

  public onHostPermitted = async ({ hostName }: WebsiteAuthentication) => {
    if (!this.cachedHosts.includes(hostName)) {
      this.cachedHosts.push(hostName);
      await storeStorageData('AUTHENTICATED_HOSTS', JSON.stringify({ data: this.cachedHosts }));
    }
  };

  public onHostDenied = async (hosts: Array<string>) => {
    const restOfHosts = this.cachedHosts.filter(host => !hosts.includes(host));
    this.cachedHosts = restOfHosts;
    await storeStorageData('AUTHENTICATED_HOSTS', JSON.stringify({ data: this.cachedHosts }));
  };
}
