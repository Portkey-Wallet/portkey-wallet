import CustomSvg from 'components/CustomSvg';
import { useCallback } from 'react';
import { useExtensionBridgeButtonShow, useExtensionETransShow } from 'hooks/cms';
import { RampType } from '@portkey-wallet/ramp';
import { ETransType } from 'types/eTrans';
import { DepositType, IDepositItem, depositList } from './constant';
import './index.less';
import { useNavigateState } from 'hooks/router';
import { TRampLocationState } from 'types/router';
import { useExtensionRampEntryShow } from 'hooks/ramp';

export interface IDepositListProps {
  onClose: () => void;
  onClickBridge?: () => void;
  onClickETrans?: (type: ETransType) => void;
}

export default function DepositList({ onClose, onClickBridge, onClickETrans }: IDepositListProps) {
  const navigate = useNavigateState<TRampLocationState>();
  const { isBridgeShow } = useExtensionBridgeButtonShow();
  const { isBuySectionShow, isSellSectionShow } = useExtensionRampEntryShow();
  const { isETransDepositShow, isETransWithdrawShow } = useExtensionETransShow();

  const handleBuy = useCallback(() => {
    onClose();
    navigate('/buy');
  }, [navigate, onClose]);

  const handleSell = useCallback(() => {
    onClose();
    navigate('/buy', { state: { side: RampType.SELL } });
  }, [navigate, onClose]);

  const formatDepositList = depositList.filter((item) => {
    if (item.type === DepositType.buy) {
      return isBuySectionShow;
    }
    if (item.type === DepositType.sell) {
      return isSellSectionShow;
    }
    if (item.type === DepositType.bridge) {
      return isBridgeShow;
    }
    if (item.type === DepositType['deposit-crypto']) {
      return isETransDepositShow;
    }
    if (item.type === DepositType['withdraw-crypto']) {
      return isETransWithdrawShow;
    }
    return true;
  });

  const handleClickItem = useCallback(
    (item: IDepositItem) => {
      console.log('===handleClickItem', item, DepositType['deposit-crypto']);
      if (item.type === DepositType.buy) {
        handleBuy();
        return;
      }
      if (item.type === DepositType.sell) {
        handleSell();
        return;
      }
      if (item.type === DepositType.bridge) {
        onClickBridge?.();
        return;
      }
      if (item.type === DepositType['deposit-crypto']) {
        onClickETrans?.(ETransType.Deposit);
        return;
      }
      if (item.type === DepositType['withdraw-crypto']) {
        onClickETrans?.(ETransType.Withdraw);
        return;
      }
    },
    [handleBuy, handleSell, onClickBridge, onClickETrans],
  );

  return (
    <div className="deposit-list-wrapper">
      {formatDepositList.map((item, index) => {
        return (
          <div
            className="flex-row-center deposit-item-container"
            key={`${item.type}_${index}`}
            onClick={() => handleClickItem(item)}>
            <CustomSvg type={item.icon} />
            <div className="deposit-item">
              <div className="deposit-item-title">{item.title}</div>
              <div className="deposit-item-desc">{item.desc}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
