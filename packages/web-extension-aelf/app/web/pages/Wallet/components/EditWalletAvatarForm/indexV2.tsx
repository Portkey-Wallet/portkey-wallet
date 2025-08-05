import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import '../EditWalletNameForm/index.less';
import { IProfileDetailDataProps } from 'types/Profile';
import ImageDisplay from '../../../components/ImageDisplay';
import clsx from 'clsx';
import CommonTabs from '../../../../components/CommonTabs';
// import CommonTabs, { TabKey } from '../../../../components/CommonTabs';
import { LOCAL_AVATARS_ARRAY } from 'assets/images/avatars/avatars';

export interface IEditWalletAvatarFormProps {
  data?: IProfileDetailDataProps;
  saveCallback: (param: { file?: File; selectedAvatar?: string }) => void;
  avatar?: string;
}

export function EditWalletAvatarForm({ saveCallback, avatar }: IEditWalletAvatarFormProps) {
  const { t } = useTranslation();

  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const newAvatarFile = useRef<File>();
  const iconList = LOCAL_AVATARS_ARRAY;

  // const [activeKey, setActiveKey] = useState<TabKey>('1');
  const activeKey = '1';

  const handleUpdate = useCallback(async () => {
    const params =
      activeKey === '1'
        ? {
            selectedAvatar: selectedAvatar,
          }
        : { file: newAvatarFile.current };
    saveCallback(params);
  }, [saveCallback, selectedAvatar, newAvatarFile, activeKey]);

  return (
    <div className="edit-wallet-avatar-form portkey-form">
      <div className="avatar-selected-container">
        <ImageDisplay src={selectedAvatar} defaultHeight={80} defaultWidth={80} className="avatar-img-selected" />
      </div>

      <CommonTabs
        activeKey={activeKey}
        // onChange={(key) => {
        //   setActiveKey(key);
        // }}
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
              </div>
            ),
          },
          // {
          //   key: '2',
          //   label: 'Upload photo',
          //   children: (
          //     <div>
          //       <div className="avatar-upload-from-file">
          //         <UploadImage
          //           accept="image/png,image/jpeg,image/jpg"
          //           getTemporaryDataURL={setSelectedAvatar}
          //           getFile={getFile}>
          //           <MenuItem height={48} icon={<CustomSvgV3 type="photo" />} onClick={() => null}>
          //             <div>Choose from photos</div>
          //           </MenuItem>
          //         </UploadImage>
          //       </div>
          //     </div>
          //   ),
          // },
        ]}
      />
      <div className="form-btn">
        <Button type="primary" htmlType="submit" onClick={handleUpdate}>
          {t('Save')}
        </Button>
      </div>
    </div>
  );
}
