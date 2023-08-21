import { Button } from 'antd';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { IProfileDetailBodyProps } from 'types/Profile';
import IdAndAddress from '../IdAndAddress';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useIsMyContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { useState, useEffect } from 'react';

export default function ViewContactBody({
  data,
  editText = 'Edit',
  chatText = 'Chat',
  addedText = 'Added',
  addContactText = 'Add Contact',
  isShowRemark = true,
  isShowAddContactBtn = true,
  isShowAddedBtn = true,
  isShowChatBtn = true,
  handleEdit,
  handleChat,
  handleAdd,
  handleCopy,
}: IProfileDetailBodyProps) {
  const isMyContactFn = useIsMyContact();
  const isMainnet = useIsMainnet();

  const [isMyContact, setIsMyContact] = useState(false);

  useEffect(() => {
    setIsMyContact(isMyContactFn({ userId: data?.userId, relationId: data?.relationId }));
  }, [data?.relationId, data?.userId, isMyContactFn]);

  return (
    <div className="flex-column-between view-contact-body">
      <div className="view-contact-body-main">
        <div className="info-section name-section">
          <div className="flex-center name-index">{data.index}</div>
          <div className="name">{data?.walletName || data?.caHolderInfo?.walletName || ''}</div>

          {/* Section - Remark */}
          {isShowRemark && (
            <div className="remark">
              <span>{`Remark: `}</span>
              <span>{data?.name || 'No set'}</span>
            </div>
          )}
          {!isShowRemark && !isShowAddContactBtn && !isShowAddedBtn && !isShowChatBtn && (
            <div className="empty-placeholder-8"></div>
          )}
          {isShowRemark && (isShowAddContactBtn || isShowAddedBtn || isShowChatBtn) && (
            <div className="empty-placeholder-24"></div>
          )}

          {/* Section - Action: Added | Add Contact | Chat */}
          <div className="flex-center action">
            {isShowAddedBtn && isMyContact && (
              <div className="flex-column-center action-item added-contact">
                <CustomSvg type="ContactAdded" />
                <span>{addedText}</span>
              </div>
            )}
            {isShowAddContactBtn && !isMyContact && (
              <div className="flex-column-center action-item add-contact" onClick={handleAdd}>
                <CustomSvg type="ContactAdd" />
                <span>{addContactText}</span>
              </div>
            )}
            {isShowChatBtn && isMainnet && data.userId && (
              <div className="flex-column-center action-item chat-contact" onClick={handleChat}>
                <CustomSvg type="ContactChat" />
                <span>{chatText}</span>
              </div>
            )}
          </div>
        </div>

        <IdAndAddress
          portkeyId={data?.userId || ''}
          relationId={data?.userId || ''}
          addresses={data?.addresses || []}
          handleCopy={handleCopy}
        />
      </div>

      {/* TODO No edit button for strangers */}
      <div className="footer">
        <Button type="primary" htmlType="submit" className="edit-btn" onClick={handleEdit}>
          {editText}
        </Button>
      </div>
    </div>
  );
}
