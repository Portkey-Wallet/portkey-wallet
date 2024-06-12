import { Button, DrawerProps, ModalProps } from 'antd';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { useMemo } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import BaseDrawer from 'components/BaseDrawer';
import { useNavigate } from 'react-router';
import CommonHeader from 'components/CommonHeader';
import BaseModal from 'components/BaseModal';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { DEFAULT_TOKEN } from '@portkey-wallet/constants/constants-ca/wallet';
import './index.less';

interface IConfirmGiftProps extends ModalProps, DrawerProps {
  onClose: () => void;
  onConfirm: () => Promise<void>;
  totalAmount: string | number;
  totalAmountInUsd: string;
  token: ICryptoBoxAssetItemType;
  balance: string;
  balanceInUsd: string;
  txFee?: string;
  txFeeInUsd?: string;
}
export default function ConfirmGift(props: IConfirmGiftProps) {
  const { onClose, open, totalAmount, totalAmountInUsd, token, balance, balanceInUsd, txFee, txFeeInUsd } = props;
  const navigate = useNavigate();
  const isMainNet = useIsMainnet();
  const { isNotLessThan768 } = useCommonState();
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
          <div className="gift-container-title">Portkey Crypto Gifts</div>
          <div className="gift-container-amount flex-center">
            <div className="amount-number">{totalAmount}</div>
            <div className="amount-symbol">{token.symbol}</div>
          </div>
          {isMainNet && totalAmountInUsd && <div className="gift-container-usd">{`≈${totalAmountInUsd}`}</div>}
          <div className="balance-label">balance</div>
          <div className="balance-container flex">
            <TokenImageDisplay width={24} className="symbol-icon" symbol={token.symbol} src={token.imageUrl} />
            <div className="balance-detail">
              <div className="balance-symbol">{`${token.symbol} (${
                token.chainId === 'AELF' ? 'MainChain' : 'SideChain'
              } ${token.chainId})`}</div>
              <div className="balance-amount flex-row-center">
                <div>{`${balance} ${token.symbol}`}</div>
                {isMainNet && balanceInUsd && <div className="usd">{` ${balanceInUsd}`}</div>}
              </div>
            </div>
          </div>
          <div className="gift-container-fee flex-between">
            <div>Transaction Fee</div>
            <div>
              <div>
                {txFee} {DEFAULT_TOKEN.symbol}
              </div>
              {isMainNet && txFeeInUsd && <div className="fee-usd">{txFeeInUsd}</div>}
            </div>
          </div>
        </div>
        <div className="confirm-gift-btn">
          <Button
            type="primary"
            disabled={balance == '--' || txFee == '--'}
            onClick={() => navigate('/crypto-gifts/success')}>
            Confirm
          </Button>
        </div>
      </div>
    ),
    [
      balance,
      balanceInUsd,
      isMainNet,
      navigate,
      onClose,
      token.chainId,
      token.imageUrl,
      token.symbol,
      totalAmount,
      totalAmountInUsd,
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
