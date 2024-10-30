import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { StyleSheet } from 'react-native';
import React from 'react';
import { FlatList } from 'react-native';
import { pTd } from 'utils/unit';
import TokenItem from '../TokenItem';
import fonts from 'assets/theme/fonts';

interface IPopularTokenSectionProps {
  tokenDataShowInMarket: any[];
  getTokenList: () => Promise<void>;
  onHandleTokenItem: (item: any, added: boolean) => void;
}

const PopularTokenSection: React.FC<IPopularTokenSectionProps> = (props: IPopularTokenSectionProps) => {
  const { getTokenList, onHandleTokenItem, tokenDataShowInMarket } = props;

  return (
    <FlatList
      style={pageStyles.list}
      data={tokenDataShowInMarket || []}
      renderItem={({ item }: { item: TokenItemShowType }) => (
        <TokenItem item={item} onHandleToken={() => onHandleTokenItem(item, !item?.isAdded)} />
      )}
      onEndReached={() => getTokenList()}
      keyExtractor={(item: TokenItemShowType) => item?.id || item?.symbol}
    />
  );
};

export default PopularTokenSection;

export const pageStyles = StyleSheet.create({
  list: {
    flex: 1,
  },
  header: {
    ...fonts.mediumFont,
    paddingLeft: pTd(16),
    paddingTop: pTd(16),
    marginBottom: pTd(8),
  },
});
