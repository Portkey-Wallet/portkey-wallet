import { defaultColors } from 'assets/theme';
import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { pTd } from 'utils/unit';
import PageContainer from 'components/PageContainer';
import { useLanguage } from 'i18n/hooks';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import fonts from 'assets/theme/fonts';
import { FontStyles } from 'assets/theme/styles';
import BuyForm from './components/BuyForm';
import SellForm from './components/SellForm';
import { PaymentTypeEnum } from '@portkey-wallet/types/types-ca/payment';
import ActionSheet from 'components/ActionSheet';
import { useBuyButtonShow } from '@portkey-wallet/hooks/hooks-ca/cms';
import { VersionDeviceType } from '@portkey-wallet/types/types-ca/device';

type TabItemType = {
  name: string;
  type: PaymentTypeEnum;
  component: JSX.Element;
};

const tabList: TabItemType[] = [
  {
    name: 'Buy',
    type: PaymentTypeEnum.BUY,
    component: <BuyForm />,
  },
  {
    name: 'Sell',
    type: PaymentTypeEnum.SELL,
    component: <SellForm />,
  },
];

export default function BuyHome() {
  const { t } = useLanguage();
  const { isBuySectionShow, isSellSectionShow, refreshBuyButton } = useBuyButtonShow(
    Platform.OS === 'android' ? VersionDeviceType.Android : VersionDeviceType.iOS,
  );
  const [selectTab, setSelectTab] = useState<PaymentTypeEnum>(
    isBuySectionShow ? PaymentTypeEnum.BUY : PaymentTypeEnum.SELL,
  );

  const onTabPress = useCallback(
    (type: PaymentTypeEnum) => {
      if (type === PaymentTypeEnum.BUY && !isBuySectionShow) {
        ActionSheet.alert({
          title2: (
            <TextM style={[GStyles.textAlignCenter]}>
              On-ramp is currently not supported. It will be launched in the coming weeks.
            </TextM>
          ),
          buttons: [{ title: 'OK' }],
        });
        refreshBuyButton();
        return;
      }
      if (type === PaymentTypeEnum.SELL && !isSellSectionShow) {
        ActionSheet.alert({
          title2: (
            <TextM style={[GStyles.textAlignCenter]}>
              Off-ramp is currently not supported. It will be launched in the coming weeks.
            </TextM>
          ),
          buttons: [{ title: 'OK' }],
        });
        refreshBuyButton();
        return;
      }
      setSelectTab(type);
    },
    [isBuySectionShow, isSellSectionShow, refreshBuyButton],
  );

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={t('Buy')}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={[GStyles.flexRow, GStyles.alignCenter]}>
        <View style={styles.tabHeader}>
          {tabList.map(tabItem => (
            <TouchableOpacity
              key={tabItem.name}
              onPress={() => {
                onTabPress(tabItem.type);
              }}>
              <View style={[styles.tabWrap, selectTab === tabItem.type && styles.selectTabStyle]}>
                <TextM style={[FontStyles.font7, selectTab === tabItem.type && styles.selectTabTextStyle]}>
                  {tabItem.name}
                </TextM>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={GStyles.flex1}>{tabList.find(item => item.type === selectTab)?.component}</View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(16, 20),
  },
  tabHeader: {
    width: pTd(190),
    backgroundColor: defaultColors.bg6,
    borderRadius: pTd(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    ...GStyles.paddingArg(3),
    marginBottom: pTd(32),
  },
  tabWrap: {
    width: pTd(88),
    height: pTd(30),
    borderRadius: pTd(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectTabStyle: {
    shadowColor: defaultColors.shadow1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: defaultColors.bg1,
  },
  selectTabTextStyle: {
    color: defaultColors.font5,
    ...fonts.mediumFont,
  },
});
