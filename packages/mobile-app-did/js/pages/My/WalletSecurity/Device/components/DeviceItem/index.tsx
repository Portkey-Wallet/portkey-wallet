import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { defaultColors } from 'assets/theme';
import { TextL, TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { DeviceItemType, DeviceType } from '@portkey-wallet/types/types-ca/device';
import Svg, { IconName } from 'components/Svg';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { makeStyles, useTheme } from '@rneui/themed';
// import CheckBox from 'rn-teaset/components/Checkbox/Checkbox';
import CheckBox from 'components/CheckBox';

const deviceTypeIconMap: Record<DeviceType, IconName> = {
  [DeviceType.IOS]: 'phone-iOS',
  [DeviceType.ANDROID]: 'phone-Android',
  [DeviceType.MAC]: 'desk-mac',
  [DeviceType.WINDOWS]: 'desk-win',
  [DeviceType.OTHER]: 'desk-win',
};

interface DeviceItemProps {
  onPress?: (e: any) => void;
  isCurrent?: boolean;
  deviceItem: DeviceItemType;
  isShowCheckBox: boolean;
}

const DeviceItemRender = ({ onPress, isCurrent, deviceItem, isShowCheckBox }: DeviceItemProps) => {
  const styles = getStyles();
  const { theme } = useTheme();
  const [isChecked, setIsChecked] = useState(false);
  const onClickCheckBox = useCallback(() => {
    onPress && onPress(!isChecked);
    setIsChecked(!isChecked);
  }, [onPress, isChecked, setIsChecked]);
  useEffect(() => {
    if (!isShowCheckBox) {
      setIsChecked(false);
    }
  }, [isShowCheckBox]);
  return (
    <Touchable onPress={onClickCheckBox} disabled={!isShowCheckBox}>
      <View style={styles.deviceItemWrap}>
        <View style={styles.deviceItemInfoWrap}>
          <View style={styles.deviceItemInfo}>
            <TextL>{deviceItem.deviceInfo.deviceName}</TextL>
            {isCurrent && (
              <View style={styles.currentWrap}>
                <TextS style={styles.currentWrap}>Current</TextS>
              </View>
            )}
          </View>
          <TextM style={[FontStyles.font7, { color: theme.colors.textBase2 }]}>
            {deviceItem.transactionTime ? formatTransferTime(deviceItem.transactionTime) : ''}
          </TextM>
        </View>

        {isShowCheckBox && (
          <CheckBox checked={isChecked} onChange={() => onClickCheckBox()} boxStyle={styles.checkBox} />
        )}
      </View>
    </Touchable>
  );
};
const DeviceItem = memo(DeviceItemRender);

export default DeviceItem;

const getStyles = makeStyles(theme => ({
  deviceItemWrap: {
    height: pTd(78),
    backgroundColor: theme.colors.bgBase1,
    borderRadius: pTd(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceItemInfoWrap: {
    flex: 1,
    height: '100%',
    paddingVertical: pTd(14),
    justifyContent: 'space-between',
  },
  deviceItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxTitle: {},
  currentWrap: {
    height: pTd(20),
    color: theme.colors.textSuccess5,
    backgroundColor: theme.colors.bgSuccess2,
    paddingHorizontal: pTd(4),
    justifyContent: 'center',
  },
  checkBox: {
    backgroundColor: theme.colors.bgBase1,
  },
}));
