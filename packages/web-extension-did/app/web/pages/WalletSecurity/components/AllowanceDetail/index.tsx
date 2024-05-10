import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import ImageDisplay from 'pages/components/ImageDisplay';
import Copy from 'components/Copy';
import CustomSvg from 'components/CustomSvg';
import clsx from 'clsx';
import { Switch } from 'antd';
import { useCallback, useState } from 'react';
import { formatAmountShow } from '@portkey-wallet/utils/converter';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import getSeed from 'utils/getSeed';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentCaHash } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useLoading } from 'store/Provider/hooks';
import { LANG_MAX } from '@portkey-wallet/constants/misc';
import './index.less';

export interface IAllowanceDetailProps {
  allowanceDetail: ITokenAllowance;
}

export default function AllowanceDetail({ allowanceDetail }: IAllowanceDetailProps) {
  const { setLoading } = useLoading();
  const chainInfo = useCurrentChain(allowanceDetail?.chainId);
  const [open, setOpen] = useState<boolean>(!!allowanceDetail?.allowance);
  const caHash = useCurrentCaHash();

  const handleClickSwitch = useCallback(async () => {
    if (!open)
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
          symbol: '*',
          amount: LANG_MAX.toFixed(0),
        },
      };
      console.log('ManagerApprove==options====', options);
      const result = await contract.callSendMethod('ManagerForwardCall', '', options, {
        onMethod: 'receipt',
      });
      console.log('ManagerApprove==result====', result);
      setOpen(false);
      singleMessage.success('Multiple token approval disabled');
    } catch (error) {
      console.log('===multiply set allowance for close error', error);
      singleMessage.error(handleErrorMessage(error || 'Multiple token approval disabled error'));
    } finally {
      setLoading(false);
    }
  }, [allowanceDetail.contractAddress, caHash, chainInfo, open, setLoading]);

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
      <div className="set-allowance-operation">
        <div className="set-allowance-title">Approve multiple tokens</div>
        <div className="set-allowance-tip">
          This will approve access to all tokens and the dApp will not request your approval until the allowance is
          exhausted.
        </div>
        <div className="set-allowance-switch flex">
          <Switch className="login-switch" checked={open} onChange={handleClickSwitch} />
          <span className="set-allowance-switch-text">{open ? 'Open' : 'Close'}</span>
        </div>
        <div className={clsx(!open && 'allowance-amount-hidden')}>
          <div className="set-allowance-label">Amount approved</div>
          <div className="set-allowance-input">{formatAmountShow(allowanceDetail?.allowance, 0)}</div>
        </div>
      </div>
    </div>
  );
}
