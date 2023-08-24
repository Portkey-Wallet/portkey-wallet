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
  useContactRelationIdMap,
  useReadImputation,
} from '@portkey-wallet/hooks/hooks-ca/contact';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import im from '@portkey-wallet/im';
import { useCheckIsStranger } from '@portkey-wallet/hooks/hooks-ca/im';

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const dispatch = useAppCommonDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isStrangerFn = useCheckIsStranger();
  const contactRelationIdMap = useContactRelationIdMap();

  const relationId = useMemo(
    () => state?.relationId || state?.imInfo?.relationId,
    [state?.imInfo?.relationId, state?.relationId],
  );

  // unified data structure
  const [data, setData] = useState({
    ...state,
    index: state?.index || state.name?.substring(0, 1).toLocaleUpperCase(),
    name: state.name,
    imInfo: {
      portkeyId: state?.portkeyId || state?.imInfo?.portkeyId,
      relationId: state?.relationId || state?.imInfo?.relationId,
    },
  });
  // const [data, setData] = useState(state);

  const title = t('Details');
  const editText = t('Edit');
  const chatText = t('Chat');
  const addedText = t('Added');
  const addContactText = t('Add Contact');

  useEffect(() => {
    // ================== case one ==================
    // Cant chat (no relationId), display data directly
    // Because it jumped from contacts page only
    if (!relationId) {
      setData(state);
    }

    // ================== case two ==================
    // Can chat, and is my contact, need to get full info from local map;
    // Because it jumped from the chat-box, the data is incomplete
    const isStranger = isStrangerFn(relationId);
    if (relationId && !isStranger) {
      const info = contactRelationIdMap?.[relationId];
      setData(info?.[0]);
    }

    // ================== case three ==================
    // Can chat, and is stranger, need to get full info from remote db;
    // Because it jumped from the chat-box or find-more, the data is incomplete
    if (isStranger) {
      try {
        im.service.getProfile({ id: state?.id, relationId: relationId }).then((res) => {
          setData(res);
        });
      } catch (error) {
        const err = handleErrorMessage(error, 'get profile error');
        message.error(err);
      }
    }
  }, [contactRelationIdMap, isStrangerFn, relationId, state]);

  const goBack = useCallback(() => {
    if (state?.from === 'new-chat') {
      navigate('/new-chat', { state });
    } else if (state?.from === 'chat-box') {
      navigate(-1);
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
      const res = await addStrangerApi(relationId);
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
    if (state?.isImputation) {
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
      handleEdit={() => handleEdit(relationId ? '1' : '2', data)}
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
      handleEdit={() => handleEdit(relationId ? '1' : '2', data)}
      handleAdd={handleAdd}
      handleChat={() => handleChat(data)}
      handleCopy={handleCopy}
    />
  );
}
