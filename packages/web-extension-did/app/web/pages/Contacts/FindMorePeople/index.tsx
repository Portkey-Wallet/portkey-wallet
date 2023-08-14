import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import CustomModal from 'pages/components/CustomModal';
import { useCommonState } from 'store/Provider/hooks';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import FindMorePeoplePrompt from './Prompt';
import FindMorePeoplePopup from './Popup';
import { BaseHeaderProps } from 'types/UI';

export interface IFindMorePeopleProps extends BaseHeaderProps {
  myPortkeyId: string;
  contactList: ContactItemType[];
  isMainnet: boolean;
  goBack: () => void;
  handleSearch: () => void;
  clickItem: (item: ContactItemType) => void;
  clickChat: (e: any, item: ContactItemType) => void;
}

export default function FindMorePeople() {
  const navigate = useNavigate();
  const { isPrompt, isNotLessThan768 } = useCommonState();
  const isMainnet = useIsMainnet();
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
    <FindMorePeoplePrompt
      headerTitle={'Find More People'}
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
    <FindMorePeoplePopup
      headerTitle={'Find More People'}
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

// <div className="find-more-people-frame">
//   <div className="flex-column find-more-people-top">
//     <SecondPageHeader
//       className="find-more-people-header"
//       paddingLeft={12}
//       title="Find More People"
//       leftCallBack={goBack}
//     />
//     <ContactsSearchInput
//       className="find-more-people-search"
//       placeholder="Portkey ID/Address"
//       handleChange={function (): void {
//         console.log('🌈 🌈 🌈 🌈 🌈 🌈 search', '');
//       }}
//     />
//     <div className="find-more-people-id">My Portkey ID: {portkeyId}</div>
//   </div>
//   <div className="find-more-people-body">
//     {contactList && contactList.length > 0 && (
//       <ContactList
//         list={contactList}
//         hasChatEntry={isMainnet}
//         clickItem={(item) => {
//           navigate('/setting/contacts/view', { state: item });
//         }}
//         clickChat={(e, item) => handleChat(e, item)}
//       />
//     )}
//   </div>
// </div>
