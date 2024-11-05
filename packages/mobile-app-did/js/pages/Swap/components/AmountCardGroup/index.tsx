import React from 'react';
import { View } from 'react-native';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import AmountCard from '../AmountCard';
import { pTd } from 'utils/unit';
import { ViewStyleType } from 'types/styles';
import { getStyles } from './style';

interface IAmountCardGroupProps {
  style?: ViewStyleType;
}

const AmountCardGroup = ({ style }: IAmountCardGroupProps) => {
  const styles = getStyles();

  return (
    <View style={[styles.amountCardGroup, style]}>
      <AmountCard title="You Pay" isInput />
      <AmountCard style={styles.amountCardMarginTop} title="You Receive" />
      <Touchable style={styles.swapIconWrap}>
        <Svg icon={'swap-arrow'} size={pTd(20)} />
      </Touchable>
    </View>
  );
};

export default AmountCardGroup;
