import CommonHeader from 'components/CommonHeader';
import { IContactsProps } from '..';
import ContactsBody from '../components/ContactsBody';
import ContactsSearchInput from '../components/ContactsSearchInput';
import './index.less';
import ImputationTip from '../components/ImputationTip';

export default function ContactsPopup({
  headerTitle,
  goBack,
  searchPlaceholder,
  handleAdd,
  isSearch,
  handleSearch,
  list,
  contactCount,
  initData,
  showImputation = false,
  closeImputationTip,
  changeTab,
}: IContactsProps) {
  return (
    <div className="flex-column contacts-popup min-width-max-height">
      <div className="flex-column">
        <CommonHeader
          title={headerTitle}
          onLeftBack={goBack}
          rightElementList={
            contactCount !== 0 || (contactCount === 0 && isSearch)
              ? [
                  {
                    customSvgType: 'SuggestAdd',
                    onClick: handleAdd,
                  },
                ]
              : undefined
          }
        />
        <ContactsSearchInput placeholder={searchPlaceholder} handleChange={handleSearch} />
      </div>
      {showImputation && <ImputationTip closeTip={closeImputationTip} />}
      <ContactsBody
        isSearch={isSearch}
        list={list}
        contactCount={contactCount}
        initData={initData}
        changeTab={changeTab}
      />
    </div>
  );
}
