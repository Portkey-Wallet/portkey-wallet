import { ISymbolApprovedItem, ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import ImageDisplay from 'pages/components/ImageDisplay';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import clsx from 'clsx';
import { Switch } from 'antd';
import { useCallback, useState } from 'react';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import getSeed from 'utils/getSeed';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentCaHash } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLoading } from 'store/Provider/hooks';
import { LANG_MAX, ZERO } from '@portkey-wallet/constants/misc';
import './index.less';
import { formatApproveSymbolShow } from '@portkey-wallet/utils/token';

export interface IAllowanceDetailProps {
  allowanceDetail: ITokenAllowance;
}

export default function AllowanceDetail({ allowanceDetail }: IAllowanceDetailProps) {
  const { setLoading } = useLoading();
  const chainInfo = useCurrentChain(allowanceDetail?.chainId);
  const caHash = useCurrentCaHash();
  const [cancelApproveMap, setCancelApproveMap] = useState<{ [x in string]: boolean }>({});

  const checkCanClose = useCallback(
    (symbolAllowance: ISymbolApprovedItem) => {
      const symbol = symbolAllowance.symbol;
      if (cancelApproveMap[symbol]) return false;
      return ZERO.plus(symbolAllowance.amount).gt(0);
    },
    [cancelApproveMap],
  );

  const handleClickSwitch = useCallback(
    async (checked: boolean, symbol: string) => {
      if (checked)
        return singleMessage.info(
          'Please interact with the dApp and initiate transaction again to enable this function.',
        );
      setLoading(true);
      try {
        const { privateKey } = await getSeed();
        if (!(privateKey && chainInfo && caHash)) throw 'param is not exist';
        const contract = new ExtensionContractBasic({
          privateKey,
          rpcUrl: chainInfo.endPoint,
          contractAddress: chainInfo.caContractAddress,
        });
        const options = {
          caHash: caHash,
          contractAddress: chainInfo.defaultToken.address,
          methodName: 'UnApprove',
          args: {
            spender: allowanceDetail.contractAddress,
            symbol,
            amount: LANG_MAX.toFixed(0),
          },
        };
        console.log('ManagerApprove==options====', options);
        const result = await contract.callSendMethod('ManagerForwardCall', '', options, {
          onMethod: 'receipt',
        });
        console.log('ManagerApprove==result====', result);
        setCancelApproveMap((v) => {
          v[symbol] = true;
          return { ...v };
        });
        singleMessage.success('Multiple token approval disabled');
      } catch (error) {
        console.log('===multiply set allowance for close error', error);
        singleMessage.error(handleErrorMessage(error || 'Multiple token approval disabled error'));
      } finally {
        setLoading(false);
      }
    },
    [allowanceDetail.contractAddress, caHash, chainInfo, setLoading],
  );

  return (
    <div className="token-allowance-detail">
      <div className="dapp-info-detail flex-column-center">
        <ImageDisplay
          src={allowanceDetail?.icon}
          name={allowanceDetail?.name || 'Unknown'}
          defaultHeight={64}
          className="dapp-icon"
        />
        <div className="dapp-name">{allowanceDetail?.name || 'Unknown'}</div>
        {allowanceDetail?.url && (
          <div className="dapp-url flex-center">
            <CustomSvg type="DappLock" className="flex-center" />
            <span>
              <a href={allowanceDetail.url} target="_blank" rel="noreferrer">
                {allowanceDetail.url}
              </a>
            </span>
          </div>
        )}
        <div className="dapp-contract-label">Contract Address</div>
        <div className="dapp-contract-address flex-between-center">
          <div className="contract-address flex-1">{allowanceDetail?.contractAddress}</div>
          <Copy toCopy={allowanceDetail?.contractAddress} iconType="Copy4" />
        </div>
      </div>
      {allowanceDetail?.symbolApproveList?.map((item) => (
        <div className="set-allowance-operation" key={item.symbol}>
          <div className="set-allowance-title flex-between-center">
            <div>{`Approve ${formatApproveSymbolShow(item.symbol)}`}</div>
            <Switch
              className="login-switch"
              onChange={(checked: boolean) => handleClickSwitch(checked, item.symbol)}
              checked={checkCanClose(item)}
            />
          </div>

          <div className="set-allowance-tip">
            The dApp will not request your approval until the allowance is exhausted.
          </div>
          <div className="set-allowance-items">
            <div className={clsx(!checkCanClose(item) && 'allowance-amount-hidden')}>
              <div className="set-allowance-label">Amount approved</div>
              <div className="set-allowance-input">{formatAmountShow(divDecimals(item.amount, item.decimals), 0)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
