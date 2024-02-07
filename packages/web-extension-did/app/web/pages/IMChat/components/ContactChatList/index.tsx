import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import DropdownSearch from 'components/DropdownSearch';
import { Button } from 'antd';
import { useChatContactFlatList } from '@portkey-wallet/hooks/hooks-ca/contact';
import ContactListSelect, { IContactItemSelectProps } from '../../components/ContactListSelect';
import { ChannelMemberInfo } from '@portkey-wallet/im';
import { getAelfAddress, isAelfAddress } from '@portkey-wallet/utils/aelf';
import CustomSvg from 'components/CustomSvg';
import './index.less';

interface IContactChatListProps {
  onClose: () => void;
  onConfirm: (v: ChannelMemberInfo[]) => void;
}

export default function ContactChatList({ onClose, onConfirm }: IContactChatListProps) {
  const [filterWord, setFilterWord] = useState<string>('');
  const [disabled, setDisabled] = useState(true);
  const allChatContact = useChatContactFlatList();
  const selectedContactRef = useRef<ChannelMemberInfo[]>([]);
  const allContactRef = useRef<IContactItemSelectProps[]>(allChatContact);
  const [showMemberList, setShowMemberList] = useState<IContactItemSelectProps[]>(allChatContact);

  const handleSearch = useCallback((keyword: string) => {
    let res: IContactItemSelectProps[] = [];
    if (keyword.length <= 16) {
      // name search
      const _v = keyword.toLowerCase();
      res = allContactRef.current.filter((m) => {
        if (m?.caHolderInfo?.walletName) {
          return (
            m?.name?.trim().toLowerCase().includes(_v) || m?.caHolderInfo?.walletName?.trim().toLowerCase().includes(_v)
          );
        } else {
          return m?.name?.trim().toLowerCase().includes(_v) || m?.imInfo?.name?.trim().toLowerCase().includes(_v);
        }
      });
    } else {
      // Portkey ID search
      res.push(...allContactRef.current.filter((m) => m?.imInfo?.portkeyId?.trim() === keyword.trim()));
      // Address search
      let suffix = '';
      if (keyword.includes('_')) {
        const arr = keyword.split('_');
        if (!isAelfAddress(arr[arr.length - 1])) {
          suffix = arr[arr.length - 1];
        }
      }
      const _v = getAelfAddress(keyword);
      res.push(
        ...allContactRef.current.filter((m) =>
          m?.addresses?.some((ads) => ads.address === _v && (!suffix || suffix === ads.chainId)),
        ),
      );
    }
    setShowMemberList(res);
  }, []);
  const searchDebounce = useDebounceCallback(
    (params) => {
      const _v = params.trim();
      _v ? handleSearch(_v) : setShowMemberList(allContactRef.current || []);
      setFilterWord(_v);
    },
    [handleSearch],
    500,
  );
  const clickAddItem = useCallback(
    (item: IContactItemSelectProps) => {
      // update selectedItem
      const target = selectedContactRef?.current || [];
      if (target?.some((m) => m.relationId === item.imInfo?.relationId)) {
        selectedContactRef.current = target.filter((m) => m.relationId !== item.imInfo?.relationId);
      } else {
        target.push({
          isAdmin: false,
          name: item.name || '',
          relationId: item.imInfo?.relationId || '',
          avatar: '',
        });
        selectedContactRef.current = target;
      }
      // update showList
      const _v = showMemberList.map((m) => {
        if (m.imInfo?.relationId === item.imInfo?.relationId) {
          return {
            ...m,
            selected: !m.selected,
          };
        } else {
          return m;
        }
      });
      setShowMemberList(_v);
      // update allItem
      const _update = allContactRef.current?.map((m) => {
        if (m.imInfo?.relationId === item.imInfo?.relationId) {
          return {
            ...m,
            selected: !m.selected,
          };
        }
        return m;
      });
      allContactRef.current = _update;
      setDisabled(!selectedContactRef?.current?.length);
    },
    [showMemberList],
  );
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const _value = e.target.value;
      searchDebounce(_value);
    },
    [searchDebounce],
  );
  return (
    <div className="share-contact-list flex-column-between">
      <div className="share-contact-list-header">
        <CustomSvg type="Close2" onClick={onClose} />
        <div className="list-header-title flex-center">Share with</div>
        <DropdownSearch
          overlay={<></>}
          inputProps={{
            onChange: handleInputChange,
            placeholder: 'Name/address/Portkey ID',
          }}
        />
      </div>
      <div className="share-contact-list-body flex-column-between">
        <div className="member-list-container">
          {showMemberList.length !== 0 ? (
            <ContactListSelect list={showMemberList} clickItem={clickAddItem} />
          ) : (
            <div className="flex-center member-list-empty">{filterWord ? 'No contact found' : 'No contact'}</div>
          )}
        </div>
        <div className="member-list-btn flex-center" onClick={() => onConfirm(selectedContactRef.current)}>
          <Button disabled={disabled} type="primary">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
