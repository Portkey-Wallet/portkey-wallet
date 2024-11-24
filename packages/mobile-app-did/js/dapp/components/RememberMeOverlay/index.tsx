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
import { SessionKeyArray } from '@portkey-wallet/constants/constants-ca/dapp';
import { RememberInfoType } from 'components/RememberMe';

export type RememberMeModalType = {
  rememberInfo: RememberInfoType;
  setRememberMeInfo: (v: RememberInfoType) => void;
};

const RememberMeModal = (props: RememberMeModalType) => {
  const { rememberInfo, setRememberMeInfo } = props;
  const styles = getStyles();

  const onPressItem = useCallback(
    (v: SessionExpiredPlan) => {
      if (v === SessionExpiredPlan.always) {
        setRememberMeInfo({ isRemember: false, value: v });
      } else {
        setRememberMeInfo({ isRemember: true, value: v });
      }
      OverlayModal.hide();
    },
    [setRememberMeInfo],
  );

  return (
    <ModalBody modalBodyType="bottom" title={'Require authentication'}>
      <ScrollView>
        {SessionKeyArray.map(ele => (
          <Touchable key={ele.value} style={styles.itemRow} onPress={() => onPressItem(ele?.value)}>
            <TextL>{ele.label}</TextL>
            {rememberInfo.value === ele.value && <Svg icon="selected" size={pTd(24)} />}
          </Touchable>
        ))}
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
