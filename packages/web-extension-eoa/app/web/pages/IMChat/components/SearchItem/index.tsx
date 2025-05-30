import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contact';
import { GenerateType } from '@portkey-wallet/types/common';
import { Avatar, IChatItemProps } from '@portkey-wallet/im-ui-web';
import { ChannelTypeEnum } from '@portkey-wallet/im';
import './index.less';

export type ISearchItem = GenerateType<ContactItemType & IChatItemProps>;

export default function SearchItem({ item }: { item: ISearchItem }) {
  const { name, index } = useIndexAndName(item);

  return (
    <div className="flex-row-center search-item">
      <Avatar
        isGroupAvatar={item.channelType === ChannelTypeEnum.GROUP}
        avatarSize="small"
        src={item.avatar}
        letter={index}
      />

      <span className="search-item-name">{name}</span>
    </div>
  );
}
