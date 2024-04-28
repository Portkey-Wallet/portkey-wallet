import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { StyleSheet } from 'react-native';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import React from 'react';
import { FlatList } from 'react-native';
import { TextL } from '@portkey-wallet/rn-components/components/CommonText';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import TokenItem from '../TokenItem';
import fonts from '@portkey-wallet/rn-base/assets/theme/fonts';
import useToken from '@portkey-wallet/hooks/hooks-ca/useToken';

interface IPopularTokenSectionProps {
  tokenDataShowInMarket: any[];
  getTokenList: () => Promise<void>;
  onHandleTokenItem: (item: any, added: boolean) => void;
}

const PopularTokenSection: React.FC<IPopularTokenSectionProps> = (props: IPopularTokenSectionProps) => {
  const { t } = useLanguage();

  const { getTokenList, onHandleTokenItem } = props;
  const { tokenDataShowInMarket } = useToken();
  const { currentNetwork } = useWallet();

  return (
    <FlatList
      style={pageStyles.list}
      ListHeaderComponent={<TextL style={pageStyles.header}>{t('Popular Assets')}</TextL>}
      data={tokenDataShowInMarket || []}
      renderItem={({ item }: { item: TokenItemShowType }) => (
        <TokenItem
          networkType={currentNetwork}
          item={item}
          onHandleToken={() => onHandleTokenItem(item, !item?.isAdded)}
        />
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
  noResult: {
    marginTop: pTd(40),
    textAlign: 'center',
    color: defaultColors.font7,
  },
});
