import React, { useMemo } from 'react';
import { Text } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import SelectOverlay from 'components/SelectOverlay';
import { pTd } from 'utils/unit';
import { getStyles } from './style';
import { EXPIRY_LIST, LimitExpiryEnum } from '@portkey-wallet/constants/awaken/limit';

interface IExpiresSelectProps {
  selectedValue: LimitExpiryEnum;
  onChangeValue: (value: LimitExpiryEnum) => void;
}

const ExpiresSelect: React.FC<IExpiresSelectProps> = ({ selectedValue = EXPIRY_LIST[0].value, onChangeValue }) => {
  const styles = getStyles();

  const expiresText = useMemo(() => {
    return EXPIRY_LIST.find(ele => ele.value === selectedValue)?.label;
  }, [selectedValue]);

  return (
    <Touchable
      style={styles.expiresSelectWrap}
      onPress={() =>
        SelectOverlay.showSelectModal({
          title: 'Set expiration time',
          value: selectedValue,
          dataList: EXPIRY_LIST,
          onChangeValue: item => {
            onChangeValue(item.value);
          },
        })
      }>
      <Text style={styles.expiresSelectText}>{expiresText}</Text>
      <Svg icon="chevron_right2" oblongSize={[pTd(6), pTd(11)]} />
    </Touchable>
  );
};

export default ExpiresSelect;
