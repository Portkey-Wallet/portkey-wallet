import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import { useProfileChat, useProfileCopy, useGoProfileEdit } from 'hooks/useProfile';
import CustomModal from 'pages/components/CustomModal';
import {
  REFRESH_DELAY_TIME,
  useGetProfile,
  useIsMyContact,
  useReadImputation,
} from '@portkey-wallet/hooks/hooks-ca/contact';
import { useAddStranger } from '@portkey-wallet/hooks/hooks-ca/im';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';
import { fetchContactListAsync } from '@portkey-wallet/store/store-ca/contact/actions';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
  const dispatch = useAppCommonDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMyContactFn = useIsMyContact();
  const { userId } = useWalletInfo();
  const getProfile = useGetProfile();
  const [data, setData] = useState(state);

  const title = t('Details');
  const editText = t('Edit');
  const chatText = t('Chat');
  const addedText = t('Added');
  const addContactText = t('Add Contact');
  const portkeyId = useMemo(
    () => data?.userId || (data?.portkeyId && data.portkeyId) || (data?.imInfo && data.imInfo?.portkeyId),
    [data.imInfo, data.portkeyId, data?.userId],
  );

  const relationId = useMemo(
    () => (data?.relationId && data.relationId) || (data?.imInfo && data.imInfo?.relationId),
    [data.imInfo, data.relationId],
  );

  useEffect(() => {
    const isMyContact = isMyContactFn({
      userId: portkeyId,
      relationId: relationId,
    });
    const isMy = portkeyId === userId;
    if (!isMy && !isMyContact) {
      // need fetch profile
      const res = getProfile({ id: data?.id, relationId: relationId });
      setData(res);
    }
  }, [
    getProfile,
    isMyContactFn,
    data?.id,
    data.imInfo.relationId,
    data.portkeyId,
    data.relationId,
    data.userId,
    userId,
    portkeyId,
    relationId,
  ]);

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

  const addStranger = useAddStranger();
  const handleAdd = async () => {
    try {
      const res = await addStranger(data?.imInfo?.relationId || data?.relationId);
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
      handleEdit={() => handleEdit(portkeyId ? '1' : '2', data)}
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
      handleEdit={() => handleEdit(portkeyId ? '1' : '2', data)}
      handleAdd={handleAdd}
      handleChat={() => handleChat(data)}
      handleCopy={handleCopy}
    />
  );
}
