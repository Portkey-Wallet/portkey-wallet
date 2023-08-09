import { useState } from 'react';
import ContactsSearchInput from '../components/ContactsSearchInput';
import SecondPageHeader from 'pages/components/SecondPageHeader';
import { useNavigate } from 'react-router';
import './index.less';

export default function FindMorePeople() {
  const navigate = useNavigate();
  const [portkeyId, setPortkeyId] = useState('mock portkey id');

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="find-more-people-frame">
      <div className="flex-column">
        <SecondPageHeader
          className="find-more-people-header"
          paddingLeft={12}
          title="Find More People"
          leftCallBack={goBack}
        />
        <ContactsSearchInput
          className="find-more-people-search"
          placeholder="Address/Portkey ID"
          handleChange={function (): void {
            console.log('🌈 🌈 🌈 🌈 🌈 🌈 search', '');
          }}
        />
      </div>
      <div className="find-more-people-body">
        <div>My Portkey ID: {portkeyId}</div>
        <div>Recommend</div>
      </div>
    </div>
  );
}
