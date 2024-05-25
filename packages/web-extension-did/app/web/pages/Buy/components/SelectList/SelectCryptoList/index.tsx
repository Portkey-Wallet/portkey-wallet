import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../index.less';
import { IRampCryptoItem } from '@portkey-wallet/ramp';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import CommonHeader, { CustomSvgPlaceholderSize } from 'components/CommonHeader';

export interface ISelectCryptoListProps {
  onChange?: (v: IRampCryptoItem) => void;
  onClose?: () => void;
  title?: ReactNode;
  searchPlaceHolder?: string;
  defaultFiat?: string;
  supportList: IRampCryptoItem[];
}

export default function SelectCryptoList({
  onChange,
  onClose,
  title,
  searchPlaceHolder,
  supportList,
}: ISelectCryptoListProps) {
  const { t } = useTranslation();
  const isMainNet = useIsMainnet();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string>('');

  const showCryptoList = useMemo(() => {
    return filterWord === '' ? supportList : supportList.filter((item) => filterWord === item.symbol);
  }, [filterWord, supportList]);

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
            {!!crypto.icon && (
              <div
                className="token-item-image"
                style={{
                  backgroundImage: `url(${crypto.icon})`,
                }}
              />
            )}
            {!crypto.icon && <CustomSvg type="elf-icon" />}
            <div className="flex-column text">
              <div>{crypto.symbol}</div>
              <div className="chain">{transNetworkText(crypto.chainId, !isMainNet)}</div>
            </div>
          </div>
        ))}
      </>
    ),
    [isMainNet, onChange, onClose, showCryptoList],
  );

  return (
    <div className="custom-list custom-list-weight">
      <CommonHeader
        className="header"
        title={title || 'Select'}
        rightElementList={[
          {
            customSvgType: 'SuggestClose',
            customSvgPlaceholderSize: CustomSvgPlaceholderSize.MD,
            onClick: onClose,
          },
        ]}
      />
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
