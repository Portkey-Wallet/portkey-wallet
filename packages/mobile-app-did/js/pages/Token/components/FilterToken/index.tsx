import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import { StyleSheet } from 'react-native';
import gStyles from 'assets/theme/GStyles';
import { darkColors, defaultColors } from 'assets/theme';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import TokenItem from '../TokenItem';
import { TextL } from 'components/CommonText';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';
import Svg from 'components/Svg';

enum TipsEnum {
  NO_RESULT = 'No tokens available',
  TRY = `Don't see your token?`,
}

interface IFilterTokenSectionProps {
  tokenList: any[];
  isSearch?: boolean;
  onHandleTokenItem: (item: any, added: boolean) => void;
}

const FilterTokenSection: React.FC<IFilterTokenSectionProps> = (props: IFilterTokenSectionProps) => {
  const { tokenList, onHandleTokenItem, isSearch } = props;

  const { t } = useLanguage();

  const CustomTokenTips = useCallback(
    (v: TipsEnum) => (
      <>
        <TextL style={[customTokenTipsStyle.tips, v === TipsEnum.TRY && customTokenTipsStyle.try]}>{v}</TextL>
        <CommonButton
          type="primary"
          containerStyle={customTokenTipsStyle.addButtonWrap}
          buttonStyle={customTokenTipsStyle.addButton}
          onPress={() => navigationService.navigate('CustomToken')}>
          <Svg icon="add1" size={pTd(16)} color={darkColors.iconBrand4} />
          <TextL style={customTokenTipsStyle.addText}>{t('Import token')}</TextL>
        </CommonButton>
      </>
    ),
    [t],
  );

  return (
    <FlatList
      style={pageStyles.list}
      data={tokenList || []}
      ListEmptyComponent={() => (isSearch ? <></> : CustomTokenTips(TipsEnum.NO_RESULT))}
      ListFooterComponent={() => (tokenList?.length > 0 ? CustomTokenTips(TipsEnum.TRY) : null)}
      renderItem={({ item }: { item: any }) => (
        <TokenItem item={item} onHandleToken={() => onHandleTokenItem(item, !item?.isAdded)} />
      )}
      keyExtractor={(item: IUserTokenItemResponse) => item?.symbol}
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
    color: darkColors.textBase2,
    marginTop: pTd(16),
    textAlign: 'center',
  },
  addButtonWrap: {
    marginTop: pTd(16),
    width: '100%',
    height: pTd(40),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addButton: {
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    borderRadius: pTd(20),
    height: pTd(40),
    backgroundColor: darkColors.bgBrand1,
  },
  addText: {
    marginLeft: pTd(8),
    color: darkColors.textBrand4,
  },
  try: {
    marginTop: pTd(32),
  },
});
