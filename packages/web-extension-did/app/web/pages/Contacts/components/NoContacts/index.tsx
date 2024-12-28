import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import './index.less';
import { useGoAddNewContact } from 'hooks/useProfile';
import { ContactHandleActionTypeEnum } from 'types/Profile';

export default function NoContacts() {
  const { t } = useTranslation();
  const handleAdd = useGoAddNewContact();

  return (
    <div className="flex-column no-contacts">
      <p className="title">{t('No Contacts')}</p>
      <p className="desc">{t("Contacts you've added will appear here")}</p>
      <Button
        className="flex-row-center add-button"
        type="text"
        onClick={() => handleAdd(ContactHandleActionTypeEnum.ADD_CONTACT)}>
        <CustomSvg type="Plus" className="plug-svg" /> {t('Add New Contact')}
      </Button>
    </div>
  );
}
