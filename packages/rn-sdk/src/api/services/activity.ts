import { injectable } from 'inversify';
import { BaseService } from '.';
import { ActivityDetailPropsType, IActivityService } from 'api/types/activity';
import { PortkeyEntries } from '@portkey-wallet/rn-core/router/types';
import { CheckWalletUnlocked, HANDLE_WAY } from 'api/decorate';

@injectable()
export class ActivityService extends BaseService implements IActivityService {
  @CheckWalletUnlocked({ way: HANDLE_WAY.THROW_ERROR })
  async openActivityList() {
    this.openFromExternal(PortkeyEntries.ACTIVITY_LIST_ENTRY);
  }

  @CheckWalletUnlocked({ way: HANDLE_WAY.THROW_ERROR })
  async openActivityDetail(props: ActivityDetailPropsType) {
    const caAddressInfos = Object.entries(props.multiCaAddresses ?? {}).map(it => {
      return { chainId: it[0], caAddress: it[1] };
    });
    this.openFromExternal(PortkeyEntries.ACTIVITY_DETAIL_ENTRY, { item: props.item, caAddressInfos });
  }
}
