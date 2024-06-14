import { Button, DrawerProps, ModalProps } from 'antd';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { useCallback, useMemo } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import BaseDrawer from 'components/BaseDrawer';
import CommonHeader from 'components/CommonHeader';
import BaseModal from 'components/BaseModal';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import clsx from 'clsx';
import { useNavigateState } from 'hooks/router';
import { TRampLocationState, TSendLocationState } from 'types/router';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { SendStage } from 'pages/Send';
import AsyncButton from 'components/AsyncButton';
import { ZERO } from '@portkey-wallet/im-ui-web';
import './index.less';

interface IConfirmGiftProps extends ModalProps, DrawerProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  totalAmount: string | number;
  totalAmountShow: string | number;
  totalAmountUsdShow: string;
  token: ICryptoBoxAssetItemType;
  otherChainToken?: ICryptoBoxAssetItemType;
  balance: string;
  balanceInUsd: string;
  txFee?: string;
  txFeeInUsd?: string;
  isShowBuy?: boolean;
  showTransfer?: boolean;
}
export default function ConfirmGift(props: IConfirmGiftProps) {
  const {
    onClose,
    onConfirm,
    open,
    totalAmount,
    totalAmountShow,
    totalAmountUsdShow,
    token,
    otherChainToken,
    balance,
    balanceInUsd,
    txFee,
    txFeeInUsd,
    isShowBuy,
    showTransfer,
  } = props;
  const wallet = useCurrentWalletInfo();
  const navigate = useNavigateState<TSendLocationState | TRampLocationState>();
  const { isNotLessThan768 } = useCommonState();
  const balanceNotEnough = useMemo(() => {
    if (balance === '--') return true;
    return ZERO.plus(balance).lt(totalAmount);
  }, [balance, totalAmount]);
  const onClickBuy = useCallback(() => {
    const tokenInfo = {
      symbol: token.symbol,
      chainId: token.chainId,
      decimals: Number(token.decimals),
      balance: '',
      tokenContractAddress: token.tokenContractAddress ?? token.address,
    };
    navigate('/buy', { state: { tokenInfo, mainPageInfo: { pageName: 'crypto-gift' } } });
  }, [navigate, token.address, token.chainId, token.decimals, token.symbol, token.tokenContractAddress]);
  const onClickTransfer = useCallback(async () => {
    if (!otherChainToken) {
      return;
    }
    navigate(`/send/token/${token.symbol}`, {
      state: {
        ...otherChainToken,
        address: otherChainToken.tokenContractAddress ?? otherChainToken.address ?? '',
        decimals: Number(token.decimals),
        toAccount: { address: `${wallet.caAddress}_${token.chainId}` },
        stage: SendStage.Amount,
      },
    });
  }, [navigate, otherChainToken, token.chainId, token.decimals, token.symbol, wallet.caAddress]);
  const mainContent = useMemo(
    () => (
      <div className="confirm-gift-wrapper flex-column-between">
        <CommonHeader
          className="header"
          rightElementList={[
            {
              customSvgType: 'SuggestClose',
              onClick: onClose,
            },
          ]}
        />
        <div className="confirm-gift-container flex-column-center flex-1">
          <div className="gift-container-title">Crypto Gift</div>
          <div className="gift-container-amount flex-center">
            <div className="amount-number">{totalAmountShow}</div>
            <div className="amount-symbol">{token.label ?? token.alias ?? token.symbol}</div>
          </div>
          {totalAmountUsdShow && (
            <div className="gift-container-usd">{totalAmountUsdShow ? `≈${totalAmountUsdShow}` : ''}</div>
          )}
          <div className="balance-label">balance</div>
          <div className={clsx('balance-container', 'flex', balance === '--' && 'balance-container-unable')}>
            <TokenImageDisplay width={24} className="symbol-icon" symbol={token.symbol} src={token.imageUrl} />
            <div className="balance-detail flex-1">
              <div className="balance-symbol flex-between-center">
                <div className="flex-1">{`${token.label ?? token.alias ?? token.symbol} (${
                  token.chainId === 'AELF' ? 'MainChain' : 'SideChain'
                } ${token.chainId})`}</div>
                {showTransfer && otherChainToken && txFee !== '--' ? (
                  <Button className="flex-center" type="primary" onClick={onClickTransfer}>{`Transfer ${
                    token.label ?? token.alias ?? token.symbol
                  }`}</Button>
                ) : isShowBuy ? (
                  <Button className="flex-center" type="primary" onClick={onClickBuy}>{`Buy ${
                    token.label ?? token.alias ?? token.symbol
                  }`}</Button>
                ) : null}
              </div>
              {balanceNotEnough || txFee === '--' ? (
                <>
                  <div className="balance-amount">{`Insufficient ${
                    balanceNotEnough && showTransfer && otherChainToken && txFee === '--' ? 'fee' : 'balance'
                  }`}</div>
                  {balanceNotEnough && showTransfer && otherChainToken && (
                    <div className="balance-tip">{`You can transfer some ${
                      token.label ?? token.alias ?? token.symbol
                    } from your ${otherChainToken.chainId} address`}</div>
                  )}
                </>
              ) : (
                <div className="balance-amount flex-row-center">
                  <div>{`${balance} ${token.label ?? token.alias ?? token.symbol}`}</div>
                  {balanceInUsd && <div className="balance-amount-usd">{` ${balanceInUsd}`}</div>}
                </div>
              )}
            </div>
          </div>
          {txFee === '--' ? null : (
            <div className="gift-container-fee flex-between">
              <div>Transaction Fee</div>
              <div>
                <div>
                  {txFee} {DEFAULT_TOKEN.symbol}
                </div>
                {txFeeInUsd && <div className="fee-usd">{txFeeInUsd}</div>}
              </div>
            </div>
          )}
        </div>
        <div className="confirm-gift-btn">
          <AsyncButton type="primary" disabled={balanceNotEnough || txFee == '--'} onClick={onConfirm}>
            Confirm
          </AsyncButton>
        </div>
      </div>
    ),
    [
      balance,
      balanceInUsd,
      balanceNotEnough,
      isShowBuy,
      onClickBuy,
      onClickTransfer,
      onClose,
      onConfirm,
      otherChainToken,
      showTransfer,
      token.alias,
      token.chainId,
      token.imageUrl,
      token.label,
      token.symbol,
      totalAmountShow,
      totalAmountUsdShow,
      txFee,
      txFeeInUsd,
    ],
  );

  return isNotLessThan768 ? (
    <BaseModal
      open={open}
      destroyOnClose
      wrapClassName="gift-select-asset-modal"
      maskClosable={true}
      closable={false}
      centered={true}
      onCancel={onClose}
      footer={null}>
      {mainContent}
    </BaseModal>
  ) : (
    <BaseDrawer
      open={open}
      destroyOnClose
      className="gift-select-asset-drawer"
      height="544px"
      maskClosable={true}
      onClose={onClose}
      placement="bottom">
      {mainContent}
    </BaseDrawer>
  );
}
