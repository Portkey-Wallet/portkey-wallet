import { Modal, Popover } from 'antd';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { IProfileDetailBodyProps } from 'types/Profile';
import IdAndAddress from '../IdAndAddress';
import { useIsChatShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIndexAndName, useIsMyContact } from '@portkey-wallet/hooks/hooks-ca/contact';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import LoginAccountList from '../LoginAccountList';
import Avatar from 'pages/components/Avatar';
import { PopoverMenuList } from '@portkey-wallet/im-ui-web';
import { useBlockAndReport } from '@portkey-wallet/hooks/hooks-ca/im';
import clsx from 'clsx';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { CustomModalBottom } from '../../../components/CustomModalBottom';
import EditWalletNameForm from '../../../Wallet/components/EditWalletNameForm';
import { EditWalletAvatarForm } from '../../../Wallet/components/EditWalletAvatarForm';
import { useCurrentUserInfo, useSetUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import uploadImageToS3 from 'utils/compressAndUploadToS3';
import { useCommonState } from 'store/Provider/hooks';

export default function ViewContactBody({ data }: IProfileDetailBodyProps) {
  const networkInfo = useCurrentNetworkInfo();
  const { avatar, nickName } = useCurrentUserInfo();
  const setUserInfo = useSetUserInfo();
  // const navigate = useNavigate();
  const [popVisible, setPopVisible] = useState(false);

  const { index } = useIndexAndName(data as Partial<ContactItemType>);

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

  const [avatarUploading, setAvatarUploading] = useState(false);
  const { isPrompt } = useCommonState();

  return (
    <div className="view-contact-body">
      <div className="view-contact-body-main">
        <div className="info-section name-section">
          <div className="avatar-container">
            <Avatar
              avatarUrl={data?.avatar}
              nameIndex={index}
              size="xl"
              loading={{
                loading: avatarUploading,
                type: {
                  height: 32,
                  width: 32,
                },
              }}
            />
            <div
              className={clsx('avatar-sub-icon', avatarUploading ? 'avatar-sub-icon-disabled' : '')}
              onClick={() => {
                if (avatarUploading) {
                  return;
                }
                CustomModalBottom({
                  type: 'confirm',
                  noFooter: true,
                  isPrompt,
                  content: (
                    <EditWalletAvatarForm
                      avatar={avatar}
                      networkInfo={networkInfo}
                      data={data}
                      saveCallback={async (avatar) => {
                        Modal.destroyAll();
                        try {
                          setAvatarUploading(true);
                          let s3Url = '';
                          if (avatar.file) {
                            s3Url = await uploadImageToS3(avatar.file);
                          }

                          await setUserInfo({ avatar: (s3Url || avatar.selectedAvatar) as string });
                        } catch (error) {
                          console.log('setWalletName: error', error);
                        } finally {
                          setAvatarUploading(false);
                        }
                      }}
                    />
                  ),
                  onOk: () => {
                    return;
                  },
                  title: 'Change wallet picture',
                  okText: 'Save',
                });
              }}>
              <CustomSvgV3 className="edit-thin-icon" type="edit thin" disabled={avatarUploading} />
            </div>
          </div>
          <div className="name-edit-container">
            <div className="name">{data.caHolderInfo?.walletName}</div>
            <div
              onClick={() => {
                CustomModalBottom({
                  type: 'confirm',
                  noFooter: true,
                  isPrompt,
                  content: (
                    <EditWalletNameForm
                      // avatar={avatar}
                      nickName={nickName}
                      setUserInfo={setUserInfo}
                      data={data}
                      saveCallback={() => {
                        Modal.destroyAll();
                      }}
                    />
                  ),
                  onOk: () => {
                    return;
                  },
                  title: 'Rename wallet',
                  okText: 'Save',
                });
              }}>
              <CustomSvgV3 className="edit-thin-icon" type="edit thin" />
            </div>
          </div>
        </div>

        <IdAndAddress addresses={data?.addresses || []} addressSectionLabel="My Addresses" />
      </div>
    </div>
  );
}
