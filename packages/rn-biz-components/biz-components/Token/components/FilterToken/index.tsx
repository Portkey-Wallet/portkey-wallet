import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { StyleSheet } from 'react-native';
import gStyles from '@portkey-wallet/rn-base/assets/theme/GStyles';
import { defaultColors } from '@portkey-wallet/rn-base/assets/theme';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { useLanguage } from '@portkey-wallet/rn-base/i18n/hooks';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import TokenItem from '../TokenItem';
import { TextL, TextM } from '@portkey-wallet/rn-components/components/CommonText';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import navigationService from '@portkey-wallet/rn-inject-sdk';
import Svg from '@portkey-wallet/rn-components/components/Svg';

enum TipsEnum {
  NO_RESULT = 'There is no search result.',
  TRY = "Can't find your token? Please try below.",
}

interface IFilterTokenSectionProps {
  tokenList: any[];
  onHandleTokenItem: (item: any, added: boolean) => void;
}

const FilterTokenSection: React.FC<IFilterTokenSectionProps> = (props: IFilterTokenSectionProps) => {
  const { tokenList, onHandleTokenItem } = props;

  const { t } = useLanguage();

  const { currentNetwork } = useWallet();

  const CustomTokenTips = useCallback(
    (v: TipsEnum) => (
      <>
        <TextL style={[customTokenTipsStyle.tips, v === TipsEnum.TRY && customTokenTipsStyle.try]}>{v}</TextL>
        <CommonButton
          type="solid"
          containerStyle={customTokenTipsStyle.addButtonWrap}
          buttonStyle={customTokenTipsStyle.addButton}
          onPress={() => navigationService.navigate('CustomToken')}>
          <Svg icon="add1" size={pTd(16)} color={defaultColors.icon2} />
          <TextM style={customTokenTipsStyle.addText}>{t('Custom Token')}</TextM>
        </CommonButton>
      </>
    ),
    [t],
  );

  return (
    <FlatList
      style={pageStyles.list}
      data={tokenList || []}
      ListEmptyComponent={() => CustomTokenTips(TipsEnum.NO_RESULT)}
      ListFooterComponent={() => (tokenList?.length > 0 ? CustomTokenTips(TipsEnum.TRY) : null)}
      renderItem={({ item }: { item: TokenItemShowType }) => (
        <TokenItem
          networkType={currentNetwork}
          item={item}
          onHandleToken={() => onHandleTokenItem(item, !item?.isAdded)}
        />
      )}
      keyExtractor={(item: TokenItemShowType) => item?.id || item?.symbol}
    />
  );
};

export default FilterTokenSection;

export const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    ...gStyles.paddingArg(0),
  },
  inputWrap: {
    backgroundColor: defaultColors.bg5,
    ...gStyles.paddingArg(0, 16, 16),
  },
  list: {
    flex: 1,
  },
});

export const customTokenTipsStyle = StyleSheet.create({
  tips: {
    color: defaultColors.font7,
    marginTop: pTd(96),
    textAlign: 'center',
  },
  addButtonWrap: {
    marginTop: pTd(24),
    width: '100%',
    height: pTd(44),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addButton: {
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    borderRadius: pTd(6),
    height: pTd(44),
  },
  addText: {
    marginLeft: pTd(8),
    color: defaultColors.font2,
  },
  try: {
    marginTop: pTd(32),
  },
});
