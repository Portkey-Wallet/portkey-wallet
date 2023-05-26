/* eslint-disable no-inline-styles/no-inline-styles */
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { UpdateNotify, VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { compareVersions } from '@portkey-wallet/utils/device';
import { Modal, ModalFuncProps } from 'antd';
import { request } from '@portkey-wallet/api/api-did';

const currentVersion = process.env.SDK_VERSION?.replace('v', '');

export function checkUpdateModal(versionInfo: UpdateNotify) {
  if (currentVersion && compareVersions(currentVersion, versionInfo.targetVersion) === -1) {
    let modalType: ModalFuncProps['type'] = 'warning';
    const modalProps: ModalFuncProps = {
      width: 320,
      icon: null,
      className: 'cross-modal delete-modal',
      content: (
        <>
          <div style={{ fontWeight: 500, paddingBottom: '24px' }}>{versionInfo.title}</div>
          <div style={{ whiteSpace: 'pre-line' }}>{versionInfo.content}</div>
        </>
      ),
      closable: false,
      centered: true,
      autoFocusButton: null,
      okButtonProps: { style: { width: '100%' } },
      okText: 'Update',
      onOk: () => {
        window.open(versionInfo.downloadUrl);
        return Promise.reject();
      },
    };
    if (!versionInfo.isForceUpdate) {
      modalType = 'confirm';
      modalProps.okButtonProps = undefined;
    }
    Modal[modalType](modalProps);
  }
}

export function useCheckUpdate() {
  return useLockCallback(async () => {
    if (!currentVersion) return;

    // Request the latest data every time the page is refreshed
    try {
      const req: UpdateNotify = await request.wallet.pullNotify({
        method: 'POST',
        params: {
          deviceId: 'deviceId',
          appId: '10001',
          deviceType: VersionDeviceType.Extension,
          appVersion: currentVersion,
        },
      });
      if (req?.targetVersion) {
        checkUpdateModal(req);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
}
