import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { useProfileChat, useProfileCopy, useGoProfileEdit } from 'hooks/useProfile';
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
import { message } from 'antd';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import im from '@portkey-wallet/im';
import { ExtraTypeEnum, IProfileDetailDataProps } from 'types/Profile';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const dispatch = useAppCommonDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const showChat = useIsChatShow();
  const isMyContactFn = useIsMyContact();

  const relationId = useMemo(
    () => state?.relationId || state?.imInfo?.relationId,
    [state?.imInfo?.relationId, state?.relationId],
  );

  const { name, index } = useIndexAndName(state);

  // unified data structure
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

  useEffect(() => {
    const isMyContact = isMyContactFn({ relationId, contactId: state?.id });

    if (state?.id && isMyContact) {
      // ================== case one ==================
      // have contact id, get info from local map
      setData({ ...state, ...contactInfo });
    } else if (relationId && isMyContact) {
      // ================== case two ==================
      // Can chat, and is my contact, need to get full info from local map;
      // Because it jumped from the chat-box, the data is incomplete
      setData({ ...state, ...contactInfo });
    } else if (!isMyContact) {
      // ================== case three ==================
      // Can chat, and is stranger, need to get full info from remote db;
      // Because it jumped from the chat-box or find-more, the data is incomplete
      try {
        im.service.getProfile({ relationId: relationId }).then((res) => {
          setData({ ...state, ...res?.data });
        });
      } catch (error) {
        const err = handleErrorMessage(error, 'get profile error');
        message.error(err);
      }
    }

    // ================== case four ==================
    // default setData(state);
    // Cant chat (no relationId), display data directly
    // Because it jumped from contacts page only
  }, [contactInfo, isMyContactFn, relationId, state, state?.id]);

  const goBack = useCallback(() => {
    if (state?.from === 'new-chat') {
      navigate('/new-chat', { state });
    } else if (state?.from === 'chat-box') {
      navigate(`/chat-box/${state?.channelUuid}`);
    } else if (state?.from === 'chat-box-group') {
      navigate(`/chat-box-group/${state?.channelUuid}`);
    } else if (state?.from === 'chat-group-info') {
      navigate(`/chat-group-info/${state?.channelUuid}`);
    } else if (data?.from === 'chat-member-list') {
      navigate(`/chat-group-info/${state?.channelUuid}/member-list`, { state });
    } else {
      navigate('/setting/contacts');
    }
  }, [data?.from, navigate, state]);

  const handleEdit = useGoProfileEdit();
  const handleChat = useProfileChat();
  const handleCopy = useProfileCopy();

  const addStrangerApi = useAddStrangerContact();

  const handleAdd = useLockCallback(async () => {
    try {
      const res = await addStrangerApi(relationId);
      setData({ ...state, ...res?.data });

      setTimeout(() => {
        dispatch(fetchContactListAsync());
      }, REFRESH_DELAY_TIME);
    } catch (error) {
      const err = handleErrorMessage(error, 'add stranger error');
      message.error(err);
    }
  }, [addStrangerApi, dispatch, relationId, state]);

  const readImputationApi = useReadImputation();
  useEffect(() => {
    if (state?.isImputation && state?.from === 'contact-list') {
      // imputation from unread to read
      readImputationApi(state);

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
      handleCopy={handleCopy}
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
      handleCopy={handleCopy}
    />
  );
}
