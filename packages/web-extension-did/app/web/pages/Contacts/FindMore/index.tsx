import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import CustomModal from 'pages/components/CustomModal';
import { useCommonState } from 'store/Provider/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import FindMorePrompt from './Prompt';
import FindMorePopup from './Popup';
import { BaseHeaderProps } from 'types/UI';

export interface IFindMoreProps extends BaseHeaderProps {
  myPortkeyId: string;
  contactList: ContactItemType[];
  isMainnet: boolean;
  goBack: () => void;
  handleSearch: () => void;
  clickItem: (item: ContactItemType) => void;
  clickChat: (e: any, item: ContactItemType) => void;
}

export default function FindMore() {
  const navigate = useNavigate();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const isMainnet = useIsMainnet();

  const headerTitle = 'Find More';
  const cantAddYourselfText = 'Unable to add yourself as a contact';
  const [portkeyId, setPortkeyId] = useState('mock portkey id');
  const [contactList, setContactList] = useState([]);
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

  const goBack = () => {
    navigate(-1);
  };

  const handleChat = useCallback(
    (e: any, item: ContactItemType) => {
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
      myPortkeyId={portkeyId}
      contactList={contactList}
      isMainnet={isMainnet}
      goBack={goBack}
      handleSearch={() => {
        console.log('🌈 🌈 🌈 🌈 🌈 🌈 search', '');
      }}
      clickItem={(item) => {
        navigate('/setting/contacts/view', { state: item });
      }}
      clickChat={(e, item) => handleChat(e, item)}
    />
  ) : (
    <FindMorePopup
      headerTitle={headerTitle}
      myPortkeyId={portkeyId}
      contactList={contactList}
      isMainnet={isMainnet}
      goBack={goBack}
      handleSearch={() => {
        console.log('🌈 🌈 🌈 🌈 🌈 🌈 search', '');
      }}
      clickItem={(item) => {
        navigate('/setting/contacts/view', { state: item });
      }}
      clickChat={(e, item) => handleChat(e, item)}
    />
  );
}
