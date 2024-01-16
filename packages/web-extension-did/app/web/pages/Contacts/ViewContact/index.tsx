import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { useProfileChat, useGoProfileEdit } from 'hooks/useProfile';
import CustomModal from 'pages/components/CustomModal';
import {
  REFRESH_DELAY_TIME,
  useAddStrangerContact,
  useContactInfo,
  useIndexAndName,
  useIsMyContact,
  useReadImputation,
} from '@portkey-wallet/hooks/hooks-ca/contact';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import im from '@portkey-wallet/im';
import { ExtraTypeEnum, IProfileDetailDataProps } from 'types/Profile';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { LoginType } from '@portkey-wallet/types/types-ca/wallet';
import { ILoginAccountListProps } from '../components/LoginAccountList';
import { EditContactItemApiType, IContactProfileLoginAccount } from '@portkey-wallet/types/types-ca/contact';

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const dispatch = useAppCommonDispatch();
  const { state } = useLocation(); // TViewContactLocationState
  const navigate = useNavigate();
  const { t } = useTranslation();
  const showChat = useIsChatShow();
  const isMyContactFn = useIsMyContact();

  const relationId = useMemo(
    () => state?.relationId || state?.imInfo?.relationId,
    [state?.imInfo?.relationId, state?.relationId],
  );

  const { name, index } = useIndexAndName(state);

  const [data, setData] = useState<IProfileDetailDataProps>({
    ...state,
    id: state?.id,
    index: index,
    name: name,
    imInfo: {
      portkeyId: state?.portkeyId || state?.imInfo?.portkeyId,
      relationId: state?.relationId || state?.imInfo?.relationId,
    },
  });
  const contactInfo = useContactInfo({ contactId: state?.id, relationId: relationId });

  const title = t('Details');
  const editText = t('Edit');
  const chatText = t('Chat');
  const addedText = t('Added');
  const addContactText = t('Add Contact');

  const genLoginAccountMap = useCallback((loginAccounts: IContactProfileLoginAccount[]) => {
    const loginAccountMap: ILoginAccountListProps = {
      Phone: [],
      Email: [],
      Google: [],
      Apple: [],
      Telegram: [],
    };

    loginAccounts?.forEach((element) => {
      switch (element.privacyType) {
        case LoginType.Phone:
          loginAccountMap.Phone.push(element);
          break;
        case LoginType.Email:
          loginAccountMap.Email.push(element);
          break;
        case LoginType.Google:
          loginAccountMap.Google.push(element);
          break;
        case LoginType.Apple:
          loginAccountMap.Apple.push(element);
          break;
        case LoginType.Telegram:
          loginAccountMap.Telegram.push(element);
          break;
        default:
          break;
      }
    });
    return loginAccountMap;
  }, []);

  useEffect(() => {
    im.service
      .getProfile({
        id: state?.id || undefined,
        portkeyId: data?.imInfo?.portkeyId || undefined,
        relationId: relationId || undefined,
      })
      .then((res) => {
        const loginAccountMap = genLoginAccountMap(res.data.loginAccounts || []);
        setData({ ...state, ...res?.data, loginAccountMap });
      });
  }, [contactInfo, data.imInfo?.portkeyId, genLoginAccountMap, isMyContactFn, relationId, state, state.id]);

  const goBack = useCallback(() => {
    switch (state?.previousPage) {
      case 'new-chat':
        navigate('/new-chat', { state });
        break;
      case 'chat-box':
        navigate(`/chat-box/${state?.channelUuid}`);
        break;
      case 'chat-box-group':
        navigate(`/chat-box-group/${state?.channelUuid}`);
        break;
      case 'chat-group-info':
        navigate(`/chat-group-info/${state?.channelUuid}`);
        break;
      case 'chat-member-list':
        navigate(`/chat-group-info/${state?.channelUuid}/member-list`, { state });
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
  const handleChat = useProfileChat();

  const addStrangerApi = useAddStrangerContact();

  const handleAdd = useLockCallback(async () => {
    try {
      const res = await addStrangerApi(relationId || '');
      setData({ ...state, ...res?.data });

      setTimeout(() => {
        dispatch(fetchContactListAsync());
      }, REFRESH_DELAY_TIME);
    } catch (error) {
      const err = handleErrorMessage(error, 'add stranger error');
      singleMessage.error(err);
    }
  }, [addStrangerApi, dispatch, relationId, state]);

  const readImputationApi = useReadImputation();
  useEffect(() => {
    if (state?.isImputation && state?.previousPage === 'contact-list') {
      // imputation from unread to read
      readImputationApi(state as EditContactItemApiType);

      CustomModal({
        content: (
          <div>
            <div className="auto-update-title">{`Auto Updates`}</div>
            <div>
              {'Portkey has grouped contacts with the same Portkey ID into one and removed duplicate contacts.'}
            </div>
          </div>
        ),
        okText: 'OK',
      });
    }
  }, [readImputationApi, state]);

  return isNotLessThan768 ? (
    <ViewContactPrompt
      headerTitle={title}
      editText={editText}
      chatText={chatText}
      addedText={addedText}
      addContactText={addContactText}
      data={data}
      goBack={goBack}
      handleEdit={() => handleEdit(showChat && relationId ? ExtraTypeEnum.CAN_CHAT : ExtraTypeEnum.CANT_CHAT, data)}
      handleAdd={handleAdd}
      handleChat={() => handleChat(data?.imInfo?.relationId || '')}
    />
  ) : (
    <ViewContactPopup
      headerTitle={title}
      editText={editText}
      chatText={chatText}
      addedText={addedText}
      addContactText={addContactText}
      data={data}
      goBack={goBack}
      handleEdit={() => handleEdit(showChat && relationId ? ExtraTypeEnum.CAN_CHAT : ExtraTypeEnum.CANT_CHAT, data)}
      handleAdd={handleAdd}
      handleChat={() => handleChat(data?.imInfo?.relationId || '')}
    />
  );
}
