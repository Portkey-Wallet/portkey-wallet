import React, { memo, useCallback, useState } from 'react';
import { Text, FlatList, View } from 'react-native';
import OverlayModal from 'components/OverlayModal';
import { ModalBody } from 'components/ModalBody';
import TokenItem from 'components/TokenListUnionItem/TokenItem';
import CommonInput from 'components/CommonInput';
import CommonAvatar from 'components/CommonAvatar';
import Touchable from 'components/Touchable';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { useLanguage } from 'i18n/hooks';
import { getContentStyles, getButtonStyles } from './style';
// import mockData from './mockData.json';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';

const mockData: TokenItemShowType[] = [];

interface ISelectTokenContentProps {
  title: string;
  onSelect?: (item: TokenItemShowType) => void;
}

interface ISelectTokenButtonProps {
  modalTitle: string;
}

const SelectTokenContent: React.FC<ISelectTokenContentProps> = ({ title, onSelect }) => {
  const styles = getContentStyles();
  const { t } = useLanguage();

  const [keyword, setKeyword] = useState('');

  const handleSelect = useCallback(
    (item: TokenItemShowType) => {
      onSelect?.(item);
      OverlayModal.hide();
    },
    [onSelect],
  );

  const renderItem = useCallback(
    ({ item }: { item: TokenItemShowType }) => {
      return <TokenItem wrapStyle={styles.tokenItem} item={item} onPress={() => handleSelect(item)} />;
    },
    [styles.tokenItem, handleSelect],
  );

  return (
    <ModalBody modalBodyType="bottom" title={title}>
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
        data={mockData}
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

const SelectTokenButton: React.FC<ISelectTokenButtonProps> = ({ modalTitle }) => {
  const styles = getButtonStyles();
  const [tokenInfo, setTokenInfo] = useState<TokenItemShowType>(mockData[0]);

  return (
    <Touchable
      style={styles.selectTokenButton}
      onPress={() => showSelectTokenModal({ title: modalTitle, onSelect: setTokenInfo })}>
      <View style={styles.iconWrap}>
        <CommonAvatar
          style={styles.tokenIcon}
          title={tokenInfo?.symbol}
          avatarSize={pTd(25)}
          imageUrl={tokenInfo?.imageUrl}
        />
        <CommonAvatar
          hasBorder
          style={styles.chainIcon}
          title={tokenInfo?.displayChainName}
          avatarSize={pTd(16)}
          imageUrl={tokenInfo?.chainImageUrl}
        />
      </View>
      <Text style={styles.symbolText}>{tokenInfo?.label || tokenInfo?.symbol}</Text>
      <Svg icon={'down-arrow'} size={pTd(16)} />
    </Touchable>
  );
};

export default memo(SelectTokenButton);
