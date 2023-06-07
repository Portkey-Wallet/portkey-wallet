import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { ZERO } from '@portkey-wallet/constants/misc';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import { formatChainInfoToShow, handleErrorMessage } from '@portkey-wallet/utils';
import aes from '@portkey-wallet/utils/aes';
import { Button, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';
import usePromptSearch from 'hooks/usePromptSearch';
import { useCallback, useEffect, useMemo } from 'react';
import { useUserInfo, useWalletInfo } from 'store/Provider/hooks';
import errorHandler from 'utils/errorHandler';
import { closePrompt } from 'utils/lib/serviceWorkerAction';
import { callSendMethod } from 'utils/sandboxUtil/sendTransactions';
import { useAmountInUsdShow } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import './index.less';

export default function SendTransactions() {
  const detail = usePromptSearch<{
    payload: {
      chainId: ChainId;
      contractAddress: string;
      method: string;
      params: any;
    };
  }>();
  const chainInfo = useCurrentChain(detail?.payload?.chainId);
  const wallet = useCurrentWalletInfo();
  const { walletName } = useWalletInfo();
  const { currentNetwork } = useWalletInfo();
  const isMainnet = useIsMainnet();
  const { t } = useTranslation();
  const {
    payload: { params },
  } = detail;
  const { passwordSeed } = useUserInfo();
  const amountInUsdShow = useAmountInUsdShow();

  useEffect(() => {
    // TODO fee
  }, []);

  const renderDetail = useMemo(() => {
    const { symbol, amount, decimals } = params.paramsOption;
    return (
      <div className="detail">
        <div className="title">Details</div>
        <div className="amount">
          <div className="title">Amount</div>
          <div className="amount-number flex-between">
            <div>{`${formatAmountShow(amount)} ELF`}</div>
            {isMainnet && <div>{amountInUsdShow(amount, decimals, symbol)}</div>}
          </div>
        </div>
        <div className="fee flex-between">
          <div>Transaction Fee</div>
          <div className="flex-center">
            <div className="elf">{`${formatAmountShow(params.paramsOption.fee)} ELF`}</div>
            {isMainnet && <div className="dollar">{amountInUsdShow(amount, decimals, symbol)}</div>}
          </div>
        </div>
        <div className="total flex-between">
          <div>Total (Amount + Transaction Fee)</div>
          <div className="flex-center">
            <div className="elf">{`${formatAmountShow(ZERO.plus(amount).plus(params.paramsOption.fee))} ELF`}</div>
            {isMainnet && <div className="dollar">{amountInUsdShow(amount, decimals, symbol)}</div>}
          </div>
        </div>
      </div>
    );
  }, [amountInUsdShow, isMainnet, params.paramsOption]);
  const renderMessage = useMemo(() => {
    const { messageDetail } = params.paramsOption;
    return (
      <div className="message-wrapper">
        <div className="title">Message</div>
        <div className="message">
          <div className="title">String to be sign</div>
          <div className="content">{messageDetail.sign}</div>
          <div className="title">Method</div>
          <div className="content">{messageDetail.method}</div>
          <div className="title">Signature</div>
          <div className="content">{messageDetail.signature}</div>
        </div>
        <div className="fee flex-between">
          <div>Transaction Fee</div>
          <div className="flex-center">
            <div className="elf">{`${formatAmountShow(params.paramsOption.fee)} ELF`}</div>
            {isMainnet && <div className="dollar">$0.12</div>}
          </div>
        </div>
      </div>
    );
  }, [isMainnet, params.paramsOption]);

  const sendHandler = useCallback(async () => {
    try {
      if (!chainInfo?.endPoint || !wallet?.caHash) {
        closePrompt({ ...errorHandler(400001), data: { code: 4002, msg: 'invalid chain id' } });
        return;
      }
      const { payload } = detail;
      const isCAManagerForwardCall = chainInfo.caContractAddress !== payload.contractAddress;
      let paramsOption = payload.params?.paramsOption;

      const functionName = isCAManagerForwardCall ? 'ManagerForwardCall' : payload.method;

      paramsOption = isCAManagerForwardCall
        ? {
            caHash: wallet.caHash,
            methodName: payload.method,
            contractAddress: payload.contractAddress,
            args: paramsOption,
          }
        : paramsOption;
      const privateKey = aes.decrypt(wallet.AESEncryptPrivateKey, passwordSeed);
      if (!privateKey) throw 'Invalid user information, please check';
      const result = await callSendMethod({
        rpcUrl: chainInfo.endPoint,
        chainType: 'aelf',
        methodName: functionName,
        paramsOption,
        privateKey,
        address: chainInfo.caContractAddress,
        sendOptions: { onMethod: 'transactionHash' },
      });
      closePrompt({
        ...errorHandler(0),
        data: result.result,
      });
    } catch (error) {
      console.error(error, 'error===detail');
      message.error(handleErrorMessage(error));
    }
  }, [chainInfo, detail, wallet, passwordSeed]);

  return (
    <div className="send-transaction flex">
      <div className="chain flex-center">
        <CustomSvg type={isMainnet ? 'Aelf' : 'elf-icon'} />
        <span>{formatChainInfoToShow(detail.payload.chainId, currentNetwork)}</span>
      </div>
      <div className="account flex">
        <div className="name">{walletName}</div>
        <CustomSvg type="Oval" />
        <div className="address">{`${detail.payload.contractAddress.slice(
          0,
          10,
        )}...${detail.payload.contractAddress.slice(-4)}`}</div>
        <div className="line" />
      </div>
      <div className="method">
        <div className="title">Method</div>
        <div className="method-name">{detail.payload.method}</div>
      </div>
      {detail.payload.method.toLowerCase() === 'transfer' ? renderDetail : renderMessage}
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
