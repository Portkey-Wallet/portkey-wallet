import { ISymbolApprovedItem, ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import ImageDisplay from 'pages/components/ImageDisplay';
import Copy from 'components/Copy';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useCallback, useEffect, useState } from 'react';
import { divDecimals, formatAmountShow } from '@portkey-wallet/utils/converter';
import singleMessage from 'utils/singleMessage';
import { addressFormat, formatStr2EllipsisStr, handleErrorMessage } from '@portkey-wallet/utils';
import { ExtensionContractBasic } from 'utils/sandboxUtil/ExtensionContractBasic';
import getSeed from 'utils/getSeed';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentCaHash } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { LANG_MAX } from '@portkey-wallet/constants/misc';
import './index.less';
import { formatApproveSymbolShow } from '@portkey-wallet/utils/token';
import TokenImageDisplay from '../../../components/TokenImageDisplay';
import { timeAgo } from '../../../../utils';
import CircleLoading from '../../../../components/CircleLoading';

export interface IAllowanceDetailProps {
  allowanceDetail: ITokenAllowance;
}

export default function AllowanceDetail({ allowanceDetail }: IAllowanceDetailProps) {
  // const { setLoading } = useLoading();
  const [loading, setLoading] = useState(false);
  const chainInfo = useCurrentChain(allowanceDetail?.chainId);
  const caHash = useCurrentCaHash();
  const [cancelApproveMap, setCancelApproveMap] = useState<{ [x in string]: boolean }>({});

  // const checkCanClose = useCallback(
  //   (symbolAllowance: ISymbolApprovedItem) => {
  //     const symbol = symbolAllowance.symbol;
  //     if (cancelApproveMap[symbol]) return false;
  //     return ZERO.plus(symbolAllowance.amount).gt(0);
  //   },
  //   [cancelApproveMap],
  // );

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
        // singleMessage.success('Multiple token approval disabled');
        singleMessage.info('Token approval revoked');
      } catch (error) {
        console.log('===multiply set allowance for close error', error);
        singleMessage.error(handleErrorMessage(error || 'Token approval revoked error'));
      } finally {
        setLoading(false);
      }
    },
    [allowanceDetail.contractAddress, caHash, chainInfo, setLoading],
  );

  const [ellipsisContractAddress, setEllipsisContractAddress] = useState<string>();

  useEffect(() => {
    if (!allowanceDetail?.contractAddress || !allowanceDetail?.chainId) {
      return;
    }
    const formatAddressShow = addressFormat(allowanceDetail?.contractAddress, allowanceDetail?.chainId, 'aelf');
    const ellipsisAddress = formatStr2EllipsisStr(formatAddressShow);
    setEllipsisContractAddress(ellipsisAddress);
  }, [allowanceDetail?.chainId, allowanceDetail?.contractAddress]);

  console.log('allowanceDetail: ', allowanceDetail);

  const [approvalsList, setApprovalsList] = useState<ISymbolApprovedItem[]>([]);
  const [revokedList, setRevokedList] = useState<ISymbolApprovedItem[]>([]);

  useEffect(() => {
    if (!allowanceDetail?.symbolApproveList) {
      return;
    }
    const approvals = allowanceDetail.symbolApproveList.filter(
      (item) => item.amount > 0 && !cancelApproveMap[item.symbol],
    );
    const revoked = allowanceDetail.symbolApproveList
      .filter((item) => item.amount === 0 || cancelApproveMap[item.symbol])
      .sort((a, b) => b.updateTime - a.updateTime);
    setApprovalsList(approvals);
    setRevokedList(revoked);
  }, [allowanceDetail.symbolApproveList, cancelApproveMap]);

  return (
    <div className="token-allowance-detail">
      <div className="dapp-info-detail flex-column-center">
        <ImageDisplay
          src={allowanceDetail?.icon}
          name={allowanceDetail?.name || 'Unknown'}
          defaultHeight={80}
          className="dapp-icon"
        />
        <div className="dapp-name">{allowanceDetail?.name || 'Unknown'}</div>
        {allowanceDetail?.url && (
          <div className="dapp-url flex-center">
            {!allowanceDetail.url.startsWith('https://') && (
              <CustomSvgV3 type="warning" className="flex-center warning-icon" fillColor="#EB7D50" />
            )}
            <span>
              <a href={allowanceDetail.url} target="_blank" rel="noreferrer">
                {allowanceDetail.url}
              </a>
            </span>
          </div>
        )}
        <div className="dapp-contract-container">
          <div className="dapp-contract-label">Contract Address</div>
          <div className="dapp-contract-address flex-between-center">
            {/*<div className="contract-address flex-1">{allowanceDetail?.contractAddress}</div>*/}
            <div className="contract-address flex-1">{ellipsisContractAddress}</div>
            <Copy
              toCopy={allowanceDetail?.contractAddress}
              iconType="copy"
              fillColor="#FFFFFFB3"
              className="copy-icon"
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="loading-container">
          <CircleLoading height={32} width={32} />
        </div>
      ) : (
        <div className="approve-list-container">
          {!!approvalsList.length && (
            <div className="valid-list">
              <div>
                <div className="title">Approvals</div>
                <div className="desc">
                  The dApp won&#39;t ask for your approval for the tokens below until their allowance is used up.
                </div>
              </div>
              {approvalsList.map((item) => (
                <div className="common-card" key={item.symbol}>
                  <div className="set-allowance-operation">
                    <div className="set-allowance-title flex-between-center">
                      <div className="token-image-item">
                        <TokenImageDisplay
                          symbol={item.symbol}
                          src={item.imageUrl}
                          size={'medium'}
                          subDisplay={true}
                          chain={allowanceDetail.chainId === 'AELF' ? 'main' : 'dApp'}
                        />
                        <div>{formatApproveSymbolShow(item.symbol)}</div>
                      </div>
                      <div className="revoke-button" onClick={async () => handleClickSwitch(false, item.symbol)}>
                        <CustomSvgV3 type="delete" fillColor="#E24505" className="delete-icon" />
                        Revoke
                        {/*<Switch*/}
                        {/*  className="login-switch"*/}
                        {/*  onChange={(checked: boolean) => handleClickSwitch(checked, item.symbol)}*/}
                        {/*  checked={checkCanClose(item)}*/}
                        {/*/>*/}
                      </div>
                    </div>

                    {/*<div className="set-allowance-tip">*/}
                    {/*  The dApp will not request your approval until the allowance is exhausted.*/}
                    {/*</div>*/}
                    <div className="divider" />
                    <div className="set-allowance-items">
                      <div className="set-allowance-label">Approved amount</div>
                      <div className="set-allowance-input">
                        {formatAmountShow(divDecimals(item.amount, item.decimals), 0)}
                      </div>
                      {/*<div className={clsx(!checkCanClose(item) && "allowance-amount-hidden")}>*/}
                      {/*</div>*/}
                    </div>
                  </div>
                </div>
              ))}
              <div className="divider-height-8" />
            </div>
          )}
          {revokedList.length && (
            <div className="history-list">
              <div>
                <div className="title">Revoked</div>
                <div className="desc">
                  To re-approve token allowance, go to the dApp site and initiate a transaction of the token type.
                </div>
              </div>
              <div>
                {revokedList.map((item) => (
                  <div className="common-card" key={item.symbol}>
                    <div className="allowance-revoked-item">
                      <div className="set-allowance-title flex-between-center">
                        <div className="token-image-item">
                          <TokenImageDisplay
                            symbol={item.symbol}
                            src={item.imageUrl}
                            size={'medium'}
                            subDisplay={true}
                            chain={allowanceDetail.chainId === 'AELF' ? 'main' : 'dApp'}
                          />
                          <div>{formatApproveSymbolShow(item.symbol)}</div>
                        </div>
                        <div className="revoke-time">{timeAgo(item.updateTime)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
