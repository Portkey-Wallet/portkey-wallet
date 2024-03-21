import React, { useCallback, useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TextM, TextS } from 'components/CommonText';
import { BGStyles, FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import DappListItem from '../components/DappListItem';
import { useLanguage } from 'i18n/hooks';
import Svg from 'components/Svg';
import ActionSheet from 'components/ActionSheet';
import CommonSwitch from 'components/CommonSwitch';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { getOrigin } from '@portkey-wallet/utils/dapp/browser';
import { showPeriodOverlay } from 'components/RememberMe';
import { useCurrentDappInfo, useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import navigationService from 'utils/navigationService';
import { SessionKeyMap } from '@portkey-wallet/constants/constants-ca/dapp';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { usePin } from 'hooks/store';
import { getManagerAccount } from 'utils/redux';
import { formatTimeToStr, hasSessionInfoExpired } from '@portkey-wallet/utils/session';
import CommonToast from 'components/CommonToast';
import { useDiscoverJumpWithNetWork } from 'hooks/discover';
import { useCheckSiteIsInBlackList } from '@portkey-wallet/hooks/hooks-ca/cms';
import CommonButton from 'components/CommonButton';

interface RouterParams {
  origin: string;
}

const DappDetail: React.FC = () => {
  const { t } = useLanguage();
  const pin = usePin();

  const checkOriginInBlackList = useCheckSiteIsInBlackList();

  const { origin } = useRouterParams<RouterParams>();
  const dappInfo = useCurrentDappInfo(origin);
  const { sessionInfo } = dappInfo || {};
  const dispatch = useAppCommonDispatch();
  const { currentNetwork } = useWallet();
  const updateSessionInfo = useUpdateSessionInfo();
  const discoverJump = useDiscoverJumpWithNetWork();

  const isExpired = useMemo(() => {
    if (!sessionInfo) return false;
    return hasSessionInfoExpired(sessionInfo);
  }, [sessionInfo]);

  const isRememberMe = useMemo(() => {
    if (!!sessionInfo?.expiredPlan && !isExpired) return true;
    return false;
  }, [isExpired, sessionInfo]);

  const isInBlackList = useMemo(
    () => checkOriginInBlackList(dappInfo?.origin || ''),
    [checkOriginInBlackList, dappInfo?.origin],
  );

  const showTips = useCallback(() => {
    ActionSheet.alert({
      message:
        "Once enabled, your session key will automatically approve all requests from this DApp, on this device only. You won't see pop-up notifications asking for your approvals until the session key expires. This feature is automatically off when you disconnect from the DApp or when the session key expires. You can also manually disable it or change the expiration time.",
      buttons: [
        {
          title: 'OK',
          type: 'primary',
        },
      ],
    });
  }, []);

  const showOverlay = useCallback(() => {
    showPeriodOverlay({
      value: dappInfo?.sessionInfo?.expiredPlan || SessionExpiredPlan.hour1,
      onConfirm: value => {
        if (!pin) return;
        updateSessionInfo({
          manager: getManagerAccount(pin),
          origin: getOrigin(dappInfo?.origin || ''),
          expiredPlan: value,
        });
        CommonToast.success('Session Key updated');
      },
    });
  }, [dappInfo?.origin, dappInfo?.sessionInfo?.expiredPlan, pin, updateSessionInfo]);

  const switchRememberMe = useCallback(
    (v: boolean) => {
      if (v) {
        // select RememberMe
        if (!pin) return;
        updateSessionInfo({
          manager: getManagerAccount(pin),
          origin: getOrigin(dappInfo?.origin || ''),
          expiredPlan: SessionExpiredPlan.hour1,
        });
        CommonToast.success('Session Key enabled');
      } else {
        updateSessionInfo({ origin: getOrigin(dappInfo?.origin || '') });
        CommonToast.success('Session Key disabled');
      }
    },
    [dappInfo?.origin, pin, updateSessionInfo],
  );

  const disconnectDapp = useCallback(() => {
    dispatch(removeDapp({ networkType: currentNetwork, origin: dappInfo?.origin || '' }));
    navigationService.goBack();
  }, [currentNetwork, dispatch, dappInfo]);

  const onJumpToDapp = useCallback(
    (name: string, url: string) => {
      discoverJump({
        item: {
          name,
          url,
        },
      });
    },
    [discoverJump],
  );

  return (
    <PageContainer
      titleDom={'Dapp Details'}
      safeAreaColor={['blue', 'gray']}
      containerStyles={pageStyles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <DappListItem
        type="detail"
        item={dappInfo}
        onPress={() => onJumpToDapp(dappInfo?.name || '', dappInfo?.origin || '')}
      />
      <View style={[GStyles.flexRow, GStyles.spaceBetween, BGStyles.bg1, pageStyles.sectionWrap, pageStyles.section1]}>
        <TextM>{t('Connected time')}</TextM>
        <TextM style={FontStyles.font3}>{formatTimeToStr(dappInfo?.connectedTime)}</TextM>
      </View>

      {!isInBlackList && (
        <View
          style={[GStyles.flexRow, GStyles.spaceBetween, BGStyles.bg1, pageStyles.sectionWrap, pageStyles.section2]}>
          <View>
            <TouchableOpacity onPress={showTips} style={[GStyles.flexRow, GStyles.itemCenter]}>
              <TextM>{t('Remember me')}</TextM>
              <Svg icon="question-mark" size={pTd(16)} color={defaultColors.icon1} iconStyle={pageStyles.rightArrow} />
            </TouchableOpacity>
            <TextS style={FontStyles.font3}>{t('Skip authentication after enabled')}</TextS>
          </View>
          <CommonSwitch value={isRememberMe} onChange={() => switchRememberMe(!isRememberMe)} />
        </View>
      )}

      {!isExpired && !isInBlackList && isRememberMe && (
        <View
          style={[GStyles.flexRow, GStyles.spaceBetween, BGStyles.bg1, pageStyles.sectionWrap, pageStyles.section1]}>
          <TextM>{t('Session key expires in')}</TextM>
          <TouchableOpacity style={[GStyles.flexRow, GStyles.center]} onPress={showOverlay}>
            <TextM style={FontStyles.font3}>
              {SessionKeyMap[sessionInfo?.expiredPlan || SessionExpiredPlan.hour1]}
            </TextM>
            <Svg icon="right-arrow" size={pTd(16)} color={defaultColors.icon1} iconStyle={pageStyles.rightArrow} />
          </TouchableOpacity>
        </View>
      )}

      {!isExpired && !isInBlackList && isRememberMe && (
        <View
          style={[GStyles.flexRow, GStyles.spaceBetween, BGStyles.bg1, pageStyles.sectionWrap, pageStyles.section1]}>
          <TextM>{t('Expiration time')}</TextM>
          <TextM style={FontStyles.font3}>
            {sessionInfo?.expiredPlan === SessionExpiredPlan.always
              ? '--'
              : formatTimeToStr(sessionInfo?.expiredTime || 0)}
          </TextM>
        </View>
      )}

      {/* <View style={[GStyles.center, GStyles.paddingArg(10, 20, 16), pageStyles.buttonContainer]}>
        <TouchableOpacity style={[GStyles.center, pageStyles.btnWrap]} onPress={disconnectDapp}>
          <TextL style={FontStyles.font12}>Disconnect</TextL>
        </TouchableOpacity>
      </View> */}

      <View style={[GStyles.center, GStyles.paddingArg(10, 20, 18), pageStyles.buttonContainer]}>
        <CommonButton
          disabledTitleStyle={FontStyles.font12}
          titleStyle={FontStyles.font12}
          type="clear"
          title="Disconnect"
          onPress={disconnectDapp}
        />
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
