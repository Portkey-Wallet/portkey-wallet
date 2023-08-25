import { Button } from 'antd';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { IProfileDetailBodyProps } from 'types/Profile';
import IdAndAddress from '../IdAndAddress';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useEffect, useMemo, useState } from 'react';
import { useIsMyContact } from '@portkey-wallet/hooks/hooks-ca/contact';

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

  const name = useMemo(
    () => data?.name || data?.caHolderInfo?.walletName || data?.imInfo?.name || '',
    [data?.caHolderInfo?.walletName, data?.imInfo?.name, data?.name],
  );
  const index = useMemo(() => name?.substring(0, 1).toLocaleUpperCase(), [name]);

  const [isMyContact, setIsMyContact] = useState(true);

  useEffect(() => {
    setIsMyContact(
      isMyContactFn({ relationId: data?.imInfo?.relationId || data?.relationId || '', contactId: data?.id }),
    );
  }, [data, isMyContactFn]);

  return (
    <div className="flex-column-between view-contact-body">
      <div className="view-contact-body-main">
        <div className="info-section name-section">
          <div className="flex-center name-index">{index}</div>
          <div className="name">{name}</div>

          {/* Section - Remark */}
          {isShowRemark && (
            <div className="remark">
              <span>{`Remark: `}</span>
              <span>{data?.name || 'No set'}</span>
            </div>
          )}

          {/* empty-placeholder */}
          {!data.id && !(!data.id && !isMyContact) && <div className="empty-placeholder-8"></div>}
          {((isShowRemark && (data.id || (!data.id && !isMyContact))) || data?.from === 'my-did') && (
            <div className="empty-placeholder-24"></div>
          )}

          {/* Section - Action: Added | Add Contact | Chat */}
          {showChat && data?.from !== 'my-did' && (
            <div className="flex-center action">
              {data.id && isMyContact && (
                <div className="flex-column-center action-item added-contact">
                  <CustomSvg type="ContactAdded" />
                  <span>{addedText}</span>
                </div>
              )}
              {data.id && isMyContact && (
                <div className="flex-column-center action-item chat-contact" onClick={handleChat}>
                  <CustomSvg type="ContactChat" />
                  <span>{chatText}</span>
                </div>
              )}

              {/* cant chat */}
              {(!data.id || !isMyContact) && (
                <div className="flex-column-center action-item add-contact" onClick={handleAdd}>
                  <CustomSvg type="ContactAdd" />
                  <span>{addContactText}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <IdAndAddress
          portkeyId={data?.caHolderInfo?.userId}
          relationId={data?.relationId || ''}
          addresses={data?.addresses || []}
          handleCopy={handleCopy}
          addressSectionLabel={!isMyContact ? 'Address' : 'DID'}
        />
      </div>

      {/* stranger cant edit */}
      {(!data.id || isMyContact || data?.from === 'my-did') && (
        <div className="footer">
          <Button type="primary" htmlType="submit" className="edit-btn" onClick={handleEdit}>
            {editText}
          </Button>
        </div>
      )}
    </div>
  );
}
