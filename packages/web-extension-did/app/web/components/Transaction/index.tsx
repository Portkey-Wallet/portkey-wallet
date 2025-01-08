import { SHOW_FROM_TRANSACTION_TYPES, TransactionTypes } from '@portkey-wallet/constants/constants-ca/activity';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { fetchActivity } from '@portkey-wallet/store/store-ca/activity/api';
import { ActivityItemType, TransactionStatus } from '@portkey-wallet/types/types-ca/activity';
import { getExploreLink } from '@portkey-wallet/utils';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import {
  AmountSign,
  formatStr2EllipsisStr,
  formatWithCommas,
  formatAmountUSDShow,
  formatTokenAmountShowWithDecimals,
} from '@portkey-wallet/utils/converter';
import clsx from 'clsx';
import Copy from 'components/Copy';
import CustomSvg, { SvgType } from 'components/CustomSvg';
// import { CustomSvgV3 } from 'components/CustomSvgV3';
import ImageForTwo from 'pages/components/ImageForTwo';

import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import './index.less';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { useCurrentChain, useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { addressFormat } from '@portkey-wallet/utils';
// import PromptFrame from 'pages/components/PromptFrame';
import { useFreshTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
// import { BalanceTab } from '@portkey-wallet/constants/constants-ca/assets';
// import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { ChainId } from '@portkey-wallet/types';
// import { useLocationState, useNavigateState } from 'hooks/router';
// import { ITransactionLocationState, THomePageLocationState } from 'types/router';
import { getSeedTypeTag } from 'utils/assets';
import CommonHeader, { CustomSvgPlaceholderSize } from 'components/CommonHeader';
import { Button } from 'antd';
import ImageDisplay from 'pages/components/ImageDisplay';

import { CustomSvgV3 } from 'components/CustomSvgV3';

import { contractStatusEnum } from '@portkey-wallet/constants/constants-ca/common';

import NFTImageDisplay from 'pages/components/NFTImageDisplay';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

export interface IActivityMultiplyToken {
  symbol: string;
  url?: string;
  isReceived: boolean;
  amount: string;
  decimals: string;
}

export default function Transaction(props: {
  state: { item: any; previousPage: string; chainId: string };
  closeFun: Function;
}) {
  const { state, closeFun } = props;

  console.log('state', state);
  const { t } = useTranslation();
  // const { state } = useLocationState<ITransactionLocationState>();
  const chainId = state.chainId;
  const from = state?.previousPage;
  const isMainnet = useIsMainnet();
  const caAddressInfoList = useCaAddressInfoList();
  const caAddressInfos = useMemo(() => {
    const result = caAddressInfoList.filter((ele) => ele.chainId === chainId);
    return result?.length > 0 ? result : caAddressInfoList;
  }, [caAddressInfoList, chainId]);

  useFreshTokenPrice();
  const defaultToken = useDefaultToken(chainId ? (chainId as ChainId) : undefined);

  // Obtain data through routing to ensure that the page must have data and prevent Null Data Errors.
  const [activityItem, setActivityItem] = useState<ActivityItemType>(state.item);
  const feeInfo = useMemo(() => activityItem.transactionFees, [activityItem.transactionFees]);
  const chainInfo = useCurrentChain(activityItem.fromChainId);

  // Obtain data through api to ensure data integrity.
  // Because some data is not returned in the Activities API. Such as from, to.
  useEffectOnce(() => {
    const params = {
      caAddressInfos,
      transactionId: activityItem.transactionId,
      blockHash: activityItem.blockHash,
    };
    fetchActivity(params)
      .then((res) => {
        setActivityItem(res);
      })
      .catch((error) => {
        throw Error(JSON.stringify(error));
      });
  });

  const status = useMemo(() => {
    if (activityItem?.status === TransactionStatus.Mined)
      return {
        text: 'Success',
        style: 'confirmed',
      };
    return {
      text: 'Failed',
      style: 'failed',
    };
  }, [activityItem]);

  // const nav = useNavigateState<THomePageLocationState>();
  // const onClose = useCallback(() => {
  //   if (from && from === BalanceTab.ACTIVITY) {
  //     // come in from the activityTab, go to the homepage activityTab
  //     nav('/', { state: { key: BalanceTab.ACTIVITY } });
  //   } else {
  //     // come in from the token activity list, go back
  //     nav(-1);
  //   }
  // }, [from, nav]);
  const onClose = useCallback(() => {
    closeFun(false);
  }, [from]);

  const isNft = useMemo(() => !!activityItem?.nftInfo?.nftId, [activityItem?.nftInfo?.nftId]);

  const currentNetwork = useCurrentNetworkInfo();

  const nftHeaderUI = useCallback(() => {
    const { nftInfo, amount, decimals, isReceived } = activityItem;
    const seedTypeTag = nftInfo ? getSeedTypeTag(nftInfo) : '';

    return (
      <div className="nft-amount">
        <div className="assets flex-center">
          {seedTypeTag && <CustomSvg type={seedTypeTag} />}
          {nftInfo?.imageUrl ? (
            <img className="assets-img" src={nftInfo?.imageUrl} />
          ) : (
            <p>{nftInfo?.alias?.slice(0, 1)}</p>
          )}
        </div>
        <div className="info">
          <p className={`quantity ${isReceived ? 'is-received' : 'is-sent'}`}>{`${
            isReceived ? '+' : '-'
          } ${formatTokenAmountShowWithDecimals(amount, decimals)} NFT`}</p>
          <p className="index">
            <span>{nftInfo?.alias}</span>
            <span className="token-id">#{nftInfo?.nftId}</span>
          </p>
        </div>
      </div>
    );
  }, [activityItem]);

  const renderStatusIcon = useCallback((item: ActivityItemType) => {
    let svg = '';
    if (item.status === contractStatusEnum.MINED) svg = 'SuggestCheck';
    if (item.status === contractStatusEnum.FAILED) svg = 'SuggestClose2';
    if (item.status === contractStatusEnum.PENDING) svg = 'Status';
    if (svg) return <CustomSvg className="flex-center" type={svg as SvgType} />;
    return null;
  }, []);

  const renderEmptyTokenForDapp = useCallback((item: ActivityItemType) => {
    return (
      <>
        <ImageDisplay
          src={item.dappIcon}
          name={item.dappName || 'Unknown'}
          defaultWidth={40}
          defaultHeight={40}
          className="system-activity-icon"
        />
        <div className="dapp-name">{item.dappName || item.transactionName}</div>
      </>
    );
  }, []);

  const renderSystemActivityItem = useCallback(
    (item: ActivityItemType) => (
      <>
        <div className="icon-box">
          <ImageDisplay
            src={item.listIcon}
            backupSrc="SystemActivity"
            defaultHeight={40}
            defaultWidth={40}
            className="system-activity-icon"
          />
          {item.sourceIcon && (
            <ImageDisplay
              src={item.sourceIcon}
              backupSrc="SystemActivity"
              defaultHeight={20}
              defaultWidth={20}
              className="source-icon"
            />
          )}
        </div>

        <div className="activity-item-system-detail">
          <span className="flex-row-center gap-4">{item?.transactionName}</span>
        </div>
      </>
    ),
    [renderStatusIcon],
  );
  const renderActivityAmount = useCallback(
    (item: ActivityItemType) => {
      const { isReceived, amount, decimals, symbol, currentTxPriceInUsd, nftInfo } = item;
      const sign = isReceived ? AmountSign.PLUS : AmountSign.MINUS;

      const amountShow = formatWithCommas({
        sign,
        amount,
        decimals,
        digits: Number(decimals),
      });
      return (
        <div className={clsx('activity-item-amount')}>
          <div
            className={clsx(
              'transaction-amount',
              isReceived && 'received-amount',
              Number(amountShow) > 0 ? 'success' : 'fail',
            )}>
            <span className="amount-show">{`${amountShow} `}</span>
            {(nftInfo?.alias || symbol) && <span className="amount-symbol">{` ${nftInfo?.alias || symbol}`}</span>}
          </div>
          <div className={clsx('transaction-convert', !isMainnet && 'hidden-transaction-convert')}>
            {formatAmountUSDShow(currentTxPriceInUsd)}
          </div>
        </div>
      );
    },
    [isMainnet],
  );

  const renderTxActivityItemForDefault = useCallback(
    (item: ActivityItemType) => {
      return (
        <>
          {item.nftInfo ? (
            <NFTImageDisplay
              src={item.listIcon}
              isSeed={item.nftInfo.isSeed}
              seedType={item.nftInfo.seedType}
              alias={item.nftInfo.alias}
              className="nft-activity-icon"
            />
          ) : (
            <div className="token-activity-icon-box">
              <TokenImageDisplay className="token-activity-icon" src={item.listIcon} symbol={item.symbol} />
              {item.statusIcon && (
                <TokenImageDisplay className="token-status-icon" src={item.statusIcon} symbol={item.symbol} />
              )}
            </div>
          )}
          <div className="activity-item-detail flex-between-center">{renderActivityAmount(item)}</div>
        </>
      );
    },
    [renderActivityAmount],
  );

  const renderActivityAmountForMulToken = useCallback((item: IActivityMultiplyToken[]) => {
    const [tokenTop, tokenBottom] = item;
    const sameDirection = tokenTop.isReceived === tokenBottom.isReceived;

    return (
      <div className={clsx('activity-item-amount', sameDirection ? 'same-direction' : 'opposite-direction')}>
        {item.map((_token, index) => (
          <div
            key={`transaction-mul-token-amount_${index}`}
            className={clsx(
              'transaction-amount',
              _token.isReceived && 'received-amount',
              `transaction-amount-${index}`,
            )}>
            {_token.symbol && <span className="amount-symbol">{` ${_token.symbol}`}</span>}
            {/* {!_token.isReceived && <CustomSvgV3 type="arrow right thin" />} */}
            <CustomSvgV3 type="arrow right thin" />
          </div>
        ))}
      </div>
    );
  }, []);

  const renderMulTokenForDapp = useCallback(
    (item: ActivityItemType) => {
      const { operations = [] } = item;
      if (operations.length < 2) return null;
      let [tokenTop, tokenBottom] = operations.map((_token) => ({
        symbol: _token.nftInfo ? _token.nftInfo.alias : _token.symbol,
        url: _token.nftInfo ? _token.nftInfo.imageUrl : _token.icon,
        isReceived: _token.isReceived,
        amount: _token.amount,
        decimals: _token.decimals,
      }));
      const sameDirection = tokenTop.isReceived === tokenBottom.isReceived;
      if (!sameDirection && !tokenTop.isReceived) {
        [tokenBottom, tokenTop] = [tokenTop, tokenBottom];
      }
      let renderTopIconInfo = { url: tokenTop.url, symbol: tokenTop.symbol };
      let renderBottomIconInfo = { url: tokenBottom.url, symbol: tokenBottom.symbol };
      if (!sameDirection) {
        [renderTopIconInfo, renderBottomIconInfo] = [renderBottomIconInfo, renderTopIconInfo];
      }
      return (
        <>
          <ImageForTwo className="token-activity-icon" iconTop={renderTopIconInfo} iconBottom={renderBottomIconInfo} />
          <div className="activity-item-detail flex-between-center">
            {renderActivityAmountForMulToken([tokenTop, tokenBottom])}
          </div>
        </>
      );
    },
    [renderActivityAmountForMulToken],
  );

  const renderSingleTokenForDapp = useCallback(
    (item: ActivityItemType) => {
      return (
        <>
          {item.nftInfo ? (
            <NFTImageDisplay
              src={item.nftInfo.imageUrl}
              isSeed={item.nftInfo.isSeed}
              seedType={item.nftInfo.seedType}
              alias={item.nftInfo.alias}
              className="nft-activity-icon"
            />
          ) : (
            <div className="token-activity-icon-box">
              <TokenImageDisplay className="token-activity-icon" src={item.listIcon} symbol={item.symbol} />
              {item.statusIcon && (
                <TokenImageDisplay className="token-status-icon" src={item.statusIcon} symbol={item.symbol} />
              )}
            </div>
          )}
          <div className="activity-item-detail flex-between-center">{renderActivityAmount(item)}</div>
        </>
      );
    },
    [renderActivityAmount],
  );

  const renderTxActivityItem = useCallback(
    (item: ActivityItemType) => {
      const { operations = [], dappName } = item;
      if (operations.length !== 0) return renderMulTokenForDapp(item);
      if (dappName) return renderSingleTokenForDapp(item);
      return renderTxActivityItemForDefault(item);
    },
    [renderMulTokenForDapp, renderSingleTokenForDapp, renderTxActivityItemForDefault],
  );

  const tokenHeaderUI = useCallback(() => {
    console.log('activityItem', activityItem);
    // const {
    //   amount,
    //   isReceived,
    //   decimals,
    //   symbol,
    //   transactionType,
    //   operations,
    //   currentTxPriceInUsd = '',
    // } = activityItem;
    // const sign = isReceived ? AmountSign.PLUS : AmountSign.MINUS;
    /* Hidden during [SocialRecovery, AddManager, RemoveManager] */
    // if (transactionType && SHOW_FROM_TRANSACTION_TYPES.includes(transactionType)) {
    //   if (transactionType === TransactionTypes.SWAP) {
    //     return (
    //       <>
    //         {operations && (
    //           <>
    //             <div className="operations">
    //               <ImageDisplay src={operations[0].icon} defaultWidth={40} defaultHeight={40} />
    //               <ImageDisplay
    //                 className="operations-1"
    //                 src={operations[1].icon}
    //                 defaultWidth={40}
    //                 defaultHeight={40}
    //               />
    //             </div>
    //             <div className="swap-text-box">
    //               <span>{operations[0].symbol}</span>
    //               <CustomSvgV3 className="arrow-right" type={'arrow right thin'} />
    //               <span>{operations[1].symbol}</span>
    //             </div>
    //           </>
    //         )}
    //       </>
    //     );
    //   }
    //   if (transactionType === TransactionTypes.BATCH_BUY_NOW) {
    //     return (
    //       <>
    //         {operations && (
    //           <>
    //             <div className="operations">
    //               <ImageDisplay src={operations[1]?.nftInfo?.imageUrl} defaultWidth={40} defaultHeight={40} />
    //               <ImageDisplay
    //                 className="operations-1"
    //                 src={operations[0].icon}
    //                 defaultWidth={40}
    //                 defaultHeight={40}
    //               />
    //             </div>
    //             <div className="swap-text-box">
    //               <span>{operations[1].nftInfo?.alias}</span>
    //               <CustomSvgV3 className="arrow-right" type={'arrow right thin'} />
    //               <span>{operations[0].symbol}</span>
    //             </div>
    //           </>
    //         )}
    //       </>
    //     );
    //   }

    //   if (transactionType === TransactionTypes.DEAL) {
    //     return (
    //       <>
    //         {operations && (
    //           <>
    //             <div className="operations">
    //               <ImageDisplay src={operations[0].icon} defaultWidth={40} defaultHeight={40} />
    //               <ImageDisplay
    //                 className="operations-1"
    //                 src={operations[1]?.nftInfo?.imageUrl}
    //                 defaultWidth={40}
    //                 defaultHeight={40}
    //               />
    //             </div>
    //             <div className="swap-text-box">
    //               <span>{operations[0].symbol}</span>
    //               <CustomSvgV3 className="arrow-right" type={'arrow right thin'} />
    //               <span>{operations[1].nftInfo?.alias}</span>
    //             </div>
    //           </>
    //         )}
    //       </>
    //     );
    //   }

    //   if (transactionType === TransactionTypes.PALY) {
    //     return (
    //       <div className="token-amount flex-column-center">
    //         <div className="token-icon-box">
    //           <ImageDisplay src={activityItem.dappIcon} defaultHeight={60} defaultWidth={60} />
    //         </div>
    //         <div className="token-amount-symbol">{activityItem.dappName}</div>
    //       </div>
    //     );
    //   }
    //   if (transactionType === TransactionTypes.JOIN) {
    //     return (
    //       <div className="token-amount flex-column-center">
    //         <div className="token-icon-box">
    //           <ImageDisplay name={activityItem.dappName} defaultHeight={60} defaultWidth={60} />
    //         </div>
    //         <div className="token-amount-symbol">{activityItem.transactionName}</div>
    //       </div>
    //     );
    //   }
    //   return (
    //     <div className="token-amount flex-column-center">
    //       <div className="token-icon-box">
    //         <ImageDisplay
    //           src={activityItem.listIcon}
    //           name={activityItem.dappName || 'Unknown'}
    //           defaultHeight={60}
    //           defaultWidth={60}
    //         />
    //         {activityItem.statusIcon && (
    //           <ImageDisplay
    //             src={activityItem.statusIcon}
    //             name={activityItem.dappName || 'Unknown'}
    //             defaultHeight={20}
    //             defaultWidth={20}
    //             className="source-icon"
    //           />
    //         )}
    //       </div>

    //       <div className="token-amount-text flex-center">
    //         <div className="token-amount-number">
    //           {formatWithCommas({ amount, decimals, sign, digits: Number(decimals) })}
    //         </div>
    //         <div className="token-amount-symbol">{symbol ?? ''}</div>
    //       </div>
    //       {isMainnet && <div className="usd">{formatAmountUSDShow(currentTxPriceInUsd)}</div>}
    //     </div>
    //   );
    // } else {
    //   return (
    //     <div className="wallet-activity-header">
    //       <div className="token-icon-box">
    //         <ImageDisplay
    //           src={activityItem.listIcon}
    //           name={activityItem.transactionName || 'Unknown'}
    //           defaultHeight={60}
    //           defaultWidth={60}
    //         />
    //         {activityItem.sourceIcon && (
    //           <ImageDisplay
    //             className="source-icon"
    //             src={activityItem.sourceIcon}
    //             defaultHeight={20}
    //             defaultWidth={20}
    //           />
    //         )}
    //       </div>

    //       <div className="method-name">{activityItem.transactionName}</div>
    //     </div>
    //   );
    // }

    const isEmptyToken = !(activityItem.nftInfo || activityItem.symbol || activityItem.operations?.length);
    const isDappTx = !!activityItem.dappName;
    // show login
    const isShowEmptyTokenForDapp = isEmptyToken && isDappTx;
    const isShowSystemForDefault = isEmptyToken && !isDappTx;
    const isShowTx = !isEmptyToken;

    console.log('isShowSystemForDefault', isShowSystemForDefault);
    return (
      <>
        {isShowEmptyTokenForDapp && renderEmptyTokenForDapp(activityItem)}
        {isShowSystemForDefault && renderSystemActivityItem(activityItem)}
        {isShowTx && renderTxActivityItem(activityItem)}
      </>
    );
  }, [activityItem, renderEmptyTokenForDapp, renderSystemActivityItem, renderTxActivityItem]);

  const statusAndDateUI = useCallback(() => {
    return (
      <div className="status-wrap">
        <p className="label">
          <span className="left">{t('Date')}</span>
          <span className="right">{formatTransferTime(activityItem.timestamp)}</span>
        </p>
        <p className="label">
          <span className="left">{t('Status')}</span>
          <span className={clsx(['right', status.style])}>{t(status.text)}</span>
        </p>
      </div>
    );
  }, [activityItem.timestamp, status.style, status.text, t]);

  const fromToUI = useCallback(() => {
    const { fromAddress, fromChainId, toAddress, toChainId, transactionType } = activityItem;
    const transFromAddress = addressFormat(fromAddress, fromChainId, currentNetwork.walletType);
    const transToAddress = addressFormat(toAddress, toChainId, currentNetwork.walletType);

    /* Hidden during [SocialRecovery, AddManager, RemoveManager] */
    return (
      transactionType &&
      SHOW_FROM_TRANSACTION_TYPES.includes(transactionType) && (
        <div className="account-wrap">
          <p className="label">
            <span className="left">{t('From')}</span>
            <span className="right">{formatStr2EllipsisStr(transFromAddress, [7, 8])}</span>
          </p>
          {toAddress && (
            <p className="label">
              <div className="content">
                {/* <span className="left name">{from}</span> */}
                {fromAddress && (
                  <span className="left address-wrap">
                    <span className="right">{t('To')}</span>
                  </span>
                )}
              </div>
              <div className="content">
                {/* <span className="right name">{to}</span> */}
                {toAddress && (
                  <span className="right address-wrap">
                    <span>{formatStr2EllipsisStr(transToAddress, [7, 8])}</span>
                  </span>
                )}
              </div>
            </p>
          )}
        </div>
      )
    );
  }, [activityItem, currentNetwork.walletType, t]);

  const networkUI = useCallback(() => {
    /* Hidden during [SocialRecovery, AddManager, RemoveManager] */
    const { transactionType, fromChainId, toChainId, fromChainIcon, toChainIcon } = activityItem;
    const from = transNetworkText(fromChainId, !isMainnet);
    const to = transNetworkText(toChainId, !isMainnet);

    return (
      transactionType &&
      SHOW_FROM_TRANSACTION_TYPES.includes(transactionType) &&
      transactionType !== TransactionTypes.BATCH_BUY_NOW && (
        <div className="network-wrap">
          <p className="label">
            <span className="left">{t('Source network')}</span>
            <span className="right">
              <ImageDisplay src={fromChainIcon} defaultHeight={18} defaultWidth={18} />
              <div>{from}</div>
            </span>
          </p>
          <p className="label">
            <span className="left">{t('Destination network')}</span>
            <span className="right">
              <ImageDisplay src={toChainIcon} defaultHeight={18} defaultWidth={18} />
              <div>{to}</div>
            </span>
          </p>
        </div>
      )
    );
  }, [activityItem, isMainnet, t]);

  const noFeeUI = useCallback(() => {
    return (
      <div className="right">
        <div>{`0 ELF`}</div> {isMainnet && <div className="right-usd">{`$ 0`}</div>}
      </div>
    );
  }, [isMainnet]);

  const feeUI = useCallback(() => {
    return activityItem.isDelegated ? (
      <div className="value">
        <span className="left">{t('Network fee')}</span>
        {noFeeUI()}
      </div>
    ) : (
      <div className="value">
        <span className="left">{t('Network fee')}</span>
        <span className="right flex-column">
          {(!feeInfo || feeInfo?.length === 0) && noFeeUI()}
          {feeInfo?.length > 0 &&
            feeInfo.map((item, idx) => {
              return (
                <div key={'transactionFee' + idx} className="right-item">
                  <div>{`${formatWithCommas({
                    amount: item.fee,
                    decimals: item.decimals || defaultToken.decimals,
                    digits: Number(item.decimals),
                  })} ${item.symbol ?? ''}`}</div>
                  {isMainnet && <div className="right-usd">{formatAmountUSDShow(item?.feeInUsd ?? 0)}</div>}
                </div>
              );
            })}
        </span>
      </div>
    );
  }, [activityItem.isDelegated, defaultToken.decimals, feeInfo, isMainnet, noFeeUI, t]);

  const transactionUI = useCallback(() => {
    const { isReceived } = activityItem;
    return (
      <div className="money-wrap">
        <p className="label">
          <span className="left">{t('Txn ID')}</span>
          <span className="right tx-id">
            {`${formatStr2EllipsisStr(activityItem.transactionId, [10, 0])} `}
            <Copy toCopy={activityItem.transactionId} iconType="copy" />
          </span>
        </p>
        {isReceived ? null : <p>{feeUI()}</p>}
      </div>
    );
  }, [activityItem, feeUI, t]);

  const openOnExplorer = useCallback(() => {
    return getExploreLink(chainInfo?.explorerUrl || '', activityItem.transactionId || '', 'transaction');
  }, [activityItem.transactionId, chainInfo?.explorerUrl]);

  const viewOnExplorerUI = useCallback(() => {
    return (
      <a className="link" target="blank" href={openOnExplorer()}>
        {t('View on Explorer')}
      </a>
    );
  }, [openOnExplorer, t]);

  const swapUI = useCallback(() => {
    const { operations, dappName, transactionType } = activityItem;
    return (
      <>
        {transactionType === TransactionTypes.SWAP && operations ? (
          <div className="swap-wrap">
            <div>
              <span>Provider</span>
              <span>{dappName}</span>
            </div>
            <div>
              <span>You paid</span>
              <span>
                - {Number(operations[0].amount) / 10 ** Number(operations[0].decimals)} {operations[0].symbol}
              </span>
            </div>
            <div>
              <span>You received</span>
              <span className="received">
                + {Number(operations[1].amount) / 10 ** Number(operations[1].decimals)} {operations[1].symbol}
              </span>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }, [activityItem]);

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['transaction-detail-modal-new'])}>
        <CommonHeader
          title={
            isNft
              ? activityItem.transactionName
              : !activityItem.isSystem
              ? activityItem.transactionName
              : 'Wallet activity'
          }
          rightElementList={[
            {
              customSvgType: 'close thin',
              customSvgPlaceholderSize: CustomSvgPlaceholderSize.MD,
              onClick: onClose,
            },
          ]}
        />
        <div className="transaction-detail-body">
          <div className="transaction-info">
            <div className="method-wrap">{isNft ? nftHeaderUI() : tokenHeaderUI()}</div>
            {statusAndDateUI()}
            {fromToUI()}
            {networkUI()}
            {transactionUI()}
            {swapUI()}
          </div>
        </div>
        <div className="transaction-footer">
          <Button className="btn-link portkey-btn portkey-btn-primary btn" type="primary">
            {viewOnExplorerUI()}
          </Button>
          {/* {isPrompt && <PromptEmptyElement />} */}
        </div>
      </div>
    );
  }, [
    activityItem.transactionName,
    activityItem.transactionType,
    fromToUI,
    isNft,
    networkUI,
    nftHeaderUI,
    onClose,
    statusAndDateUI,
    swapUI,
    tokenHeaderUI,
    transactionUI,
    viewOnExplorerUI,
  ]);

  return <>{mainContent()}</>;
}
