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
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import getDecodedTxData from 'utils/sandboxUtil/getDecodedTxData';
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
  const [showData, setShowData] = useState<string | object>(payload?.data);
  const { dappMap } = useDapp();
  const curDapp = useMemo(
    () => dappMap[currentNetwork]?.find((item) => item.origin === payload?.origin),
    [currentNetwork, dappMap, payload?.origin],
  );
  const [showWarning, setShowWarning] = useState(false);
  const chainInfo = useCurrentChain();

  useEffect(() => {
    (async () => {
      if (payload?.isCipherText) {
        try {
          const raw = payload?.data;
          // const raw =
          //   '0a220a20a4ed11a0c86847b4c24111526f9e6a9174e142e28d26db8bdae761e6e32adbfd12220a2088881d4350a8c77c59a42fc86bbcd796b129e086da7e61d24fb86a6cbb6b2f3b18be9fe17022040608dfff2a124d616e61676572466f727761726443616c6c327f0a220a2009018c2fbd3ea94c99054cda666d23f1b1f6c90802a8b41c34a275a452f75c4412220a202791e992a57f28e75a11f13af2c0aec8b0eb35d2f048d42eba8901c92e0378dc1a085472616e73666572222b0a220a200c214bac7406d99ff80fc03401147840e7bde64cd85bddd4c3312627f2094be81203454c461801';
          if (!chainInfo) throw 'invalid chainInfo';
          const res = await getDecodedTxData({ chainInfo, raw, rpcUrl: chainInfo.endPoint });
          setShowWarning(false);
          setShowData({
            methodName: res.result.methodName,
            params: res.result.params,
          });
        } catch (error) {
          setShowWarning(true);
          console.log('===getDecodedTxData error', error);
        }
      } else {
        setShowWarning(false);
      }
    })();
  }, [chainInfo, payload?.data, payload?.isCipherText]);
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

  const renderShowData = useMemo(() => {
    if (typeof showData === 'object') {
      return (
        <div className="data">
          {Object.entries(showData).map(([key, value], index) => (
            <div key={index}>
              <div className="method-name">{key}</div>
              <div>{showValueToStr(value)}</div>
            </div>
          ))}
        </div>
      );
    }
    return <div className="data">{showValueToStr(showData)}</div>;
  }, [showData]);

  return (
    <div className="get-signature flex">
      {renderSite}
      <div className="title flex-center">{t('Sign Message')}</div>
      {showWarning && (
        <div className="warning-tip flex">
          <CustomSvg type="WarningFilled" />
          {`Unrecognized authorization. Please exercise caution and refrain from approving the transaction if you are uncertain.`}
        </div>
      )}
      <div className="message">
        <div>Message</div>
        {renderShowData}
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
