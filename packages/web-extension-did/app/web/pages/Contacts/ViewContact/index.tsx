import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { REFRESH_DELAY_TIME, useAddContact, useIndexAndName } from '@portkey-wallet/hooks/hooks-ca/contactNew';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { ContactHandleActionTypeEnum } from 'types/Profile';
import { ILoginAccountListProps } from '../components/LoginAccountList';
import {
  ContactItemType,
  EditContactItemApiType,
  IContactProfileLoginAccount,
} from '@portkey-wallet/types/types-ca/contact';
import CustomSvg from 'components/CustomSvg';
import CustomModalConfirm from 'pages/components/CustomModalConfirm';
import clsx from 'clsx';
import { useGoProfileEdit } from 'hooks/useProfile';

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const dispatch = useAppCommonDispatch();
  const { state } = useLocation(); // TViewContactLocationState
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { index } = useIndexAndName(state);

  const goBack = useCallback(() => {
    switch (state?.previousPage) {
      case 'new-chat':
        navigate('/new-chat', { state });
        break;

      case 'contact-list':
        navigate('/setting/contacts');
        break;

      default:
        navigate(-1);
        break;
    }
  }, [navigate, state]);

  const handleEdit = useGoProfileEdit();

  return isNotLessThan768 ? (
    <ViewContactPrompt
      headerTitle="Address Detail"
      data={state}
      goBack={goBack}
      handleEdit={() => handleEdit(ContactHandleActionTypeEnum.ADD_CONTACT, state)}
    />
  ) : (
    <ViewContactPopup
      headerTitle="Address Detail"
      data={state}
      goBack={goBack}
      handleEdit={() => handleEdit(ContactHandleActionTypeEnum.ADD_CONTACT, state)}
    />
  );
}
