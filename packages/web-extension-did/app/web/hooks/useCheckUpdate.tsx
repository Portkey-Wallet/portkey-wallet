/* eslint-disable no-inline-styles/no-inline-styles */
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import { setUpdateVersionInfo } from '@portkey-wallet/store/store-ca/misc/actions';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';
import { compareVersions } from '@portkey-wallet/utils/device';
import { Modal, ModalFuncProps } from 'antd';
import { useMemo } from 'react';
import { useAppDispatch, useMiscState } from 'store/Provider/hooks';
const currentVersion = process.env.SDK_VERSION?.replace('v', '');

export function useCheckUpdateModal() {
  const { versionInfo } = useMiscState();

  useMemo(() => {
    if (versionInfo && versionInfo.targetVersion && currentVersion) {
      // compare current and target versions
      if (compareVersions(currentVersion, versionInfo.targetVersion) === -1) {
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
  }, [versionInfo]);
}

export function useCheckUpdate() {
  const dispatch = useAppDispatch();
  const { versionInfo } = useMiscState();

  return useLockCallback(async () => {
    if (!currentVersion) return;
    if (versionInfo?.targetVersion && compareVersions(currentVersion, versionInfo.targetVersion) === -1) return;
    try {
      dispatch(
        setUpdateVersionInfo({
          deviceType: VersionDeviceType.Extension,
          appVersion: currentVersion,
        }),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);
}
