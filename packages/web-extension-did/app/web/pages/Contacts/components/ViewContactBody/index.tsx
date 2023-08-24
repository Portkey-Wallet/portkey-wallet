import { Button } from 'antd';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { IProfileDetailBodyProps } from 'types/Profile';
import IdAndAddress from '../IdAndAddress';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCheckIsStranger } from '@portkey-wallet/hooks/hooks-ca/im';
import { useEffect, useState } from 'react';

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
  const isStrangerFn = useCheckIsStranger();
  const showChat = useIsChatShow();

  const [isStranger, setIsStranger] = useState(false);

  useEffect(() => {
    setIsStranger(isStrangerFn(data?.imInfo?.relationId || data?.relationId || ''));
  }, [data, isStrangerFn]);

  return (
    <div className="flex-column-between view-contact-body">
      <div className="view-contact-body-main">
        <div className="info-section name-section">
          <div className="flex-center name-index">{data?.index}</div>
          <div className="name">{data?.walletName || data?.caHolderInfo?.walletName || ''}</div>

          {/* Section - Remark */}
          {isShowRemark && (
            <div className="remark">
              <span>{`Remark: `}</span>
              <span>{data?.name || 'No set'}</span>
            </div>
          )}
          {!data.id && !(!data.id && isStranger) && <div className="empty-placeholder-8"></div>}
          {isShowRemark && (data.id || (!data.id && isStranger)) && <div className="empty-placeholder-24"></div>}

          {/* Section - Action: Added | Add Contact | Chat */}
          <div className="flex-center action">
            {data.id && (
              <div className="flex-column-center action-item added-contact">
                <CustomSvg type="ContactAdded" />
                <span>{addedText}</span>
              </div>
            )}
            {data.id && showChat && (
              <div className="flex-column-center action-item chat-contact" onClick={handleChat}>
                <CustomSvg type="ContactChat" />
                <span>{chatText}</span>
              </div>
            )}

            {/* cant chat */}
            {!data.id && isStranger && (
              <div className="flex-column-center action-item add-contact" onClick={handleAdd}>
                <CustomSvg type="ContactAdd" />
                <span>{addContactText}</span>
              </div>
            )}
          </div>
        </div>

        <IdAndAddress
          portkeyId={data?.caHolderInfo?.userId}
          relationId={data?.relationId || ''}
          addresses={data?.addresses || []}
          handleCopy={handleCopy}
          addressSectionLabel={isStranger ? 'Address' : 'DID'}
        />
      </div>

      {/* stranger cant edit */}
      {(data.id || !isStranger || data?.from === 'my-did') && (
        <div className="footer">
          <Button type="primary" htmlType="submit" className="edit-btn" onClick={handleEdit}>
            {editText}
          </Button>
        </div>
      )}
    </div>
  );
}
