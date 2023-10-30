import React from 'react';
import { View, ViewProps } from 'react-native';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import ButtonRow from 'components/ButtonRow';
import { CommonButtonProps } from 'components/CommonButton';
import { screenWidth } from '@portkey-wallet/utils/mobile/device';

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

  return (
    <View style={styles.groupWrap}>
      {children}
      <ButtonRow
        style={styles.buttonGroup}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonTitleStyle}
        buttons={bottomButtonGroup}
      />
    </View>
  );
};

export const styles = StyleSheet.create({
  groupWrap: {
    width: screenWidth,
    backgroundColor: defaultColors.bg1,
    position: 'absolute',
    bottom: 0,
    ...GStyles.paddingArg(10, 20, 16, 20),
  },
  buttonGroup: {
    backgroundColor: defaultColors.bg1,
  },
  buttonStyle: {
    height: pTd(48),
    fontSize: pTd(18),
  },
  buttonTitleStyle: {
    fontSize: pTd(16),
  },
});
