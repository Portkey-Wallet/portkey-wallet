import ViewContactPrompt from './Prompt';
import ViewContactPopup from './Popup';
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useCallback, useEffect, useState } from 'react';
import { useCommonState, useWalletInfo } from 'store/Provider/hooks';
import { useProfileChat, useProfileCopy, useGoProfileEdit } from 'hooks/useProfile';
import CustomModal from 'pages/components/CustomModal';
import { useGetProfile, useIsMyContact, useReadImputation } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useAddStranger } from '@portkey-wallet/hooks/hooks-ca/im';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { message } from 'antd';

export default function ViewContact() {
  const { isNotLessThan768 } = useCommonState();
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

  useEffect(() => {
    const isMyContact = isMyContactFn({
      userId: data?.userId || data?.portkeyId,
      relationId: data?.relationId || data?.imInfo?.relationId,
    });
    const isMy = (data?.portkeyId && data.portkeyId === userId) || (data?.userId && data.userId === userId);
    if (!isMy && !isMyContact) {
      // need fetch profile
      const res = getProfile({ id: data?.id, relationId: data?.relationId || data?.imInfo?.relationId });
      console.log('🌈 🌈 🌈 🌈 🌈 🌈 need fetch profile', res);
    }
  }, [
    getProfile,
    isMyContactFn,
    data?.id,
    data?.imInfo?.relationId,
    data.portkeyId,
    data?.relationId,
    data.userId,
    userId,
  ]);

  const goBack = useCallback(() => {
    navigate('/setting/contacts');
  }, [navigate]);

  const handleEdit = useGoProfileEdit();
  const handleChat = useProfileChat();
  const handleCopy = useProfileCopy();

  const addStranger = useAddStranger();
  const handleAdd = async () => {
    try {
      const res = await addStranger(data?.imInfo?.relationId || data?.relationId);
      console.log('🌈 🌈 🌈 🌈 🌈 🌈 res', res);
      setData(res.data);
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

  // TODO btn show logic
  return isNotLessThan768 ? (
    <ViewContactPrompt
      headerTitle={title}
      editText={editText}
      chatText={chatText}
      addedText={addedText}
      addContactText={addContactText}
      data={data}
      goBack={goBack}
      handleEdit={() => handleEdit('1', data)} // TODO add or edit 1 2
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
      handleEdit={() => handleEdit('1', data)} // TODO add or edit 1 2
      handleAdd={handleAdd}
      handleChat={() => handleChat(data)}
      handleCopy={handleCopy}
    />
  );
}
