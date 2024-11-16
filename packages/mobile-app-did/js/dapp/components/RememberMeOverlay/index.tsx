import React, { useCallback } from 'react';
import OverlayModal from 'components/OverlayModal';
import { isIOS } from '@rneui/base';
import { ModalBody } from 'components/ModalBody';
import Touchable from 'components/Touchable';
import { ScrollView } from 'react-native';
import GStyles from 'assets/theme/GStyles';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { SessionExpiredPlan } from '@portkey-wallet/types/session';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import { RememberInfoType } from 'components/RememberMe';

export const SessionKeyMap = {
  [SessionExpiredPlan.always]: 'Always',
  [SessionExpiredPlan.hour1]: 'After 1 hour',
  [SessionExpiredPlan.hour3]: 'After 3 hours',
  [SessionExpiredPlan.hour12]: 'After 12 hours',
  [SessionExpiredPlan.hour24]: 'After 24 hours',
};

export const SessionKeyArray = Object.entries(SessionKeyMap).map(([k, v]) => ({
  value: k === SessionExpiredPlan.always ? k : Number(k),
  label: v,
  children: v,
}));

export type RememberMeModalType = {
  rememberInfo: RememberInfoType;
  setRememberMeInfo: (v: RememberInfoType) => void;
};

const RememberMeModal = (props: RememberMeModalType) => {
  const { rememberInfo, setRememberMeInfo } = props;
  const styles = getStyles();

  const onPressItem = useCallback(
    (v: SessionExpiredPlan) => {
      if (String(rememberInfo.value) === String(v)) {
        return;
      }
      setRememberMeInfo({ isRemember: true, value: v });
      OverlayModal.hide();
    },
    [rememberInfo, setRememberMeInfo],
  );

  const setRememberMe = useCallback(() => {
    if (!rememberInfo.isRemember) {
      return;
    }
    setRememberMeInfo({ ...rememberInfo, isRemember: false });
    OverlayModal.hide();
  }, [rememberInfo, setRememberMeInfo]);

  return (
    <ModalBody modalBodyType="bottom" title={'Require authentication'}>
      <ScrollView>
        {SessionKeyArray.map(ele => (
          <Touchable key={ele.value} style={styles.itemRow} onPress={() => onPressItem(ele?.value)}>
            <TextL>{ele.label}</TextL>
            {rememberInfo.isRemember && rememberInfo.value === ele.value && <Svg icon="selected" size={pTd(24)} />}
          </Touchable>
        ))}
        <Touchable key={'-1'} style={styles.itemRow} onPress={setRememberMe}>
          <TextL>{'Never'}</TextL>
          {!rememberInfo.isRemember && <Svg icon="selected" size={pTd(24)} />}
        </Touchable>
      </ScrollView>
    </ModalBody>
  );
};

export const showRememberMeModal = (props: RememberMeModalType) => {
  OverlayModal.show(<RememberMeModal {...props} />, {
    position: 'bottom',
    containerStyle: [!isIOS && GStyles.paddingBottom(0)],
  });
};

const getStyles = makeStyles(() => ({
  itemRow: {
    height: pTd(48),
    marginTop: pTd(12),
    ...GStyles.paddingArg(13, 16),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
