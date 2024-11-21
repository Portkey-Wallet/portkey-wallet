import React from 'react';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import GStyles from 'assets/theme/GStyles';
import { TextM, TextS } from 'components/CommonText';
import { memo } from 'react';
import { pTd } from 'utils/unit';
import { View } from 'react-native';
interface TraitsProps {
  traitType: string;
  value: string;
  percent: string;
}
const TraitsItem: React.FC<TraitsProps> = (props: TraitsProps) => {
  const { traitType, value, percent } = props;
  const styles = getStyles();
  // return null;
  return (
    <View style={[GStyles.flexCol, GStyles.alignCenter, styles.container]}>
      <TextS style={styles.traitType} numberOfLines={1}>
        {traitType}
      </TextS>
      <TextM style={styles.value} numberOfLines={2}>
        {value}
      </TextM>
      <View style={GStyles.flex1} />
      <TextS style={styles.percent}>{percent}</TextS>
    </View>
  );
};
const getStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.bgBase2,
    borderColor: theme.colors.borderBase1,
    padding: pTd(16),
    alignItems: 'flex-start',
    borderRadius: pTd(16),
    borderWidth: pTd(1),
    width: pTd(173),
    height: pTd(116),
    justifyContent: 'space-between',
  },
  traitType: {
    opacity: 0.7,
    ...fonts.SGRegularFont,
  },
  value: {
    ...fonts.SGMediumFont,
  },
  percent: {
    ...fonts.SGRegularFont,
  },
}));

export default memo(TraitsItem);
