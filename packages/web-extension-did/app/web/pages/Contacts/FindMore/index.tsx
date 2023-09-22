import { ChangeEvent, ChangeEventHandler, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import CustomModal from 'pages/components/CustomModal';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import FindMorePrompt from './Prompt';
import FindMorePopup from './Popup';
import { BaseHeaderProps } from 'types/UI';
import im from '@portkey-wallet/im';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { message } from 'antd';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { useContactRelationIdMap } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { getAddressInfo } from '@portkey-wallet/utils/aelf';
import { useCreateP2pChannel } from '@portkey-wallet/hooks/hooks-ca/im';

export interface IFindMoreProps extends BaseHeaderProps {
  myPortkeyId: string;
  contact: Partial<ContactItemType>;
  showChat: boolean;
  isAdded?: boolean;
  isSearch?: boolean;
  goBack: () => void;
  handleSearch: ChangeEventHandler<HTMLInputElement>;
  clickItem: () => void;
  clickChat: (e: any, item: Partial<ContactItemType>) => void;
}

export default function FindMore() {
  const navigate = useNavigate();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const { state } = useLocation();
  const showChat = useIsChatShow();
  const { userId } = useWalletInfo();
  const contactRelationIdMap = useContactRelationIdMap();
  const [isAdded, setIsAdded] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const createChannel = useCreateP2pChannel();

  const headerTitle = 'Find People';
  const [contact, setContact] = useState<Partial<ContactItemType>>({});

  const handleSearch = useDebounceCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();

    if (!value) {
      setContact({});
      setIsAdded(false);
      setIsSearch(false);
      return;
    }

    setIsSearch(true);

    const addressTrans = getAddressInfo(value.trim());
    if (!addressTrans?.address) {
      setContact({});
      setIsAdded(false);
      return;
    }

    try {
      const res = await im.service.getUserInfo({ address: addressTrans.address });

      if (res?.data?.portkeyId === userId) {
        message.error('Unable to add yourself as a contact');
      } else {
        setContact({
          ...res?.data,
          index: res?.data?.name?.substring(0, 1).toLocaleUpperCase(),
          name: res?.data?.name,
          imInfo: {
            relationId: res?.data.relationId,
            portkeyId: res?.data.portkeyId,
          },
        });
        setIsAdded(!!contactRelationIdMap?.[res?.data?.relationId]);
      }
    } catch (error) {
      const err = handleErrorMessage(error, 'handle display error');
      message.error(err);
      setContact({});
      setIsAdded(false);
    }
  }, []);

  const goBack = () => {
    if (state?.from === 'chat-search') {
      navigate('/chat-list-search', { state });
    } else {
      navigate(-1);
    }
  };

  const handleChat = useCallback(
    async (e: any, item: Partial<ContactItemType>) => {
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
          message.error('cannot chat');
        }
      }
    },
    [createChannel, isPrompt, navigate],
  );

  return isNotLessThan768 ? (
    <FindMorePrompt
      headerTitle={headerTitle}
      myPortkeyId={userId || ''}
      contact={contact}
      showChat={showChat}
      isAdded={isAdded}
      isSearch={isSearch}
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
      showChat={showChat}
      isAdded={isAdded}
      isSearch={isSearch}
      goBack={goBack}
      handleSearch={handleSearch}
      clickItem={() => {
        navigate('/setting/contacts/view', { state: contact });
      }}
      clickChat={(e, item) => handleChat(e, item)}
    />
  );
}
