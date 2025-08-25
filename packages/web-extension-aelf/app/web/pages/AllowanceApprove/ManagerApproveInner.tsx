import { useCallback, useEffect, useMemo, useState } from 'react';
import { handleErrorMessage, IGuardiansApproved } from '@portkey/did-ui-react';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import { useLoading } from 'store/Provider/hooks';
// import CommonHeader from 'components/CommonHeader';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import { DEFAULT_DECIMAL, DEFAULT_NFT_DECIMAL } from '@portkey-wallet/constants/constants-ca/activity';
import { LANG_MAX } from '@portkey-wallet/constants/misc';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import { isNFT, isNFTCollection } from '@portkey-wallet/utils/token';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import getSeed from 'utils/getSeed';
import SetAllowance, { IAllowanceConfirmProps } from 'pages/components/SetAllowance';
import { ChainId, NetworkType } from '@portkey-wallet/types';
import { SvgType } from 'components/CustomSvg';

export interface IManagerApproveInnerProps {
  originChainId: ChainId;
  targetChainId: ChainId;
  caHash: string;
  amount: string;
  dappInfo?: { icon?: string; href?: string; name?: string };
  defaultIcon?: SvgType;
  symbol: string;
  networkType: NetworkType;
  batchApproveNFT: boolean;
  spender?: string;
  onCancel?: () => void;
  onError?: (error: Error) => void;
  onFinish?: (res: { amount: string; guardiansApproved: IGuardiansApproved[]; symbol: string }) => Promise<void>;
}

export default function ManagerApproveInner({
  originChainId,
  targetChainId,
  amount,
  dappInfo,
  symbol,
  defaultIcon,
  batchApproveNFT,
  spender,
  onCancel,
  onFinish,
  onError,
}: IManagerApproveInnerProps) {
  const [tokenInfo, setTokenInfo] = useState<{
    symbol: string;
    tokenName: string;
    supply: string;
    totalSupply: string;
    decimals: number;
    issuer: string;
    isBurnable: true;
    issueChainId: number;
    issued: string;
  }>();
  const { setLoading } = useLoading();
  const [DEFAULT_SYMBOL_DECIMAL, approveSymbol] = useMemo(() => {
    const defaultDecimals = isNFT(symbol) ? DEFAULT_NFT_DECIMAL : DEFAULT_DECIMAL;

    if (!batchApproveNFT || isNFTCollection(symbol) || !isNFT(symbol)) return [defaultDecimals, symbol];

    const collection = symbol.split('-')[0];

    return [defaultDecimals, `${collection}-*`];
  }, [batchApproveNFT, symbol]);

  const [allowance, setAllowance] = useState<string>(divDecimals(amount, DEFAULT_SYMBOL_DECIMAL).toFixed());

  const allowanceConfirm = useCallback(
    async (allowanceInfo: IAllowanceConfirmProps) => {
      try {
        setAllowance(allowanceInfo.allowance);
        setLoading(true);

        const ApproveInfo = {
          amount: timesDecimals(allowance, tokenInfo?.decimals || DEFAULT_SYMBOL_DECIMAL).toFixed(0),
          symbol: approveSymbol,
          // TODO: to be remove. something use in CryptoGifts/Create/index.tsx
          guardiansApproved: [] as any,
        };
        console.log('pre onFinish', ApproveInfo);
        if (onFinish) {
          await onFinish(ApproveInfo);
        }
        setLoading(false);
      } catch (error) {
        onError?.(Error(handleErrorMessage(error)));
        setLoading(false);
      }
    },
    [DEFAULT_SYMBOL_DECIMAL, allowance, approveSymbol, onError, onFinish, setLoading, tokenInfo?.decimals],
    // [getGuardianList, onError, setLoading],
  );

  const targetChainInfo = useCurrentChain(targetChainId);
  console.log('targetChainId: ', targetChainId, targetChainInfo);

  const getTokenInfo = useDebounceCallback(async () => {
    try {
      if (!targetChainInfo) throw Error('Missing verifier, please check params');
      const { privateKey } = await getSeed();
      if (!privateKey) throw 'Invalid user information, please check';
      const contract = new ExtensionContractBasic({
        privateKey,
        rpcUrl: targetChainInfo.endPoint,
        contractAddress: targetChainInfo.defaultToken.address,
      });
      const result = await contract.callViewMethod('GetTokenInfo', {
        symbol,
      });
      if (!result.data) throw `${symbol} does not exist in this chain`;
      setTokenInfo(result.data);
      setAllowance(divDecimals(amount, result.data?.decimals).toFixed());
    } catch (error) {
      console.error(error);
      onError?.(Error(handleErrorMessage(error)));
    } finally {
      setLoading(false);
    }
  }, [targetChainInfo, symbol, amount, onError, setLoading]);

  useEffect(() => {
    setLoading(true);
    getTokenInfo();
  }, [getTokenInfo, setLoading]);
  return (
    <div className="flex-column manager-approval-wrapper">
      <SetAllowance
        symbol={symbol}
        amount={allowance}
        decimals={tokenInfo?.decimals ?? DEFAULT_SYMBOL_DECIMAL}
        recommendedAmount={divDecimals(amount, tokenInfo?.decimals ?? DEFAULT_SYMBOL_DECIMAL).toFixed()}
        max={divDecimals(LANG_MAX, tokenInfo?.decimals ?? DEFAULT_SYMBOL_DECIMAL).toFixed(0)}
        dappInfo={dappInfo}
        onCancel={onCancel}
        spender={spender}
        originChainId={originChainId}
        targetChainId={targetChainId}
        onAllowanceChange={setAllowance}
        onConfirm={allowanceConfirm}
        defaultIcon={defaultIcon}
      />
    </div>
  );
}
