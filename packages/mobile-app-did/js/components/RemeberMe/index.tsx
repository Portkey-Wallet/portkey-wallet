import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import { useCheckSiteIsInBlackList } from 'hooks/discover';
import { DappStoreItem } from '@portkey-wallet/store/store-ca/dapp/type';
import { SessionKeyMap, SessionKeyArray } from '@portkey-wallet/constants/constants-ca/dapp';
import GStyles from 'assets/theme/GStyles';

type DappPeriodOverlayProps = {
  value: SessionExpiredPlan;
  onCancel?: () => void;
  onConfirm: (value: SessionExpiredPlan) => void;
};

export type RememberInfoType = {
  isRemember: boolean;
  value: SessionExpiredPlan;
};

type RememberMeProps = {
  dappInfo: DappStoreItem;
  rememberInfo: RememberInfoType;
  setRememberMeInfo: Dispatch<SetStateAction<RememberInfoType>>;
};

function DappPeriodOverlay(props: DappPeriodOverlayProps) {
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
      <ScrollView style={Overlay.wrapStyle}>
        <TextM style={Overlay.tips}>
          {t(
            "Once enabled, your session key will automatically approve all requests from this DApp, on this device only. You won't see pop-up notifications asking for your approvals until the session key expires. This feature is automatically off when you disconnect from the DApp or when the session key expires. You can also manually disable it or change the expiration time.",
          )}
        </TextM>
        <TextL style={[fonts.mediumFont, FontStyles.font5]}>{t('Session key expiration')}</TextL>
        {SessionKeyArray.map(ele => (
          <TouchableOpacity key={ele.value} style={Overlay.itemRow} onPress={() => onPressItem(ele?.value)}>
            <TextL>{ele.label}</TextL>
            {value === ele.value && <Svg icon="selected" size={pTd(24)} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ModalBody>
  );
}

export const showDappPeriodOverlay = (props: RememberMeProps) => {
  const { rememberInfo, setRememberMeInfo } = props;

  Keyboard.dismiss();
  OverlayModal.show(
    <DappPeriodOverlay
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
  const checkOrigin = useCheckSiteIsInBlackList();
  if (checkOrigin(dappInfo.origin)) return null;

  return (
    <View style={styles.rememberWrap}>
      <TouchableOpacity onPress={() => setRememberMeInfo(pre => ({ ...pre, isRemember: !pre.isRemember }))}>
        <Svg
          icon={rememberInfo?.isRemember ? 'selected' : 'unselected'}
          size={pTd(20)}
          iconStyle={styles.selectedIcon}
        />
      </TouchableOpacity>
      <TextM numberOfLines={2} style={styles.text}>
        <View>
          <TextM>Remember me to skip authentication for </TextM>
          <TouchableOpacity style={(GStyles.flexRow, styles.label)} onPress={() => showDappPeriodOverlay(props)}>
            <TextM style={FontStyles.font4}>{SessionKeyMap[rememberInfo.value || SessionExpiredPlan.hour1]}</TextM>
          </TouchableOpacity>
        </View>
      </TextM>
    </View>
  );
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
    color: defaultColors.font3,
    marginBottom: pTd(24),
  },
});
