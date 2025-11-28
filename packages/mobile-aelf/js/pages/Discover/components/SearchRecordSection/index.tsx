import React, { useCallback, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { useLanguage } from 'i18n/hooks';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { useAppCommonDispatch, useAppEOASelector } from '@portkey-wallet/hooks';
import SearchRecordItem from '../SearchRecordItem';
import { clearRecordsList } from '@portkey-wallet/store/store-eoa/discover/slice';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-eoa/network';
import { ITabItem } from '@portkey-wallet/store/store-eoa/discover/type';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { makeStyles } from '@rneui/themed';

export type TSearchRecordSectionProps = {
  onClick?: () => void;
};
export default function SearchRecordSection({ onClick }: TSearchRecordSectionProps) {
  const { t } = useLanguage();
  const styles = getStyles();

  const dispatch = useAppCommonDispatch();
  const { networkType } = useCurrentNetworkInfo();
  const { discoverMap } = useAppEOASelector(state => state.discover);
  const discoverJump = useDiscoverJumpWithNetWork();

  const clearRecord = useCallback(() => {
    dispatch(clearRecordsList({ networkType }));
  }, [dispatch, networkType]);

  const showRecordList = useMemo(() => {
    const recordsList = (discoverMap?.[networkType]?.recordsList as ITabItem[]) || [];
    return recordsList.map(ele => ele).reverse();
  }, [discoverMap, networkType]);

  const onClickJump = useCallback(
    (i: ITabItem) => {
      discoverJump({
        item: {
          name: i?.name || '',
          url: i?.url,
        },
      });
      onClick?.();
    },
    [discoverJump, onClick],
  );

  if (showRecordList?.length === 0) {
    return <View style={styles.noRecordWrap} />;
  }

  return (
    <ScrollView style={styles.sectionWrap} keyboardShouldPersistTaps="handled">
      <View style={[styles.headerWrap, GStyles.flexRow, GStyles.spaceBetween]}>
        <TextL style={styles.header}>{'Recents'}</TextL>
        <TextM style={styles.clear} onPress={clearRecord}>
          {t('Clear')}
        </TextM>
      </View>
      {(showRecordList ?? []).map((item, index) => (
        <SearchRecordItem key={index} item={item} onPress={() => onClickJump(item)} />
      ))}
    </ScrollView>
  );
}

const getStyles = makeStyles(theme => ({
  noRecordWrap: {
    flex: 1,
  },
  sectionWrap: {
    ...GStyles.paddingArg(8, 16),
  },
  headerWrap: {
    height: pTd(22),
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  header: {
    ...fonts.mediumFont,
    lineHeight: pTd(20),
  },
  clear: {
    color: theme.colors.textBrand1,
    lineHeight: pTd(17.5),
  },
}));
