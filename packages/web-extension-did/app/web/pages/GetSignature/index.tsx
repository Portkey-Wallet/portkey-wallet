import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import aes from '@portkey-wallet/utils/aes';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback, useMemo, useState } from 'react';
import { useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import { ResponseCode } from '@portkey/provider-types';
import { getWallet } from '@portkey-wallet/utils/aelf';
import ImageDisplay from 'pages/components/ImageDisplay';
import DappSession from 'pages/components/DappSession';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { useCurrentDappInfo, useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import './index.less';

export default function GetSignature() {
  const { payload } = usePromptSearch<{
    payload: {
      data: string;
      origin: string;
    };
  }>();
  const wallet = useCurrentWalletInfo();
  const { t } = useTranslation();
  const { passwordSeed } = useUserInfo();
  const { currentNetwork } = useWalletInfo();
  const privateKey = useMemo(
    () => aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed),
    [passwordSeed, wallet.AESEncryptPrivateKey],
  );
  const curDapp = useCurrentDappInfo(payload?.origin);
  const [open, setOpen] = useState<boolean>(false);
  const [exp, setExp] = useState<SessionExpiredPlan>(SessionExpiredPlan.hour1);
  const updateSessionInfo = useUpdateSessionInfo();

  const renderSite = useMemo(
    () =>
      curDapp && (
        <div className="site flex-center">
          <ImageDisplay defaultHeight={24} className="icon" src={curDapp?.icon} backupSrc="DappDefault" />
          <span className="origin">{curDapp.origin}</span>
        </div>
      ),
    [curDapp],
  );

  const handleSessionChange = useCallback((flag: boolean, extTime: SessionExpiredPlan) => {
    setOpen(flag);
    setExp(extTime);
  }, []);

  const sendHandler = useCallback(async () => {
    try {
      if (!privateKey) throw 'Invalid user information, please check';

      const manager = getWallet(privateKey);
      if (!manager?.keyPair) {
        closePrompt({ ...errorHandler(400001), data: { code: ResponseCode.INTERNAL_ERROR, msg: 'invalid error' } });
        return;
      }

      const data = manager.keyPair.sign(payload?.data);

      if (open) {
        updateSessionInfo({
          networkType: currentNetwork,
          origin: payload?.origin,
          expiredPlan: exp,
          manager,
        });
      } else {
        updateSessionInfo({ origin: payload?.origin });
      }
      closePrompt({
        ...errorHandler(0),
        data,
      });
    } catch (error) {
      console.error(error, 'error===detail');
      message.error(handleErrorMessage(error));
    }
  }, [currentNetwork, exp, open, payload?.data, payload?.origin, privateKey, updateSessionInfo]);

  return (
    <div className="get-signature flex">
      {renderSite}
      <div className="title flex-center">{t('Sign Message')}</div>
      <div className="message">
        <div>Message</div>
        <div className="data">{payload?.data}</div>
      </div>
      <DappSession onChange={handleSessionChange} />
      <div className="btn flex-between">
        <Button
          type="text"
          onClick={() => {
            closePrompt(errorHandler(200003));
          }}>
          {t('Reject')}
        </Button>
        <Button type="primary" onClick={sendHandler}>
          {t('Sign')}
        </Button>
      </div>
    </div>
  );
}
