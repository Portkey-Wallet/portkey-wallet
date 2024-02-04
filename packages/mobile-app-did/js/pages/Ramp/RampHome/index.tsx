import { defaultColors } from 'assets/theme';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import GStyles from 'assets/theme/GStyles';
import { TextM } from 'components/CommonText';
import BuyForm from '../components/BuyForm';
import SellForm from '../components/SellForm';
import ActionSheet from 'components/ActionSheet';
import { RampType } from '@portkey-wallet/ramp';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { useEffectOnce } from '@portkey-wallet/hooks';
import { useSecuritySafeCheckAndToast } from 'hooks/security';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import Loading from 'components/Loading';
import CommonToast from 'components/CommonToast';
import useLockCallback from '@portkey-wallet/hooks/useLockCallback';
import CommonTouchableTabs from 'components/CommonTouchableTabs';
import { useAppRampEntryShow } from 'hooks/ramp';

type TabItemType = {
  name: string;
  type: RampType;
  component: JSX.Element;
};

const tabList: TabItemType[] = [
  {
    name: 'Buy',
    type: RampType.BUY,
    component: <BuyForm />,
  },
  {
    name: 'Sell',
    type: RampType.SELL,
    component: <SellForm />,
  },
];

export default function RampHome() {
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

  return (
    <PageContainer
      safeAreaColor={['blue', 'white']}
      titleDom={'Buy'}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <View style={[GStyles.flexRow, GStyles.alignCenter]}>
        <CommonTouchableTabs tabList={tabList} onTabPress={onTabPress} selectTab={selectTab} />
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
});
