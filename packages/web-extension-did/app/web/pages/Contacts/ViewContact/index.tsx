import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import { useProfileChat, useProfileCopy, useGoProfileEdit } from 'hooks/useProfile';
import CustomModal from 'pages/components/CustomModal';
import {
  REFRESH_DELAY_TIME,
  useAddStrangerContact,
  useContactRelationIdMap,
  useIsMyContact,
  useReadImputation,
} from '@portkey-wallet/hooks/hooks-ca/contact';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import im from '@portkey-wallet/im';
import { useEffectOnce } from 'react-use';

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const dispatch = useAppCommonDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMyContactFn = useIsMyContact();
  const contactRelationIdMap = useContactRelationIdMap();

  // unified data structure
  const [data, setData] = useState({
    ...state,
    index: state?.index || state.name?.substring(0, 1).toLocaleUpperCase(),
    name: state.name,
    imInfo: {
      relationId: state?.portkeyId || state?.imInfo?.portkeyId,
      portkeyId: state?.relationId || state?.imInfo?.relationId,
    },
  });

  const title = t('Details');
  const editText = t('Edit');
  const chatText = t('Chat');
  const addedText = t('Added');
  const addContactText = t('Add Contact');

  useEffectOnce(() => {
    // ================== case one ==================
    // Cant chat (no relationId), display data directly
    // Because it jumped from contacts page only
    if (!data?.imInfo?.relationId) {
      setData(state);
    }

    // ================== case two ==================
    // Can chat, and is my contact, need to get full info from local map;
    // Because it jumped from the chat-box, the data is incomplete
    const isMyContact = isMyContactFn({
      userId: data?.imInfo?.portkeyId,
      relationId: data?.imInfo?.relationId,
    });
    if (data?.imInfo?.relationId && isMyContact) {
      const info = contactRelationIdMap?.[data?.imInfo?.relationId];
      setData(info);
    }

    // ================== case three ==================
    // Can chat, and is stranger, need to get full info from remote db;
    // Because it jumped from the chat-box or find-more, the data is incomplete
    if (!isMyContact) {
      try {
        im.service.getProfile({ id: data?.id, relationId: data?.imInfo?.relationId }).then((res) => {
          setData(res);
        });
      } catch (error) {
        const err = handleErrorMessage(error, 'get profile error');
        message.error(err);
      }
    }
  });

  const goBack = useCallback(() => {
    if (state?.from === 'new-chat') {
      navigate('/new-chat', { state });
    } else if (state?.from === 'chat-list') {
      navigate('/chat-list');
    } else {
      navigate('/setting/contacts');
    }
  }, [navigate, state]);

  const handleEdit = useGoProfileEdit();
  const handleChat = useProfileChat();
  const handleCopy = useProfileCopy();

  const addStrangerApi = useAddStrangerContact();
  const handleAdd = async () => {
    try {
      const res = await addStrangerApi(data?.imInfo?.relationId || data?.relationId);
      setData(res.data);

      setTimeout(() => {
        dispatch(fetchContactListAsync());
      }, REFRESH_DELAY_TIME);
    } catch (error) {
      const err = handleErrorMessage(error, 'add stranger error');
      message.error(err);
    }
  };

  const readImputationApi = useReadImputation();
  useEffect(() => {
    if (data?.isImputation) {
      // imputation from unread to read
      readImputationApi(data);

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
  }, [readImputationApi, data]);

  return isNotLessThan768 ? (
    <ViewContactPrompt
      headerTitle={title}
      editText={editText}
      chatText={chatText}
      addedText={addedText}
      addContactText={addContactText}
      data={data}
      goBack={goBack}
      handleEdit={() => handleEdit(data?.imInfo?.portkeyId ? '1' : '2', data)}
      handleAdd={handleAdd}
      handleChat={() => handleChat(data)}
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
      handleEdit={() => handleEdit(data?.imInfo?.portkeyId ? '1' : '2', data)}
      handleAdd={handleAdd}
      handleChat={() => handleChat(data)}
      handleCopy={handleCopy}
    />
  );
}
