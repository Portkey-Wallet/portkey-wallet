import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { Keyboard, ScrollView, StyleSheet, View } from 'react-native';
import { TextL, TextM } from 'components/CommonText';
import OverlayModal from 'components/OverlayModal';
import Svg from 'components/Svg';
import { pTd } from 'utils/unit';
import { ModalBody } from 'components/ModalBody';
import { defaultColors } from 'assets/theme';
import { FontStyles } from 'assets/theme/styles';
import { useLanguage } from 'i18n/hooks';
import fonts from 'assets/theme/fonts';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { SessionKeyMap, SessionKeyArray } from '@portkey-wallet/constants/constants-ca/dapp';
import GStyles from 'assets/theme/GStyles';
import { useCheckSiteIsInBlackList } from '@portkey-wallet/hooks/hooks-ca/cms';
import Touchable from 'components/Touchable';

export type RememberInfoType = {
  isRemember: boolean;
  value: SessionExpiredPlan;
};

type RememberMeProps = {
  dappInfo: DappStoreItem;
  rememberInfo: RememberInfoType;
  setRememberMeInfo: Dispatch<SetStateAction<RememberInfoType>>;
};

type RememberMeOverlayProps = {
  value: SessionExpiredPlan;
  onCancel?: () => void;
  onConfirm: (value: SessionExpiredPlan) => void;
};

function RememberMeOverlay(props: RememberMeOverlayProps) {
  const { value, onConfirm } = props;
  const { t } = useLanguage();

  const onPressItem = useCallback(
    (v: SessionExpiredPlan) => {
      if (String(value) === String(v)) return;
      onConfirm(v);
      OverlayModal.hide();
    },
    [onConfirm, value],
  );

  return (
    <ModalBody isShowLeftBackIcon isShowRightCloseIcon={false} modalBodyType="bottom" title={'Remember Me'}>
      <TextM style={Overlay.tips}>
        {t(
          "Once enabled, your session key will automatically approve all requests from this DApp, on this device only. You won't see pop-up notifications asking for your approvals until the session key expires. This feature is automatically off when you disconnect from the DApp or when the session key expires. You can also manually disable it or change the expiration time.",
        )}
      </TextM>
      <ScrollView style={Overlay.wrapStyle}>
        <TextL style={[fonts.mediumFont, FontStyles.font5]}>{t('Session key expires in')}</TextL>

        {SessionKeyArray.map(ele => (
          <Touchable key={ele.value} style={Overlay.itemRow} onPress={() => onPressItem(ele?.value)}>
            <TextL>{ele.label}</TextL>
            {value === ele.value && <Svg icon="selected" size={pTd(24)} />}
          </Touchable>
        ))}
      </ScrollView>
    </ModalBody>
  );
}

function PeriodOverlay(props: RememberMeOverlayProps) {
  const { value, onConfirm } = props;

  const onPressItem = useCallback(
    (v: SessionExpiredPlan) => {
      if (String(value) === String(v)) return;
      onConfirm(v);
      OverlayModal.hide();
    },
    [onConfirm, value],
  );

  return (
    <ModalBody modalBodyType="bottom" title={'Select Period'}>
      <ScrollView style={Overlay.wrapStyle}>
        {SessionKeyArray.map(ele => (
          <Touchable key={ele.value} style={Overlay.itemRow} onPress={() => onPressItem(ele?.value)}>
            <TextL>{ele.label}</TextL>
            {value === ele.value && <Svg icon="selected" size={pTd(24)} />}
          </Touchable>
        ))}
      </ScrollView>
    </ModalBody>
  );
}

export const showPeriodOverlay = (props: RememberMeOverlayProps) => {
  Keyboard.dismiss();
  OverlayModal.show(<PeriodOverlay {...props} />, {
    position: 'bottom',
  });
};

const showRememberMeOverlay = (props: RememberMeProps) => {
  const { rememberInfo, setRememberMeInfo } = props;

  Keyboard.dismiss();
  OverlayModal.show(
    <RememberMeOverlay
      value={rememberInfo?.value}
      onConfirm={value => {
        setRememberMeInfo(pre => ({ ...pre, value }));
      }}
    />,
    {
      position: 'bottom',
    },
  );
};

export const RememberMe = (props: RememberMeProps) => {
  const { dappInfo, rememberInfo, setRememberMeInfo } = props;
  const checkOriginInBlackList = useCheckSiteIsInBlackList();
  if (checkOriginInBlackList(dappInfo.origin)) return null;

  return (
    <View style={styles.rememberWrap}>
      <Touchable onPress={() => setRememberMeInfo(pre => ({ ...pre, isRemember: !pre.isRemember }))}>
        <Svg
          icon={rememberInfo?.isRemember ? 'selected' : 'unselected'}
          color={rememberInfo?.isRemember ? defaultColors.primaryColor : undefined}
          size={pTd(20)}
          iconStyle={styles.selectedIcon}
        />
      </Touchable>
      <TextM numberOfLines={2} style={styles.text}>
        <View>
          <TextM>Remember me to skip authentication for </TextM>
          <Touchable style={(GStyles.flexRow, styles.label)} onPress={() => showRememberMeOverlay(props)}>
            <TextM style={FontStyles.font4}>{SessionKeyMap[rememberInfo.value || SessionExpiredPlan.hour1]}</TextM>
          </Touchable>
        </View>
      </TextM>
    </View>
  );
};

export default {
  RememberMe,
  showPeriodOverlay,
};

const styles = StyleSheet.create({
  rememberWrap: {
    display: 'flex',
    flexDirection: 'row',
  },
  selectedIcon: {
    marginRight: pTd(8),
  },
  text: {
    flex: 1,
  },
  label: {
    paddingRight: pTd(100),
  },
});

const Overlay = StyleSheet.create({
  wrapStyle: {
    paddingHorizontal: pTd(20),
    flex: 1,
  },
  title: {
    alignSelf: 'center',
    marginVertical: 16,
  },
  itemRow: {
    height: 72,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
  },
  tips: {
    paddingHorizontal: pTd(20),
    color: defaultColors.font3,
    marginBottom: pTd(24),
  },
});
