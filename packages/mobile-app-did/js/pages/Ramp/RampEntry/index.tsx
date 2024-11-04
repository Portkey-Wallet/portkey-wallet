import React, { useCallback, useMemo, useState } from 'react';
import { IRampCryptoItem, RampType } from '@portkey-wallet/ramp';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { ScrollView, View } from 'react-native';
import CommonTouchableTabs from 'components/CommonTouchableTabs';
import { useAppRampEntryShow } from 'hooks/ramp';
import { useSecuritySafeCheckAndToast } from 'hooks/security';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import ActionSheet from 'components/ActionSheet';
import { TextL, TextM } from 'components/CommonText';
import Loading from 'components/Loading';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import CommonToast from 'components/CommonToast';
import useEffectOnce from 'hooks/useEffectOnce';
import CommonInput from 'components/CommonInput';
import { useBuyCryptoList, useSellCryptoList } from '@portkey-wallet/hooks/hooks-ca/ramp';
import Touchable from 'components/Touchable';
import CommonAvatar from 'components/CommonAvatar';
import navigationService from 'utils/navigationService';

type TabItemType = {
  name: string;
  type: RampType;
  component: JSX.Element;
};

const tabList: TabItemType[] = [
  {
    name: 'Buy',
    type: RampType.BUY,
    component: <></>,
  },
  {
    name: 'Sell',
    type: RampType.SELL,
    component: <></>,
  },
];

export default function RampEntry() {
  const styles = getStyles();
  const { isBuySectionShow, isSellSectionShow, refreshRampShow } = useAppRampEntryShow();
  const securitySafeCheckAndToast = useSecuritySafeCheckAndToast();

  const { toTab } = useRouterParams<{ toTab: RampType }>();
  const [selectTab, setSelectTab] = useState<RampType>(
    toTab !== RampType.SELL && isBuySectionShow ? RampType.BUY : RampType.SELL,
  );

  useEffectOnce(() => {
    (async () => {
      if (!isBuySectionShow || toTab === RampType.SELL) {
        try {
          if (!(await securitySafeCheckAndToast(MAIN_CHAIN_ID))) return;
        } catch (error) {
          console.log('error', error);
          return;
        }
      }
    })();
  });

  const onTabPress = useLockCallback(
    async (type: RampType) => {
      if (type === RampType.BUY && !isBuySectionShow) {
        ActionSheet.alert({
          title2: (
            <TextM style={[GStyles.textAlignCenter]}>
              On-ramp is currently not supported. It will be launched in the coming weeks.
            </TextM>
          ),
          buttons: [{ title: 'OK' }],
        });
        refreshRampShow();
        return;
      }
      if (type === RampType.SELL && !isSellSectionShow) {
        ActionSheet.alert({
          title2: (
            <TextM style={[GStyles.textAlignCenter]}>
              Off-ramp is currently not supported. It will be launched in the coming weeks.
            </TextM>
          ),
          buttons: [{ title: 'OK' }],
        });
        refreshRampShow();
        return;
      }

      if (type === RampType.SELL) {
        Loading.show();
        try {
          if (!(await securitySafeCheckAndToast(MAIN_CHAIN_ID))) return;
        } catch (error) {
          CommonToast.failError(error);
          return;
        } finally {
          Loading.hide();
        }
      }

      setSelectTab(type);
    },
    [isBuySectionShow, isSellSectionShow, refreshRampShow, securitySafeCheckAndToast],
  );

  const [keyword, setKeyword] = useState('');
  const onChangeText = useCallback((v: string) => {
    setKeyword(v.trim());
  }, []);

  const { buyCryptoList } = useBuyCryptoList();
  const { sellCryptoList } = useSellCryptoList();
  const list = useMemo(() => {
    if (selectTab === RampType.BUY) return buyCryptoList;
    if (selectTab === RampType.SELL) return sellCryptoList;
    return [];
  }, [buyCryptoList, selectTab, sellCryptoList]);

  const filterList = useMemo(
    () => list.filter(item => item.symbol.toLocaleUpperCase().includes(keyword.toLocaleUpperCase())),
    [keyword, list],
  );

  const onCryptoClick = useCallback(
    (item: IRampCryptoItem) => {
      if (selectTab === RampType.BUY)
        navigationService.navigate('RampBuy', { symbol: item.symbol, network: item.network });
      if (selectTab === RampType.SELL)
        navigationService.navigate('RampSell', { symbol: item.symbol, network: item.network });
      return;
    },
    [selectTab],
  );

  return (
    <PageContainer
      titleDom={<CommonTouchableTabs tabList={tabList} onTabPress={onTabPress} selectTab={selectTab} />}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <CommonInput placeholder={'Search'} value={keyword} onChangeText={onChangeText} />
      <View style={[GStyles.flex1, styles.listWrap]}>
        <ScrollView>
          {filterList.map(item => (
            <Touchable key={`${selectTab}_${item.network}_${item.symbol}`} onPress={() => onCryptoClick(item)}>
              <View style={styles.itemRow}>
                <CommonAvatar title={item.symbol} hasBorder={false} avatarSize={pTd(42)} imageUrl={item.icon || ' '} />
                <TextL style={styles.itemSymbol}>{item.symbol}</TextL>
              </View>
            </Touchable>
          ))}
        </ScrollView>
      </View>
    </PageContainer>
  );
}

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    ...GStyles.paddingArg(16, 16),
  },
  listWrap: {
    paddingTop: pTd(16),
  },
  itemRow: {
    height: pTd(74),
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemSymbol: {
    marginLeft: pTd(8),
  },
}));
