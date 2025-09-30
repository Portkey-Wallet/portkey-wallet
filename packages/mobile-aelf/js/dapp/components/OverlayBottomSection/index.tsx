import React from 'react';
import { View, ViewProps } from 'react-native';
import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import ButtonRow from 'components/ButtonRow';
import { CommonButtonProps } from 'components/CommonButton';
import { screenWidth } from '@portkey-wallet/utils-mobile/device';
import { makeStyles } from '@rneui/themed';

export interface OverlayBottomSectionProps extends ViewProps {
  children?: React.ReactNode;
  bottomButtonGroup?: {
    onPress?: () => void;
    type?: CommonButtonProps['type'];
    title: string;
    loading?: CommonButtonProps['loading'];
    disabled?: boolean;
  }[];
}

export const OverlayBottomSection: React.FC<OverlayBottomSectionProps> = props => {
  const { children, bottomButtonGroup } = props;
  const styles = getStyles();

  return (
    <View style={styles.groupWrap}>
      <ButtonRow
        style={styles.buttonGroup}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonTitleStyle}
        buttons={bottomButtonGroup}
      />
      {children}
    </View>
  );
};

export const getStyles = makeStyles(theme => ({
  groupWrap: {
    width: screenWidth,
    position: 'absolute',
    bottom: 0,
    ...GStyles.paddingArg(0, 16, 14, 16),
    backgroundColor: theme.colors.bgBase1,
  },
  buttonGroup: {
    backgroundColor: theme.colors.bgBase1,
  },
  buttonStyle: {
    height: pTd(48),
    fontSize: pTd(16),
  },
  buttonTitleStyle: {
    fontSize: pTd(16),
  },
}));
