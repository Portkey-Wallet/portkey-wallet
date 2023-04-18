import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { useCallback } from 'react';
import { BaseHeaderProps } from 'types/UI';
import { useCommonState } from 'store/Provider/hooks';

export interface IViewContactProps extends BaseHeaderProps {
  data: { name: string; index: string; addresses: AddressItem[] };
  editText: string;
  handleEdit: () => void;
}

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const title = t('Contacts');
  const editText = t('Edit');

  const goBack = useCallback(() => {
    navigate('/setting/contacts');
  }, [navigate]);

  const handleEdit = useCallback(() => {
    navigate('/setting/contacts/edit', { state: state });
  }, [navigate, state]);

  return isNotLessThan768 ? (
    <ViewContactPrompt headerTitle={title} editText={editText} data={state} goBack={goBack} handleEdit={handleEdit} />
  ) : (
    <ViewContactPopup headerTitle={title} editText={editText} data={state} goBack={goBack} handleEdit={handleEdit} />
  );
}
