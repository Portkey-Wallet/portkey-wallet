import React, { useMemo, useState } from 'react';
import OverlayModal from 'components/OverlayModal';
import { StyleSheet, View } from 'react-native';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';
import { useLanguage } from 'i18n/hooks';
import { ModalBody } from 'components/ModalBody';
import { TextL } from 'components/CommonText';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { sleep } from '@portkey-wallet/utils';
import GStyles from 'assets/theme/GStyles';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { CommonButtonProps } from 'components/CommonButton';
import { RememberInfoType } from 'components/RememberMe';
import { OverlayBottomSection } from '../OverlayBottomSection';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { useUpdateSessionInfo } from '@portkey-wallet/hooks/hooks-ca/dapp';
import { usePin } from 'hooks/store';
import { getManagerAccount } from 'utils/redux';
import { isIOS } from '@rneui/base';
import Touchable from 'components/Touchable';
import TitleInfoSection from '../TitleInfoSection';
import { makeStyles, useTheme } from '@rneui/themed';
import CommonAvatar from 'components/CommonAvatar';
import CommonTooltip from 'components/CommonTooltip';
import { SessionKeyMap, showRememberMeModal } from '../RememberMeOverlay';
import Svg from 'components/Svg';

type ConnectModalType = {
  dappInfo: DappStoreItem;
  onReject: () => void;
  onApprove: () => void;
};
const AUTH_MSG = `When set to any value other than "Always," your session key will automatically approve this dApp's requests on this device, suppressing pop-ups until it expires. The feature disables when you disconnect or when the session key expires, and you can manually turn it off or adjust the expiration time.`;
const ConnectModal = (props: ConnectModalType) => {
  const { dappInfo, onReject, onApprove } = props;
  const { t } = useLanguage();
  const pin = usePin();
  const userInfo = useCurrentUserInfo();
  const updateSessionInfo = useUpdateSessionInfo();
  const styles = getStyles();
  const { theme } = useTheme();
  const [rememberInfo, setRememberMeInfo] = useState<RememberInfoType>({
    isRemember: false,
    value: SessionExpiredPlan.hour1,
  });
  const showAuthText = useMemo(() => {
    if (!rememberInfo.isRemember) return 'Never';
    return SessionKeyMap[rememberInfo.value];
  }, [rememberInfo.isRemember, rememberInfo.value]);

  const ButtonList = useMemo(
    () => [
      {
        title: t('Reject'),
        type: 'outline' as CommonButtonProps['type'],
        onPress: () => {
          onReject?.();
          OverlayModal.hide();
        },
      },
      {
        title: t('Approve'),
        type: 'primary' as CommonButtonProps['type'],
        onPress: async () => {
          onApprove?.();
          OverlayModal.hide();

          await sleep(500);
          if (!pin) return;
          if (rememberInfo.isRemember) {
            updateSessionInfo({
              manager: getManagerAccount(pin),
              origin: dappInfo.origin,
              expiredPlan: rememberInfo?.value || SessionExpiredPlan.hour1,
            });
          }
        },
      },
    ],
    [dappInfo.origin, onApprove, onReject, pin, rememberInfo.isRemember, rememberInfo?.value, t, updateSessionInfo],
  );

  return (
    <ModalBody modalBodyType="bottom" title="" onClose={onReject}>
      <View style={[styles.contentWrap]}>
        <View>
          <TitleInfoSection dappInfo={dappInfo} title={t(`Connect`)} />
        </View>
        <View style={styles.groupWrap}>
          <TextL style={[{ color: theme.colors.textBase2, lineHeight: pTd(22) }]}>
            {t(`Connecting will allow this site to view balances and activity in your current account.`)}
          </TextL>
          <View style={[styles.walletInfo, GStyles.flexRow, GStyles.itemCenter]}>
            <CommonAvatar
              hasBorder={!userInfo?.avatar}
              title={userInfo?.nickName}
              avatarSize={pTd(32)}
              imageUrl={userInfo?.avatar || ''}
              resizeMode="cover"
              titleStyle={{ fontSize: pTd(14) }}
            />
            <TextL numberOfLines={1} style={[styles.accountName, GStyles.maxWidth(pTd(280))]}>
              {userInfo.nickName}
            </TextL>
          </View>
          <View style={[styles.authInfo, GStyles.flexRow, GStyles.itemCenter, GStyles.spaceBetween]}>
            <View style={[GStyles.flexRow, GStyles.itemCenter]}>
              <TextL style={{ lineHeight: pTd(22) }}>{t('Require authentication')}</TextL>
              <CommonTooltip
                iconStyle={{ marginLeft: pTd(4) }}
                tooltipProps={{
                  title: t('Require authentication'),
                  description: AUTH_MSG,
                }}
              />
            </View>
            <Touchable
              style={[GStyles.flexRow, GStyles.itemCenter]}
              onPress={() => showRememberMeModal({ rememberInfo, setRememberMeInfo })}>
              <TextL style={[{ lineHeight: pTd(22) }, fonts.SGMediumFont]}>{showAuthText}</TextL>
              <Svg iconStyle={styles.arrowIcon} icon="down-arrow" size={pTd(16)} />
            </Touchable>
          </View>
        </View>
        <OverlayBottomSection bottomButtonGroup={ButtonList}>
          <TextL style={[styles.bottomText, GStyles.alignCenter]}>{t(`Only connect to websites you trust`)}</TextL>
        </OverlayBottomSection>
      </View>
    </ModalBody>
  );
};

export const showConnectModal = (props: ConnectModalType) => {
  OverlayModal.show(<ConnectModal {...props} />, {
    position: 'bottom',
    onCloseRequest: props.onReject,
    containerStyle: [!isIOS && GStyles.paddingBottom(0)],
  });
};

export default {
  showConnectModal,
};

const getStyles = makeStyles(theme => ({
  contentWrap: {
    paddingLeft: pTd(16),
    paddingRight: pTd(16),
    // TODO
    height: pTd(400),
  },
  groupWrap: {
    marginTop: pTd(12),
    paddingTop: pTd(8),
  },
  walletInfo: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderBase1,
    marginTop: pTd(16),
    borderRadius: pTd(28),
    ...GStyles.paddingArg(12, 16),
  },
  accountName: {
    lineHeight: pTd(22),
    marginLeft: pTd(8),
  },
  authInfo: {
    ...GStyles.paddingArg(16),
    marginTop: pTd(16),
    height: pTd(54),
    borderRadius: pTd(16),
    backgroundColor: theme.colors.bgBase2,
  },
  arrowIcon: {
    transform: [{ rotate: '-90deg' }],
  },
  bottomText: {
    marginTop: pTd(16),
    color: theme.colors.textBase2,
  },
}));
