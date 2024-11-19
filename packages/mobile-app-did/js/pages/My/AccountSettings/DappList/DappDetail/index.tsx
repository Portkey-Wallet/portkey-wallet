import React, { useCallback, useMemo } from 'react';
import PageContainer from 'components/PageContainer';
import { View } from 'react-native';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { TextL, TextM } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import { pTd } from 'utils/unit';
import DappListItem from '../components/DappListItem';
import { useLanguage } from 'i18n/hooks';
import Svg from 'components/Svg';
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
import Touchable from 'components/Touchable';
import { makeStyles, useTheme } from '@rneui/themed';
import CommonTooltip from 'components/CommonTooltip';

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

  const styles = getStyles();
  const theme = useTheme();

  const isExpired = useMemo(() => {
    if (!sessionInfo) {
      return false;
    }
    return hasSessionInfoExpired(sessionInfo);
  }, [sessionInfo]);

  const isRememberMe = useMemo(() => {
    if (!!sessionInfo?.expiredPlan && !isExpired) {
      return true;
    }
    return false;
  }, [isExpired, sessionInfo]);

  const isInBlackList = useMemo(
    () => checkOriginInBlackList(dappInfo?.origin || ''),
    [checkOriginInBlackList, dappInfo?.origin],
  );

  const showOverlay = useCallback(() => {
    showPeriodOverlay({
      value: dappInfo?.sessionInfo?.expiredPlan || SessionExpiredPlan.hour1,
      onConfirm: value => {
        if (!pin) {
          return;
        }
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
        if (!pin) {
          return;
        }
        updateSessionInfo({
          manager: getManagerAccount(pin),
          origin: getOrigin(dappInfo?.origin || ''),
          expiredPlan: SessionExpiredPlan.hour1,
        });
        CommonToast.success('"Remember Me" enabled.');
      } else {
        updateSessionInfo({ origin: getOrigin(dappInfo?.origin || '') });
        CommonToast.success('"Remember Me" disabled.');
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
      safeAreaColor={['black', 'black']}
      containerStyles={styles.pageWrap}
      scrollViewProps={{ disabled: true }}>
      <DappListItem
        type="detail"
        item={dappInfo}
        onPress={() => onJumpToDapp(dappInfo?.name || '', dappInfo?.origin || '')}
      />
      <View style={styles.connectSection}>
        <TextM style={FontStyles.white}>{t('Connected time')}</TextM>
        <TextM style={FontStyles.weight500}>{formatTimeToStr(dappInfo?.connectedTime)}</TextM>
      </View>

      {!isInBlackList && (
        <View style={styles.rememberSection}>
          <View>
            <Touchable style={[GStyles.flexRow, GStyles.itemCenter]}>
              <TextL>{t('Remember me')}</TextL>
              <CommonTooltip
                iconSize={pTd(16)}
                iconStyle={{ marginLeft: pTd(4) }}
                tooltipProps={{
                  title: 'Remember me',
                  description:
                    "Once enabled, your session key will automatically approve all requests from this DApp, on this device only. You won't see pop-up notifications asking for your approvals until the session key expires. This feature is automatically off when you disconnect from the DApp or when the session key expires. You can also manually disable it or change the expiration time. ",
                }}
              />
            </Touchable>

            <TextM style={styles.rememberTip}>{t('Skip authentication after enabled')}</TextM>
          </View>
          <View style={styles.rememberSwitchWrap}>
            <CommonSwitch
              value={isRememberMe}
              onChange={() => switchRememberMe(!isRememberMe)}
              style={styles.rememberSwitch}
            />
          </View>
        </View>
      )}

      {!isExpired && !isInBlackList && isRememberMe && (
        <View style={styles.expiresSection}>
          <TextL>{t('Session key expires in')}</TextL>
          <Touchable style={styles.selectTimeWrap} onPress={showOverlay}>
            <TextL>{SessionKeyMap[sessionInfo?.expiredPlan || SessionExpiredPlan.hour1]}</TextL>
            <Svg icon="right-arrow" size={pTd(16)} iconStyle={styles.rightArrow} />
          </Touchable>
        </View>
      )}

      {!isExpired && !isInBlackList && isRememberMe && (
        <View style={styles.expiresTimeWrap}>
          <TextM style={{ color: theme.theme.colors.textBase3 }}>{t('Expiration time')}</TextM>
          <TextM style={{ color: theme.theme.colors.textBase3 }}>
            {sessionInfo?.expiredPlan === SessionExpiredPlan.always
              ? '--'
              : formatTimeToStr(sessionInfo?.expiredTime || 0)}
          </TextM>
        </View>
      )}

      <View style={[styles.buttonContainer]}>
        <CommonButton
          disabledTitleStyle={FontStyles.font12}
          titleStyle={FontStyles.font12}
          type="transparent"
          title="Disconnect"
          onPress={disconnectDapp}
        />
      </View>
    </PageContainer>
  );
};

const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bg6,
    ...GStyles.paddingArg(16, 16, 0, 16),
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
    padding: pTd(16),
  },
  connectSection: {
    padding: pTd(16),
    marginBottom: pTd(12),
    backgroundColor: theme.colors.bg6,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rememberSection: {
    padding: pTd(16),
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(8),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  rememberTip: {
    color: theme.colors.textBase3,
    marginTop: pTd(5),
  },
  rememberSwitch: {},
  rememberSwitchWrap: {
    width: pTd(40),
    height: pTd(24),
  },
  expiresSection: {
    backgroundColor: theme.colors.bg6,
    marginTop: pTd(24),
    display: 'flex',
    flexDirection: 'column',
  },
  selectTimeWrap: {
    marginTop: pTd(8),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: pTd(12),
    paddingHorizontal: pTd(16),
    borderRadius: pTd(8),
    justifyContent: 'space-between',
    borderWidth: pTd(1),
    borderStyle: 'solid',
    borderColor: theme.colors.bgBase3,
  },
  expiresTimeWrap: {
    marginTop: pTd(8),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default DappDetail;
