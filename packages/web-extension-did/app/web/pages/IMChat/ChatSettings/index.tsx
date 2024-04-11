import { CONTACT_PERMISSION_LABEL_MAP, CONTACT_PERMISSION_LIST } from '@portkey-wallet/constants/constants-ca/contact';
import CustomSvg from 'components/CustomSvg';
import { useNavigateState } from 'hooks/router';
import SettingHeader from 'pages/components/SettingHeader';
import MenuItem from 'components/MenuItem';
import clsx from 'clsx';
import { useCallback, useState } from 'react';
import { ContactPermissionEnum } from '@portkey-wallet/types/types-ca/contact';
import { useEffectOnce } from '@portkey-wallet/hooks';
import CustomModal from 'pages/components/CustomModal';
import { useLoading } from 'store/Provider/hooks';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import './index.less';

export default function ChatSettings() {
  const navigate = useNavigateState();
  const [permissionSelected, setPermissionSelected] = useState<ContactPermissionEnum | undefined>(undefined);
  const { setLoading } = useLoading();

  const getPermissionSelected = useCallback(async () => {
    try {
      // TODO
      // setPermissionSelected(ContactPermissionEnum.EVERY_BODY);
    } catch (error) {
      console.log('===getPermissionSelected error', error);
    }
  }, []);

  useEffectOnce(() => {
    getPermissionSelected();
  });

  const changePermission = useCallback(
    (id: ContactPermissionEnum) => {
      if (id === permissionSelected) return;

      CustomModal({
        type: 'confirm',
        content: (
          <div>
            <div className="modal-title">{`You are changing the visibility of this to "${CONTACT_PERMISSION_LABEL_MAP[id]}"`}</div>
            <div>{'After confirmation, your account info will be visible to the selected group.'}</div>
          </div>
        ),
        onOk: async () => {
          try {
            setLoading(true);
            //  await
            setPermissionSelected(id);
            setLoading(false);
          } catch (error) {
            setLoading(false);
            const msg = handleErrorMessage(error);
            singleMessage.error(msg);
          }
        },
        okText: 'Confirm',
      });
    },
    [permissionSelected, setLoading],
  );

  return (
    <div className="chat-settings-page">
      <div className="chat-settings-header">
        <SettingHeader
          title="Chat Settings"
          leftCallBack={() => navigate('/chat-list')}
          rightElement={<CustomSvg type="Close2" onClick={() => navigate('/chat-list')} />}
        />
      </div>
      <div className="chat-settings-container">
        <div className="add-group-permission-label">{`Who can add me to groups`}</div>
        {CONTACT_PERMISSION_LIST.map((item, index) => {
          return (
            <MenuItem
              key={'add-group-permission-item-' + index}
              className={clsx([
                'add-group-permission-item',
                permissionSelected === item.value && 'add-group-permission-item-selected',
              ])}
              height={56}
              showEnterIcon={false}
              icon={permissionSelected === item.value ? <CustomSvg type="selected" /> : <div className="icon-empty" />}
              onClick={() => changePermission(item.value)}>
              {item.label}
            </MenuItem>
          );
        })}
      </div>
    </div>
  );
}
