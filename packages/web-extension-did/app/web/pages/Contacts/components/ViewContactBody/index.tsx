import { Button } from 'antd';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { IProfileDetailBodyProps } from 'types/Profile';
import IdAndAddress from '../IdAndAddress';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useEffect, useMemo, useState } from 'react';
import { useIndexAndName, useIsMyContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import LoginAccountList from '../LoginAccountList';
import Avatar from 'pages/components/Avatar';

export default function ViewContactBody({
  data,
  editText = 'Edit',
  chatText = 'Chat',
  addedText = 'Added',
  addContactText = 'Add Contact',
  isShowRemark = true,
  handleEdit,
  handleChat,
  handleAdd,
  handleCopy,
}: IProfileDetailBodyProps) {
  const isMyContactFn = useIsMyContact();
  const showChat = useIsChatShow();
  const relationId = useMemo(
    () => data.imInfo?.relationId || data.relationId || '',
    [data.imInfo?.relationId, data.relationId],
  );
  const { name, index } = useIndexAndName(data as Partial<ContactItemType>);
  const transName = useMemo(() => {
    if (showChat) {
      return data?.caHolderInfo?.walletName || data?.imInfo?.name || data?.name;
    } else {
      return name;
    }
  }, [data?.caHolderInfo?.walletName, data?.imInfo?.name, data?.name, name, showChat]);

  const [isMyContact, setIsMyContact] = useState(true);

  useEffect(() => {
    setIsMyContact(isMyContactFn({ relationId, contactId: data?.id }));
  }, [data, isMyContactFn, relationId]);

  return (
    <div className="flex-column-between view-contact-body">
      <div className="view-contact-body-main">
        <div className="info-section name-section">
          <Avatar avatarUrl={data?.avatar} nameIndex={index} size="large" />
          <div className="name">{transName}</div>

          {/* Section - Remark */}
          {showChat && relationId && isMyContact && isShowRemark && (
            <div className="remark">
              <span>{`Remark: `}</span>
              <span>{data?.name || 'Not set'}</span>
            </div>
          )}

          {/* empty-placeholder */}
          {!data.id && !(!data.id && !isMyContact) && <div className="empty-placeholder-8"></div>}
          {((isShowRemark && (data.id || (!data.id && !isMyContact))) || data?.from === 'my-did') && (
            <div className="empty-placeholder-24"></div>
          )}

          {/* Section - Action: Added | Add Contact | Chat */}
          {showChat && data?.from !== 'my-did' && relationId && (
            <div className="flex-center action">
              {data.id && isMyContact && (
                <div className="flex-column-center action-item added-contact">
                  <CustomSvg type="ContactAdded" />
                  <span>{addedText}</span>
                </div>
              )}

              {(!data.id || !isMyContact) && (
                <div className="flex-column-center action-item add-contact" onClick={handleAdd}>
                  <CustomSvg type="ContactAdd" />
                  <span>{addContactText}</span>
                </div>
              )}

              <div className="flex-column-center action-item chat-contact" onClick={handleChat}>
                <CustomSvg type="ContactChat" />
                <span>{chatText}</span>
              </div>
            </div>
          )}
        </div>

        <IdAndAddress
          portkeyId={data?.caHolderInfo?.userId}
          relationId={relationId}
          addresses={data?.addresses || []}
          handleCopy={handleCopy}
          addressSectionLabel="Address"
        />

        {/* login account info */}
        <LoginAccountList
          Email={data?.loginAccountMap?.Email}
          Phone={data?.loginAccountMap?.Phone}
          Google={data?.loginAccountMap?.Google}
          Apple={data?.loginAccountMap?.Apple}
        />
      </div>

      {/* stranger cant edit */}
      {(data.id || isMyContact || data?.from === 'my-did') && (
        <div className="footer">
          <Button type="primary" htmlType="submit" className="edit-btn" onClick={handleEdit}>
            {editText}
          </Button>
        </div>
      )}
    </div>
  );
}
