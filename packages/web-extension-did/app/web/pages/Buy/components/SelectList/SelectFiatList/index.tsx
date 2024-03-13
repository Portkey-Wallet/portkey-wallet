import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../index.less';
import { useBuyFiat } from '@portkey-wallet/hooks/hooks-ca/ramp';
import { IRampFiatItem } from '@portkey-wallet/ramp';
import { getSellFiat } from '@portkey-wallet/utils/ramp';

export interface ISelectFiatListProps {
  onChange?: (v: IRampFiatItem) => void;
  onClose?: () => void;
  title?: ReactNode;
  searchPlaceHolder?: string;
  defaultCrypto?: string;
  network?: string; // chain-chainId
}

export default function SelectFiatList({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  defaultCrypto = '',
  network = '',
}: ISelectFiatListProps) {
  const { t } = useTranslation();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');
  const [filterFiatList, setFilterFiatList] = useState<IRampFiatItem[]>([]);
  const { buyFiatList: totalFiatList } = useBuyFiat();

  const getFilterFiatList = useCallback(async () => {
    const { sellFiatList } = await getSellFiat({ crypto: defaultCrypto, network });
    setFilterFiatList(sellFiatList);
  }, [defaultCrypto, network]);

  useEffect(() => {
    if (defaultCrypto && network) {
      getFilterFiatList();
    }
  }, [defaultCrypto, getFilterFiatList, network]);

  const fiatList: IRampFiatItem[] = useMemo(() => {
    return defaultCrypto ? filterFiatList : totalFiatList;
  }, [defaultCrypto, filterFiatList, totalFiatList]);

  const showFiatList = useMemo(() => {
    return filterWord === ''
      ? fiatList
      : fiatList.filter(
          (item) =>
            item.symbol.toLowerCase().includes(filterWord.toLowerCase()) ||
            item.countryName?.toLowerCase().includes(filterWord.toLowerCase()),
        );
  }, [fiatList, filterWord]);

  useEffect(() => {
    setOpenDrop(!!filterWord && !showFiatList.length);
  }, [filterWord, showFiatList]);

  const renderFiatList = useMemo(
    () => (
      <>
        {showFiatList.map((fiat) => (
          <div
            key={`${fiat.country}_${fiat.symbol}`}
            className="item fiat-item flex"
            onClick={() => {
              onChange?.(fiat);
              onClose?.();
            }}>
            <div className="flag">
              <img src={fiat.icon || ''} alt="" />
            </div>
            <div className="text">{`${fiat.countryName || ''} - ${fiat.symbol}`}</div>
          </div>
        ))}
      </>
    ),
    [onChange, onClose, showFiatList],
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
      <div className="list">{renderFiatList}</div>
    </div>
  );
}
