import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { Button } from 'antd';
import CommonModal from 'components/CommonModal';
import CustomSvg from 'components/CustomSvg';
import useConnect from 'hooks/useConnect';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export interface IAccountConnectModalProps {
  open: boolean;
  onCancel: () => void;
}

export default function AccountConnectModal({ open, onCancel }: IAccountConnectModalProps) {
  const { t } = useTranslation();
  const { dapp, origin } = useConnect();
  const { currentNetwork } = useWalletInfo();
  const dispatch = useAppDispatch();

  const handleDisConnect = useCallback(() => {
    if (!dapp) return;
    dispatch(removeDapp({ networkType: currentNetwork, origin: dapp.origin || '' }));
    onCancel();
  }, [currentNetwork, dapp, dispatch, onCancel]);

  const renderBody = useMemo(
    () =>
      dapp ? (
        <div className="connected flex-between-center">
          <div className="origin">{dapp.origin}</div>
          <Button type="text" onClick={handleDisConnect}>
            {t('Disconnect')}
          </Button>
        </div>
      ) : (
        <div className="not-connected">
          <div className="origin">{origin}</div>
          <div className="connect-tip">{t('To connect, please find and click the "Connect" button on this site.')}</div>
        </div>
      ),
    [dapp, handleDisConnect, origin, t],
  );

  return (
    <CommonModal
      open={open}
      width={320}
      maskClosable
      className="account-connect-modal"
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onCancel={onCancel}
      closable={false}
      title={t(dapp ? 'Connected' : 'Not Connected')}>
      {renderBody}
      <div className="close-icon">
        <CustomSvg type="SuggestClose" onClick={onCancel} />
      </div>
    </CommonModal>
  );
}
