import React, { memo, useCallback, useMemo, useState } from 'react';
import { Text, FlatList, View } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import CommonInput from 'components/CommonInput';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import { useLanguage } from 'i18n/hooks';
import { getContentStyles, getButtonStyles } from './style';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { truncateString } from '@portkey-wallet/utils';
import { TCurrency } from '@portkey-wallet/types/types-ca/awaken';
import { useAwakenTokenList } from '@portkey-wallet/hooks/hooks-ca/awaken/state';
import CurrencyItem from '../CurrencyItem';
import { formatNameWithNoUnderline } from '@portkey-wallet/utils';

interface ISelectTokenContentProps {
  title: string;
  onSelect?: (item: TCurrency) => void;
}

interface ISelectTokenButtonProps {
  modalTitle: string;
  token?: TCurrency;
  onTokenChange?: (token: TCurrency) => void;
}

const SelectTokenContent: React.FC<ISelectTokenContentProps> = ({ title, onSelect }) => {
  const styles = getContentStyles();
  const { t } = useLanguage();

  const [keyword, setKeyword] = useState('');
  const { list } = useAwakenTokenList();

  const filterList = useMemo(() => {
    if (keyword === '') return list;
    return list.filter(item => item.symbol.toLocaleUpperCase().includes(keyword.toLocaleUpperCase()));
  }, [keyword, list]);

  const handleSelect = useCallback(
    (item: TCurrency) => {
      onSelect?.(item);
      OverlayModal.hide();
    },
    [onSelect],
  );

  const renderItem = useCallback(
    ({ item }: { item: TCurrency }) => {
      return <CurrencyItem wrapStyle={styles.tokenItem} item={item} onPress={() => handleSelect(item)} />;
    },
    [styles.tokenItem, handleSelect],
  );

  return (
    <ModalBody modalBodyType="bottom" title={title} isMaxHeight>
      <CommonInput
        allowClear
        clearIcon="clear4"
        placeholder={t('Search')}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        value={keyword}
        onChangeText={v => {
          setKeyword(v.trim());
        }}
      />
      <FlatList
        nestedScrollEnabled
        refreshing={false}
        data={filterList}
        renderItem={renderItem}
        keyExtractor={item => `${item.symbol}${item.chainId}`}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No tokens available</Text>}
      />
    </ModalBody>
  );
};

const showSelectTokenModal = (props: ISelectTokenContentProps) => {
  OverlayModal.show(<SelectTokenContent {...props} />, {
    position: 'bottom',
  });
};

const SelectTokenButton: React.FC<ISelectTokenButtonProps> = ({ modalTitle, token, onTokenChange }) => {
  const styles = getButtonStyles();

  return (
    <Touchable
      style={styles.selectTokenButton}
      onPress={() =>
        showSelectTokenModal({
          title: modalTitle,
          onSelect: onTokenChange,
        })
      }>
      <View style={styles.iconWrap}>
        <CommonAvatar style={styles.tokenIcon} title={token?.symbol} avatarSize={pTd(25)} imageUrl={token?.imageUrl} />
        <CommonAvatar
          hasBorder
          style={styles.chainIcon}
          title={token?.displayChainName}
          avatarSize={pTd(16)}
          imageUrl={token?.chainImageUrl}
        />
      </View>
      <Text style={styles.symbolText}>{truncateString(formatNameWithNoUnderline(token?.label || token?.symbol))}</Text>
      <Svg icon={'down-arrow'} size={pTd(16)} />
    </Touchable>
  );
};

export default memo(SelectTokenButton);
