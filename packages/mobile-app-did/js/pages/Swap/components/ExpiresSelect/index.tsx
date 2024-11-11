import React, { useMemo } from 'react';
import { Text } from 'react-native';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import SelectOverlay from 'components/SelectOverlay';
import { pTd } from 'utils/unit';
import { getStyles } from './style';

interface IExpiresSelectProps {
  selectedValue: string;
  onChangeValue: (value: string) => void;
}

const EXPIRES_LIST = [
  { label: '1 day', value: '1' },
  { label: '3 days', value: '3' },
  { label: '7 days', value: '7' },
  { label: '30 days', value: '30' },
];

const ExpiresSelect: React.FC<IExpiresSelectProps> = ({ selectedValue = EXPIRES_LIST[0].value, onChangeValue }) => {
  const styles = getStyles();

  const expiresText = useMemo(() => {
    return EXPIRES_LIST.find(ele => ele.value === selectedValue)?.label;
  }, [selectedValue]);

  return (
    <Touchable
      style={styles.expiresSelectWrap}
      onPress={() =>
        SelectOverlay.showSelectModal({
          title: 'Set expiration time',
          value: selectedValue,
          dataList: EXPIRES_LIST,
          onChangeValue: item => {
            onChangeValue(item.value);
          },
        })
      }>
      <Text style={styles.expiresSelectText}>{expiresText}</Text>
      <Svg icon="chevron_right" oblongSize={[pTd(6), pTd(11)]} />
    </Touchable>
  );
};

export default ExpiresSelect;
