import React, { useCallback, useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TextL, TextM, TextS } from 'components/CommonText';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import DappListItem from '../components/DappListItem';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { useLanguage } from 'i18n/hooks';
import Svg from 'components/Svg';
import ActionSheet from 'components/ActionSheet';
import CommonSwitch from 'components/CommonSwitch';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import fonts from 'assets/theme/fonts';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { getOrigin } from '@portkey-wallet/utils/dapp/browser';
import { showDappPeriodOverlay } from 'components/RemeberMe';
import { useCurrentDappInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import navigationService from 'utils/navigationService';
import { SessionKeyMap } from '@portkey-wallet/constants/constants-ca/dapp';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';

interface RouterParams {
  origin: string;
}

const DappDetail: React.FC = () => {
  const { t } = useLanguage();
  const { origin } = useRouterParams<RouterParams>();
  const dappInfo = useCurrentDappInfo(origin);
  const { sessionInfo } = dappInfo || {};

  console.log('dappInfo', dappInfo);
  const dispatch = useAppCommonDispatch();
  const { currentNetwork } = useWallet();

  const showTips = useCallback(() => {
    ActionSheet.alert({
      message:
        'Once enabled, you can set a session key for this dapp. The session key will automatically approve all requests without the pop-up notifications only on this device. It will be invalid upon session expiration or dapp disconnection. You can disable this feature or modify the expiration time at any time.',
      buttons: [
        {
          title: 'OK',
          type: 'primary',
        },
      ],
    });
  }, []);

  const showPeriod = useCallback(() => {
    // showDappPeriodOverlay();
  }, []);

  const disconnectDapp = useCallback(() => {
    dispatch(removeDapp({ networkType: currentNetwork, origin: dappInfo?.origin || '' }));

    navigationService.goBack();
  }, [currentNetwork, dispatch, dappInfo]);

  return (
    <PageContainer
      titleDom={'Dapp Details'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <DappListItem item={dappInfo} />
      <View style={[GStyles.flexRow, GStyles.spaceBetween, BGStyles.bg1, pageStyles.sectionWrap, pageStyles.section1]}>
        <TextM>{t('Connected time')}</TextM>
        <TextM>{sessionInfo?.createTime}</TextM>
      </View>

      <View style={[GStyles.flexRow, GStyles.spaceBetween, BGStyles.bg1, pageStyles.sectionWrap, pageStyles.section2]}>
        <View>
          <TouchableOpacity onPress={showTips} style={[GStyles.flexRow, GStyles.itemCenter]}>
            <TextM>{t('Remember me')}</TextM>
            <Svg icon="question-mark" size={pTd(16)} color={defaultColors.icon1} iconStyle={pageStyles.rightArrow} />
          </TouchableOpacity>
          <TextS>{t('Skip authentication after enabled')}</TextS>
        </View>
        <CommonSwitch value={!!sessionInfo?.expiredPlan} />
      </View>

      <View style={[GStyles.flexRow, GStyles.spaceBetween, BGStyles.bg1, pageStyles.sectionWrap, pageStyles.section1]}>
        <TextM>{t('Session key expiration')}</TextM>
        <TouchableOpacity style={[GStyles.flexRow, GStyles.center]} onPress={showPeriod}>
          <TextM>{SessionKeyMap[sessionInfo?.expiredPlan || SessionExpiredPlan.hour1]}</TextM>
          <Svg icon="right-arrow" size={pTd(16)} color={defaultColors.icon1} iconStyle={pageStyles.rightArrow} />
        </TouchableOpacity>
      </View>

      <View style={[GStyles.flexRow, GStyles.spaceBetween, BGStyles.bg1, pageStyles.sectionWrap, pageStyles.section1]}>
        <TextM>{t('Expire time')}</TextM>
        <TextM>{sessionInfo?.expiredTime}</TextM>
      </View>

      <View style={[GStyles.center, GStyles.paddingArg(10, 20, 16), pageStyles.buttonContainer]}>
        <TouchableOpacity style={[GStyles.center, pageStyles.btnWrap]} onPress={disconnectDapp}>
          <TextL style={[FontStyles.font12, fonts.mediumFont]}>Disconnect</TextL>
        </TouchableOpacity>
      </View>
    </PageContainer>
  );
};

const pageStyles = StyleSheet.create({
  pageWrap: {
    flex: 1,
    backgroundColor: defaultColors.bg4,
    ...GStyles.paddingArg(24, 20, 18),
  },
  tipsWrap: {
    lineHeight: pTd(20),
  },
  deleteBtnTitle: {
    color: defaultColors.font12,
  },
  rightArrow: {
    marginLeft: pTd(4),
  },
  sectionWrap: {
    paddingHorizontal: pTd(16),
    borderRadius: pTd(6),
    alignItems: 'center',
    marginBottom: pTd(24),
  },
  section1: {
    height: pTd(56),
  },
  section2: {
    height: pTd(72),
  },
  btnWrap: {
    height: pTd(48),
    width: '100%',
  },
  buttonContainer: {
    width: screenWidth,
    position: 'absolute',
    bottom: 0,
  },
});

export default DappDetail;
