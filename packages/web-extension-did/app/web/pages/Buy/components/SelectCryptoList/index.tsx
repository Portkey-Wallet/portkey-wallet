import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PartialFiatType } from 'pages/Buy/const';
import './index.less';
import { useSellCrypto } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { IRampCryptoItem } from '@portkey-wallet/ramp';
import { getBuyCrypto } from '@portkey-wallet/utils/ramp';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { transNetworkText } from '@portkey-wallet/utils/activity';

export interface ISelectCryptoListProps {
  onChange?: (v: PartialFiatType) => void;
  onClose?: () => void;
  title?: ReactNode;
  searchPlaceHolder?: string;
  defaultFiat?: string;
  country?: string;
}

export default function SelectCryptoList({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  defaultFiat = '',
  country = '',
}: ISelectCryptoListProps) {
  const { t } = useTranslation();
  const isMainNet = useIsMainnet();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');
  const filterCryptoListRef = useRef<IRampCryptoItem[]>([]);
  const { sellCryptoList: totalCryptoList } = useSellCrypto();

  const getFilterFiatList = useCallback(async () => {
    const { buyCryptoList } = await getBuyCrypto({ fiat: defaultFiat, country });
    filterCryptoListRef.current = buyCryptoList;
  }, [country, defaultFiat]);

  useEffect(() => {
    if (defaultFiat || country) {
      getFilterFiatList();
    }
  }, [country, defaultFiat, getFilterFiatList]);

  const cryptoList: IRampCryptoItem[] = useMemo(() => {
    return defaultFiat ? filterCryptoListRef.current : totalCryptoList;
  }, [defaultFiat, totalCryptoList]);

  const showCryptoList = useMemo(() => {
    return filterWord === '' ? cryptoList : cryptoList.filter((item) => filterWord === item.symbol);
  }, [cryptoList, filterWord]);

  useEffect(() => {
    setOpenDrop(!!filterWord && !showCryptoList.length);
  }, [filterWord, showCryptoList.length]);

  const renderCryptoList = useMemo(
    () => (
      <>
        {showCryptoList.map((crypto) => (
          <div
            key={crypto.symbol}
            className="item token-item flex"
            onClick={() => {
              onChange?.(crypto);
              onClose?.();
            }}>
            <CustomSvg type="elf-icon" />
            <div className="flex-column text">
              <div>{crypto.symbol}</div>
              <div className="chain">{transNetworkText(crypto.network?.split('-')[1], !isMainNet)}</div>
            </div>
          </div>
        ))}
      </>
    ),
    [isMainNet, onChange, onClose, showCryptoList],
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
      <div className="list">{renderCryptoList}</div>
    </div>
  );
}
