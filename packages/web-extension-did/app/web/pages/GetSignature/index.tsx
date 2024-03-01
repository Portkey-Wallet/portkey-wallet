import { handleErrorMessage } from '@portkey-wallet/utils';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback, useMemo } from 'react';
import { useDapp, useWalletInfo } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import { ResponseCode } from '@portkey/provider-types';
import { getWallet } from '@portkey-wallet/utils/aelf';
import ImageDisplay from 'pages/components/ImageDisplay';
import { showValueToStr } from '@portkey-wallet/utils/byteConversion';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import './index.less';

export default function GetSignature() {
  const { payload } = usePromptSearch<{
    payload: {
      data: string;
      origin: string;
    };
  }>();
  const { t } = useTranslation();
  const { currentNetwork } = useWalletInfo();
  const { dappMap } = useDapp();
  const curDapp = useMemo(
    () => dappMap[currentNetwork]?.find((item) => item.origin === payload?.origin),
    [currentNetwork, dappMap, payload?.origin],
  );

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

  const sendHandler = useCallback(async () => {
    try {
      const { privateKey } = await getSeed();
      if (!privateKey) throw 'Invalid user information, please check';

      const manager = getWallet(privateKey);
      if (!manager?.keyPair) {
        closePrompt({ ...errorHandler(400001), data: { code: ResponseCode.INTERNAL_ERROR, msg: 'invalid error' } });
        return;
      }

      const data = manager.keyPair.sign(payload?.data);
      closePrompt({
        ...errorHandler(0),
        data,
      });
    } catch (error) {
      console.error(error, 'error===detail');
      singleMessage.error(handleErrorMessage(error));
    }
  }, [payload]);

  return (
    <div className="get-signature flex">
      {renderSite}
      <div className="title flex-center">{t('Sign Message')}</div>
      <div className="message">
        <div>Message</div>
        <div className="data">{showValueToStr(payload?.data)}</div>
      </div>
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
