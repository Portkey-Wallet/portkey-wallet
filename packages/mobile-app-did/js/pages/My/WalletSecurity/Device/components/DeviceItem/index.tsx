import React, { memo, useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextL, TextM, TextS } from 'components/CommonText';
import Touchable from 'components/Touchable';
import { pTd } from 'utils/unit';
import { FontStyles } from 'assets/theme/styles';
import { DeviceItemType } from '@portkey-wallet/types/types-ca/device';
import { formatTransferTime } from '@portkey-wallet/utils/time';
import { makeStyles, useTheme } from '@rneui/themed';
import CheckBox from 'components/CheckBox';

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
                <TextS style={styles.currentText}>Current</TextS>
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
    width: pTd(55),
    backgroundColor: theme.colors.bgSuccess2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: pTd(4),
    marginLeft: pTd(8),
  },
  currentText: {
    fontSize: pTd(12),
    color: theme.colors.textSuccess5,
  },
  checkBox: {
    backgroundColor: theme.colors.bgBase1,
  },
}));
