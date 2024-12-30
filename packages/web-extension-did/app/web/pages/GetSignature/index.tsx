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
import { showValueToStr, valueToString } from '@portkey-wallet/utils/byteConversion';
import getSeed from 'utils/getSeed';
import singleMessage from 'utils/singleMessage';
import AsyncButton from 'components/AsyncButton';
import AElf from 'aelf-sdk';
import { IBlockchainWallet } from '@portkey/types';
import { useDecodeTx } from 'hooks/dapp';
import './index.less';
import { CommonPromptCard } from '@portkey/did-ui-react';
import { PromptCardType } from 'pages/Send';
import { ToggleContent } from 'pages/components/ToggleContent';
import { DappSiteInfo } from 'pages/components/DappSiteInfo';

export default function GetSignature() {
  const { payload, autoSha256, isManagerSignature } = usePromptSearch<{
    payload: {
      data: string;
      origin: string;
      isCipherText?: boolean;
    };
    autoSha256?: boolean;
    isManagerSignature?: boolean;
  }>();
  const { t } = useTranslation();
  const { currentNetwork } = useWalletInfo();
  const [showData, setShowData] = useState<string | { methodName: string; params: object }>(payload?.data);
  const { dappMap } = useDapp();

  const curDapp = useMemo(
    () => dappMap[currentNetwork]?.find((item) => item.origin === payload?.origin),
    [currentNetwork, dappMap, payload?.origin],
  );
  const [showWarning, setShowWarning] = useState(false);
  const getDecodedTxData = useDecodeTx();

  useEffect(() => {
    (async () => {
      if (payload?.isCipherText) {
        try {
          const raw = payload?.data;
          // const raw =
          //   '0a220a20a4ed11a0c86847b4c24111526f9e6a9174e142e28d26db8bdae761e6e32adbfd12220a2088881d4350a8c77c59a42fc86bbcd796b129e086da7e61d24fb86a6cbb6b2f3b18be9fe17022040608dfff2a124d616e61676572466f727761726443616c6c327f0a220a2009018c2fbd3ea94c99054cda666d23f1b1f6c90802a8b41c34a275a452f75c4412220a202791e992a57f28e75a11f13af2c0aec8b0eb35d2f048d42eba8901c92e0378dc1a085472616e73666572222b0a220a200c214bac7406d99ff80fc03401147840e7bde64cd85bddd4c3312627f2094be81203454c461801';
          const res = await getDecodedTxData(raw);
          setShowWarning(false);
          if (
            res.result.methodName &&
            res.result?.params?.methodName &&
            res.result?.methodName === 'ManagerForwardCall'
          ) {
            setShowData({
              methodName: res.result.params.methodName,
              params: res.result.params.args,
            });
          } else {
            setShowData({
              methodName: res.result.methodName,
              params: res.result.params,
            });
          }
        } catch (error) {
          setShowWarning(true);
          console.log('===getDecodedTxData error', error);
        }
      } else {
        setShowWarning(false);
      }
    })();
  }, [getDecodedTxData, payload?.data, payload?.isCipherText]);

  const onSignByManager = useCallback(
    (manager: IBlockchainWallet) => {
      if (isManagerSignature) {
        return manager.keyPair.sign(AElf.utils.sha256(payload?.data), {
          canonical: true,
        });
      }
      if (autoSha256) {
        return manager.keyPair.sign(AElf.utils.sha256(Buffer.from(payload?.data, 'hex')), {
          canonical: true,
        });
      }
      return manager.keyPair.sign(payload?.data);
    },
    [autoSha256, isManagerSignature, payload?.data],
  );

  const [signature, setSignature] = useState<{
    r: string;
    s: string;
    recoveryParam: string;
  }>();
  const getSignature = useCallback(async () => {
    const { privateKey } = await getSeed();
    if (!privateKey) throw 'Invalid user information, please check';

    const manager = getWallet(privateKey);
    if (!manager?.keyPair) {
      closePrompt({ ...errorHandler(400001), data: { code: ResponseCode.INTERNAL_ERROR, msg: 'invalid error' } });
      return;
    }
    const result = onSignByManager(manager);
    const data = {
      r: result.r.toString('hex', 32),
      s: result.s.toString('hex', 32),
      recoveryParam: (result.recoveryParam || 0)?.toString(),
    };
    setSignature(data);

    return data;
  }, [onSignByManager]);
  useEffect(() => {
    getSignature();
  }, [getSignature]);

  const sendHandler = useCallback(async () => {
    try {
      let data = signature;
      if (!data) {
        data = await getSignature();
      }
      closePrompt({
        ...errorHandler(0),
        data,
      });
    } catch (error) {
      console.error(error, 'error===detail');
      singleMessage.error(handleErrorMessage(error));
    }
  }, [getSignature, signature]);

  const messageList = useMemo(() => {
    const list: Array<{ title: string; value: string }> = [];

    if (typeof showData === 'string') {
      list.push({
        title: 'String to be sign',
        value: showValueToStr(showData),
      });

      list.push({
        title: 'Method',
        value: `"GET_SIGNATURE"`,
      });
    }

    if (typeof showData === 'object') {
      list.push({
        title: 'Method',
        value: `"${showData.methodName || 'Unknown'}"`,
      });

      if (showData.params && typeof showData.params === 'object') {
        Object.entries(showData.params).forEach(([key, value]) => {
          if (!value) return;

          let formattedDate = value;
          if (key === 'expirationTime') {
            const date = new Date(value * 1000);
            formattedDate = date.toLocaleString();
          }

          list.push({
            title: key,
            value: key === 'expirationTime' ? formattedDate : valueToString(value),
          });
        });
      }
    }

    let signatureValue = '';
    if (signature) {
      signatureValue = [signature.r, signature.s, signature.recoveryParam].join('');
    }

    list.push({
      title: 'Signature',
      value: signatureValue,
    });
    return list;
  }, [showData, signature]);

  return (
    <div className="get-signature">
      <div className="get-signature-body">
        <DappSiteInfo title="Sign message" dappInfo={curDapp} />

        {showWarning && (
          // TODO-SA
          <CommonPromptCard
            className="warning-tip"
            type={PromptCardType.WARNING}
            description="Unknown authorization. Please proceed with caution."
          />
        )}

        <div className="message-tip-wrap">
          {
            'Signing this message will prove you have ownership of the current account. Only sign messages from applications you trust.'
          }
        </div>

        <ToggleContent title="Message">
          <div className="message-list-container">
            {messageList.map((item) => (
              <div key={item.title} className="message-item">
                <span className="message-item-title">{item.title}</span>
                <span className="message-item-value">{item.value}</span>
              </div>
            ))}
          </div>
        </ToggleContent>
      </div>

      <div className="get-signature-footer">
        <div className="get-signature-footer-body">
          <Button
            type="default"
            onClick={() => {
              closePrompt(errorHandler(200003));
            }}>
            {t('Reject')}
          </Button>
          <AsyncButton type="primary" onClick={sendHandler}>
            {t('Sign')}
          </AsyncButton>
        </div>
        <div className="get-signature-footer-tip">{'Only sign if you trust this website'}</div>
      </div>
    </div>
  );
}
