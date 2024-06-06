import { Button, Popover } from 'antd';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { IProfileDetailBodyProps } from 'types/Profile';
import IdAndAddress from '../IdAndAddress';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIndexAndName, useIsMyContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import LoginAccountList from '../LoginAccountList';
import Avatar from 'pages/components/Avatar';
import { useNavigate } from 'react-router';
import { PopoverMenuList } from '@portkey-wallet/im-ui-web';
import { useBlockAndReport } from '@portkey-wallet/hooks/hooks-ca/im';
import clsx from 'clsx';

export default function ViewContactBody({
  data,
  editText = 'Edit',
  chatText = 'Chat',
  addedText = 'Added',
  addContactText = 'Add Contact',
  isShowRemark = true,
  morePopListData,
  handleEdit,
  handleChat,
  handleAdd,
}: IProfileDetailBodyProps) {
  const navigate = useNavigate();
  const isMyContactFn = useIsMyContact();
  const [popVisible, setPopVisible] = useState(false);
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
  const { isBlocked } = useBlockAndReport(relationId);
  useEffect(() => {
    setIsMyContact(isMyContactFn({ relationId, contactId: data?.id }));
  }, [data, isMyContactFn, relationId]);

  const hidePop = useCallback((e: Event) => {
    try {
      const _target = e?.target as Element;
      const _className = _target?.className;
      const isFunc = _className.includes instanceof Function;
      if (isFunc && !_className.includes('contact-operation-more')) {
        setPopVisible(false);
      }
    } catch (e) {
      console.log('===contact-operation-more hidePop error', e);
    }
  }, []);
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  return (
    <div className="flex-column-between view-contact-body">
      <div className="view-contact-body-main">
        <div className="info-section name-section">
          <Avatar avatarUrl={data?.avatar} nameIndex={index} size="large" />
          <div className="name">{transName}</div>
          {data?.previousPage === 'my-did' && (
            <CustomSvg type="QRCode2" onClick={() => navigate('/setting/wallet/qrcode')} />
          )}

          {/* Section - Remark */}
          {showChat && relationId && isMyContact && isShowRemark && (
            <div className="remark">
              <span>{`Remark: `}</span>
              <span>{data?.name || 'Not set'}</span>
            </div>
          )}

          {/* empty-placeholder */}
          {!data.id && !(!data.id && !isMyContact) && <div className="empty-placeholder-8"></div>}
          {((isShowRemark && (data.id || (!data.id && !isMyContact))) || data?.previousPage === 'my-did') && (
            <div className="empty-placeholder-24"></div>
          )}

          {/* Section - Action: Added | Add Contact | Chat */}
          {showChat && data?.previousPage !== 'my-did' && relationId && (
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

              <div
                className={clsx('flex-column-center', ' action-item', isBlocked ? 'no-chat-contact' : 'chat-contact')}
                onClick={handleChat}>
                <CustomSvg type={isBlocked ? 'ContactNoChat' : 'ContactChat'} />
                <span>{chatText}</span>
              </div>

              {morePopListData?.length !== 0 && (
                <Popover
                  className="action-item"
                  overlayClassName="portkey-chat-contact-popover"
                  placement="bottom"
                  trigger="click"
                  open={popVisible}
                  showArrow={false}
                  content={<PopoverMenuList data={morePopListData} />}>
                  <div className="flex-column-center contact-operation-more" onClick={() => setPopVisible(!popVisible)}>
                    <CustomSvg type="More2" />
                    <span>More</span>
                  </div>
                </Popover>
              )}
            </div>
          )}
        </div>

        <IdAndAddress
          portkeyId={data?.caHolderInfo?.userId}
          relationId={relationId}
          addresses={data?.addresses || []}
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
      {(data.id || isMyContact || data?.previousPage === 'my-did') && (
        <div className="footer">
          <Button type="primary" htmlType="submit" className="edit-btn" onClick={handleEdit}>
            {editText}
          </Button>
        </div>
      )}
    </div>
  );
}
