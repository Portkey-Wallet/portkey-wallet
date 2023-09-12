import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ChannelTypeEnum } from '@portkey-wallet/im/types';
import { GenerateType } from '@portkey-wallet/types/common';
import './index.less';
import CustomSvg from 'components/CustomSvg';

export type ISearchItem = GenerateType<ContactItemType & { channelType?: ChannelTypeEnum }>;

export default function SearchItem({ item }: { item: ISearchItem }) {
  const { name, index } = useIndexAndName(item);

  return (
    <div className="flex-row-center search-item">
      {item.channelType === ChannelTypeEnum.GROUP ? (
        <div className="flex-center avatar-group-container">
          <CustomSvg type="GroupAvatar" className="group-avatar-icon" />
        </div>
      ) : (
        <div className="flex-center search-index-logo">{index}</div>
      )}

      <span className="search-item-name">{name}</span>
    </div>
  );
}
