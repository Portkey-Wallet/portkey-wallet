import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import CustomModal from 'pages/components/CustomModal';
import { useCommonState } from 'store/Provider/hooks';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import FindMorePrompt from './Prompt';
import FindMorePopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import im from '@portkey-wallet/im';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useContactRelationIdMap } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { getAddressInfo } from '@portkey-wallet/utils/aelf';
import { useCreateP2pChannel } from '@portkey-wallet/hooks/hooks-ca/im';
import { useLocationState } from 'hooks/router';
import { FromPageEnum, TFindMoreLocationState } from 'types/router';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

export interface IContactItemRes extends Partial<ContactItemType> {
  isAdded?: boolean;
}

export interface IFindMoreProps extends BaseHeaderProps {
  myPortkeyId: string;
  contacts: IContactItemRes[];
  showChat: boolean;
  isSearch?: boolean;
  goBack: () => void;
  handleSearch: ChangeEventHandler<HTMLInputElement>;
  clickItem: (contact: IContactItemRes) => void;
  clickChat: (e: any, item: IContactItemRes) => void;
  clickQRCode: () => void;
}

export default function FindMore() {
  const navigate = useNavigate();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const { state } = useLocationState<TFindMoreLocationState>();
  const showChat = useIsChatShow();
  const userInfo = useCurrentUserInfo();
  const contactRelationIdMap = useContactRelationIdMap();
  const [isSearch, setIsSearch] = useState(false);
  const createChannel = useCreateP2pChannel();

  const headerTitle = 'Find People';
  const [contacts, setContacts] = useState<IContactItemRes[]>([]);

  const handleSearch = useDebounceCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();

      if (!value) {
        setContacts([]);
        setIsSearch(false);
        return;
      }

      setIsSearch(true);

      const addressTrans = getAddressInfo(value.trim());
      if (!addressTrans?.address) {
        setContacts([]);
        return;
      }

      try {
        const res = await im.service.getUserInfoList({ keywords: addressTrans.address });

        const resTrans: IContactItemRes[] = res.data.map((item) => {
          return {
            ...item,
            index: item?.name?.substring(0, 1).toLocaleUpperCase(),
            name: item?.name,
            imInfo: {
              relationId: item.relationId,
              portkeyId: item.portkeyId,
            },
            isAdded: !!contactRelationIdMap?.[item?.relationId],
          };
        });

        setContacts(resTrans);
      } catch (error) {
        const err = handleErrorMessage(error, 'handle display error');
        singleMessage.error(err);
        setContacts([]);
      }
    },
    [contactRelationIdMap],
  );

  const goBack = () => {
    if (state?.previousPage === FromPageEnum.chatSearch) return navigate('/chat-list-search', { state });
    if (state?.previousPage === FromPageEnum.chatList) return navigate('/chat-list', { state });
    return navigate('/setting/contacts');
  };

  const handleChat = useCallback(
    async (e: any, item: IContactItemRes) => {
      e.stopPropagation();

      if (isPrompt) {
        CustomModal({
          content: (
            <>{`Please click on the Portkey browser extension in the top right corner to access the chat feature`}</>
          ),
        });
      } else {
        try {
          const res = await createChannel(item?.imInfo?.relationId || '');
          navigate(`/chat-box/${res.channelUuid}`);
        } catch (e) {
          console.log('===createChannel error', e);
          singleMessage.error('cannot chat');
        }
      }
    },
    [createChannel, isPrompt, navigate],
  );

  return isNotLessThan768 ? (
    <FindMorePrompt
      headerTitle={headerTitle}
      myPortkeyId={userInfo?.userId || ''}
      contacts={contacts}
      showChat={showChat}
      isSearch={isSearch}
      goBack={goBack}
      handleSearch={handleSearch}
      clickItem={(contact) => {
        navigate('/setting/contacts/view', { state: contact });
      }}
      clickChat={(e, item) => handleChat(e, item)}
      clickQRCode={() => navigate('/setting/contacts/qrcode', { state })}
    />
  ) : (
    <FindMorePopup
      headerTitle={headerTitle}
      myPortkeyId={userInfo?.userId || ''}
      contacts={contacts}
      showChat={showChat}
      isSearch={isSearch}
      goBack={goBack}
      handleSearch={handleSearch}
      clickItem={(contact) => {
        navigate('/setting/contacts/view', { state: contact });
      }}
      clickChat={(e, item) => handleChat(e, item)}
      clickQRCode={() => navigate('/setting/contacts/qrcode', { state })}
    />
  );
}
