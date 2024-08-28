import { handleErrorMessage } from '@portkey-wallet/utils';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDapp, useWalletInfo } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import { ResponseCode } from '@portkey/provider-types';
import { getWallet } from '@portkey-wallet/utils/aelf';
import ImageDisplay from 'pages/components/ImageDisplay';
import { showValueToStr } from '@portkey-wallet/utils/byteConversion';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import AsyncButton from 'components/AsyncButton';
import AElf from 'aelf-sdk';
import { IBlockchainWallet } from '@portkey/types';
import CustomSvg from 'components/CustomSvg';
import { useDecodeTx } from '@portkey-wallet/hooks/hooks-ca/dapp';
import './index.less';

export default function GetSignature() {
  const { payload, autoSha256 } = usePromptSearch<{
    payload: {
      data: string;
      origin: string;
      isCipherText?: boolean;
    };
    autoSha256?: boolean;
  }>();
  const { t } = useTranslation();
  const { currentNetwork } = useWalletInfo();
  const getDecodedTxData = useDecodeTx();
  const [showData, setShowData] = useState(payload?.data);
  const { dappMap } = useDapp();
  const curDapp = useMemo(
    () => dappMap[currentNetwork]?.find((item) => item.origin === payload?.origin),
    [currentNetwork, dappMap, payload?.origin],
  );
  const [showWarning, setShowWarning] = useState(true);
  useEffect(() => {
    (async () => {
      if (payload?.isCipherText) {
        setShowWarning(true);
        try {
          const res = await getDecodedTxData(payload.data);
          console.log('res', res);
          setShowData(res.params);
        } catch (error) {
          console.log('===getDecodedTxData error', error);
        }
      } else {
        setShowWarning(false);
      }
    })();
  }, [getDecodedTxData, payload.data, payload?.isCipherText]);
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

  const onSignByManager = useCallback(
    (manager: IBlockchainWallet) => {
      if (autoSha256) {
        return manager.keyPair.sign(AElf.utils.sha256(Buffer.from(payload?.data, 'hex')), {
          canonical: true,
        });
      }
      return manager.keyPair.sign(payload?.data);
    },
    [autoSha256, payload?.data],
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
      const data = onSignByManager(manager);

      closePrompt({
        ...errorHandler(0),
        data,
      });
    } catch (error) {
      console.error(error, 'error===detail');
      singleMessage.error(handleErrorMessage(error));
    }
  }, [onSignByManager]);

  return (
    <div className="get-signature flex">
      {renderSite}
      <div className="title flex-center">{t('Sign Message')}</div>
      {showWarning && (
        <div className="warning-tip flex">
          <CustomSvg type="WarningFilled" />
          {`Unknown authorization, please proceed with caution`}
        </div>
      )}
      <div className="message">
        <div>Message</div>
        <div className="data">{showValueToStr(showData)}</div>
      </div>
      <div className="btn flex-between">
        <Button
          type="text"
          onClick={() => {
            closePrompt(errorHandler(200003));
          }}>
          {t('Reject')}
        </Button>
        <AsyncButton type="primary" onClick={sendHandler}>
          {t('Sign')}
        </AsyncButton>
      </div>
    </div>
  );
}
