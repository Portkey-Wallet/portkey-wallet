import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import CustomModal from 'pages/components/CustomModal';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import FindMorePrompt from './Prompt';
import FindMorePopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import im from '@portkey-wallet/im';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { message } from 'antd';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useContactRelationIdMap } from '@portkey-wallet/hooks/hooks-ca/contact';

export interface IFindMoreProps extends BaseHeaderProps {
  myPortkeyId: string;
  contact: Partial<ContactItemType>;
  isMainnet: boolean;
  isAdded?: boolean;
  goBack: () => void;
  handleSearch: ChangeEventHandler<HTMLInputElement>;
  clickItem: () => void;
  clickChat: (e: any, item: Partial<ContactItemType>) => void;
}

export default function FindMore() {
  const navigate = useNavigate();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const isMainnet = useIsMainnet();
  const { userId } = useWalletInfo();
  const contactRelationIdMap = useContactRelationIdMap();
  const [isAdded, setIsAdded] = useState(false);

  const headerTitle = 'Find More';
  const [contact, setContact] = useState({});
  // mock data
  // {
  //   index: 'B',
  //   name: 'by',
  //   addresses: [{ chainId: 'AELF' as ChainId, address: 'H8CXvfy' }],
  //   userId: '3fe8e56b',
  //   isDeleted: false,
  //   modificationTime: 1684829521408,
  //   id: '0be66c93',
  // },

  const handleSearch = useDebounceCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      setContact({});
      setIsAdded(false);
    }
    try {
      const res = await im.service.getUserInfo({ address: value });

      if (res?.data?.portkeyId === userId) {
        message.error('Unable to add yourself as a contact');
      } else {
        setContact({ ...res?.data, index: res?.data?.name?.substring(0, 1).toLocaleUpperCase() });
        setIsAdded(!!contactRelationIdMap?.[res?.data?.relationId]);
      }
    } catch (error) {
      const err = handleErrorMessage(error, 'handle display error');
      message.error(err);
    }
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const handleChat = useCallback(
    (e: any, item: Partial<ContactItemType>) => {
      e.stopPropagation();

      if (isPrompt) {
        CustomModal({
          content: (
            <>{`Please click on the Portkey browser extension in the top right corner to access the chat feature`}</>
          ),
        });
      } else {
        navigate('/setting/contacts/view', { state: item });
      }
    },
    [isPrompt, navigate],
  );

  return isNotLessThan768 ? (
    <FindMorePrompt
      headerTitle={headerTitle}
      myPortkeyId={userId || ''}
      contact={contact}
      isMainnet={isMainnet}
      isAdded={isAdded}
      goBack={goBack}
      handleSearch={handleSearch}
      clickItem={() => {
        navigate('/setting/contacts/view', { state: contact });
      }}
      clickChat={(e, item) => handleChat(e, item)}
    />
  ) : (
    <FindMorePopup
      headerTitle={headerTitle}
      myPortkeyId={userId || ''}
      contact={contact}
      isMainnet={isMainnet}
      isAdded={isAdded}
      goBack={goBack}
      handleSearch={handleSearch}
      clickItem={() => {
        navigate('/setting/contacts/view', { state: contact });
      }}
      clickChat={(e, item) => handleChat(e, item)}
    />
  );
}
