import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import './index.less';

export default function NoContacts({ initData }: { initData: Partial<ContactItemType> }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex-column no-contacts">
      <CustomSvg type="AddressBook" className="no-contact-svg" />
      <p className="title">{t('No Contacts')}</p>
      <p className="desc">{t("Contacts you've added will appear here")}</p>
      <Button
        className="flex-row-center add-button"
        type="text"
        onClick={() => {
          navigate('/setting/contacts/add', { state: initData });
        }}>
        <CustomSvg type="Plus" className="plug-svg" /> {t('Add New Contact')}
      </Button>
    </div>
  );
}
