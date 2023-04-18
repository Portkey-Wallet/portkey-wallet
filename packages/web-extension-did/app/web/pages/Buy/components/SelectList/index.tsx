import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePayment } from 'store/Provider/hooks';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { DrawerType, PartialFiatType } from 'pages/Buy/const';
import './index.less';

export interface ICustomTokenListProps {
  onChange?: (v: PartialFiatType) => void;
  onClose?: () => void;
  title?: ReactNode;
  searchPlaceHolder?: string;
  drawerType: DrawerType;
}

const tokenList = [
  {
    symbol: 'ELF',
    chainId: 'AELF',
  },
];

export default function CustomList({ onChange, onClose, title, searchPlaceHolder, drawerType }: ICustomTokenListProps) {
  const { t } = useTranslation();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');
  const isTestNet = useIsTestnet();
  const { buyFiatList } = usePayment();
  const showFiatList = useMemo(() => {
    return filterWord === ''
      ? buyFiatList
      : buyFiatList.filter(
          (item) =>
            item.currency.toLocaleLowerCase().includes(filterWord) ||
            item.countryName?.toLocaleLowerCase().includes(filterWord),
        );
  }, [buyFiatList, filterWord]);
  const showTokenList = useMemo(() => {
    return filterWord === '' ? tokenList : tokenList.filter((item) => filterWord === item.symbol);
  }, [filterWord]);

  useEffect(() => {
    setOpenDrop(!!filterWord && !showFiatList.length && !showTokenList.length);
  }, [filterWord, showFiatList, showTokenList]);

  const renderCurrencyList = useMemo(
    () => (
      <>
        {showFiatList.map((fiat) => (
          <div
            key={`${fiat.country}_${fiat.currency}`}
            className="item currency-item flex"
            onClick={() => {
              onChange?.(fiat);
              onClose?.();
            }}>
            <div className="flag">
              <img src={fiat.icon || ''} alt="" />
            </div>
            <div className="text">{`${fiat.countryName || ''} - ${fiat.currency}`}</div>
          </div>
        ))}
      </>
    ),
    [onChange, onClose, showFiatList],
  );

  const renderTokenList = useMemo(
    () => (
      <>
        {showTokenList.map((token) => (
          <div
            key={token.symbol}
            className="item token-item flex"
            onClick={() => {
              // onChange?.(token);
              onClose?.();
            }}>
            <CustomSvg type="elf-icon" />
            <div className="flex-column text">
              <div>{token.symbol}</div>
              <div className="chain">{transNetworkText(token.chainId, isTestNet)}</div>
            </div>
          </div>
        ))}
      </>
    ),
    [isTestNet, onClose, showTokenList],
  );

  return (
    <div className="custom-list">
      <div className="header">
        <p>{title || 'Select'}</p>
        <CustomSvg type="Close2" onClick={onClose} />
      </div>
      <DropdownSearch
        overlayClassName="empty-dropdown"
        open={openDrop}
        value={filterWord}
        overlay={<div className="empty-tip">{t('There is no search result.')}</div>}
        inputProps={{
          onBlur: () => setOpenDrop(false),
          onChange: (e) => {
            const _value = e.target.value.replaceAll(' ', '');
            if (!_value) setOpenDrop(false);
            setFilterWord(_value);
          },
          placeholder: searchPlaceHolder || 'Search',
        }}
      />
      <div className="list">{drawerType === DrawerType.currency ? renderCurrencyList : renderTokenList}</div>
    </div>
  );
}
