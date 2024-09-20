import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import CustomSvg from 'components/CustomSvg';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import TokenImageDisplay from '../TokenImageDisplay';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { Switch } from 'antd';
import './index.less';

export interface ICustomChainSelectProps {
  onChange?: (display: boolean, id?: string) => void;
  onClose?: () => void;
  item?: IUserTokenItemResponse;
}

export default function CustomChainSelect({ onChange, onClose, item }: ICustomChainSelectProps) {
  const { t } = useTranslation();
  const isMainnet = useIsMainnet();
  const calDisplayStatusText = useCallback(
    (item?: IUserTokenItemResponse) => {
      let partialChainId = undefined;
      if (item?.tokens && item?.tokens.length > 1) {
        partialChainId = item?.tokens?.[0]?.isDisplay ? item?.tokens?.[0]?.chainId : item?.tokens?.[1]?.chainId;
      } else {
        partialChainId = item?.tokens?.[0]?.chainId;
      }
      return item?.displayStatus === 'All'
        ? t('All Networks')
        : item?.displayStatus === 'Partial'
        ? t(transNetworkText(partialChainId || 'AELF', !isMainnet))
        : t('Balance Hidden');
    },
    [isMainnet, t],
  );
  if (item?.isDefault) {
    return null;
  }
  return (
    <div className="chain-select-container">
      <div className="header">
        <TokenImageDisplay className="custom-logo" width={32} symbol={item?.symbol} src={item?.imageUrl} />
        <div className="text-container">
          <div className="main-text">{item?.symbol}</div>
          <div className="sub-text">{calDisplayStatusText(item)}</div>
        </div>
        <CustomSvg type="CloseNew" onClick={onClose} />
      </div>
      <div className="content">
        {item?.tokens?.map((chainItem) => {
          return (
            <div className="content-item" key={`${chainItem.id}_${chainItem.symbol}`}>
              <div className="content-text">{transNetworkText(chainItem.chainId, !isMainnet)}</div>
              <Switch
                defaultChecked={chainItem.isDisplay}
                className="switch"
                onChange={() => {
                  onClose?.();
                  onChange?.(!chainItem.isDisplay, chainItem.id);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
