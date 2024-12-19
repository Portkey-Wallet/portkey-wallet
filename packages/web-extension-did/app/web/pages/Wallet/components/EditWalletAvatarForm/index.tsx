import { useCallback, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { RequireAtLeastOne } from '@portkey-wallet/types/common';
import '../EditWalletNameForm/index.less';
import { IProfileDetailDataProps } from 'types/Profile';
import uploadImageToS3 from 'utils/compressAndUploadToS3';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import { request } from '@portkey-wallet/api/api-did';
import ImageDisplay from '../../../components/ImageDisplay';
import clsx from 'clsx';
import UploadImage from '../../../components/UploadImage';
import MenuItem from '../../../../components/MenuItem';
import { CustomSvgV3 } from '../../../../components/CustomSvgV3';
import CommonTabs, { TabKey } from '../../../../components/CommonTabs';

export interface IEditWalletAvatarFormProps {
  data: IProfileDetailDataProps;
  saveCallback?: () => void;
  avatar?: string;
  setUserInfo: (params: RequireAtLeastOne<{ nickName: string; avatar: string }>) => Promise<void>;
  networkInfo: any;
}

export function EditWalletAvatarForm({ saveCallback, avatar, setUserInfo, networkInfo }: IEditWalletAvatarFormProps) {
  const { t } = useTranslation();

  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const newAvatarFile = useRef<File>();
  const [loading, setLoading] = useState(false);

  const [iconList, setIconList] = useState([]);
  useEffect(() => {
    const fetchIcons = async () => {
      const iconList = await request.wallet.getIconList({
        baseURL: networkInfo.apiUrl,
      });
      setIconList(iconList.defaultAvatars);
    };
    fetchIcons().catch((error) => {
      console.error('fetchIcons error', error);
    });
  }, [networkInfo.apiUrl]);

  const handleUpdate = useCallback(async () => {
    try {
      setLoading(true);
      let s3Url = '';
      if (newAvatarFile.current) {
        s3Url = await uploadImageToS3(newAvatarFile.current);
      }

      await setUserInfo({ avatar: s3Url || (selectedAvatar as string) });
      saveCallback?.();
      singleMessage.success(t('Saved Successful'));
    } catch (error) {
      singleMessage.error(handleErrorMessage(error, 'set wallet name error'));
      console.log('setWalletName: error', error);
    } finally {
      setLoading(false);
    }
  }, [saveCallback, selectedAvatar, setUserInfo, t]);

  const getFile = useCallback((file: File) => {
    newAvatarFile.current = file;
  }, []);

  // const onFinishFailed = useCallback((errorInfo: any) => {
  //   console.error(errorInfo, 'onFinishFailed==');
  //   singleMessage.error('Something error');
  // }, []);
  const [activeKey, setActiveKey] = useState<TabKey>('1');

  return (
    <div className="edit-wallet-avatar-form portkey-form">
      <div className="avatar-selected-container">
        <ImageDisplay src={selectedAvatar} defaultHeight={80} defaultWidth={80} className="avatar-img-selected" />
      </div>

      <CommonTabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
        }}
        items={[
          {
            key: '1',
            label: 'Select avatar',
            children: (
              <div>
                <div className="wallet-edit-avatar-container">
                  {iconList.map((iconUrl, index) => {
                    const selected = iconUrl === selectedAvatar ? 'avatar-item-selected' : '';
                    return (
                      <div
                        key={index}
                        className={clsx(selected, 'avatar-item')}
                        onClick={() => {
                          setSelectedAvatar(iconUrl);
                        }}>
                        <ImageDisplay src={iconUrl} defaultHeight={52} defaultWidth={52} className="avatar-img" />
                      </div>
                    );
                  })}
                </div>
                {/*<div className="form-btn">*/}
                {/*  <Button type="primary" htmlType="submit" loading={loading} onClick={handleUpdate}>*/}
                {/*    {t('Save')}*/}
                {/*  </Button>*/}
                {/*</div>*/}
              </div>
            ),
          },
          {
            key: '2',
            label: 'Upload photo',
            children: (
              <div>
                <div className="avatar-upload-from-file">
                  <UploadImage
                    accept="image/png,image/jpeg,image/jpg"
                    getTemporaryDataURL={setSelectedAvatar}
                    getFile={getFile}>
                    <MenuItem height={48} icon={<CustomSvgV3 type="photo" />} onClick={() => null}>
                      <div>Choose from photos</div>
                    </MenuItem>
                  </UploadImage>
                </div>
              </div>
            ),
          },
        ]}
      />
      <div className="form-btn">
        <Button type="primary" htmlType="submit" loading={loading} onClick={handleUpdate}>
          {t('Save')}
        </Button>
      </div>
    </div>
  );
}
