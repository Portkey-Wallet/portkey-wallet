import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth, windowHeight } from '@portkey-wallet/utils/mobile/device';
import { pTd } from '../../../utils/unit';
import { Theme } from '../../../theme/type';

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    // bottom
    bottomBox: {
      overflow: 'hidden',
      borderTopLeftRadius: pTd(8),
      borderTopRightRadius: pTd(8),
      width: screenWidth,
      backgroundColor: theme.bg1,
      maxHeight: screenHeight * 0.6,
      marginBottom: 20,
    },
    // center
    centerBox: {
      maxHeight: windowHeight * 0.7,
      maxWidth: 500,
      width: screenWidth - 48,
      backgroundColor: theme.bg1,
      borderRadius: pTd(8),
      padding: pTd(24),
    },
    //account list
    headerRow: {
      paddingTop: 14,
      paddingBottom: 7,
      alignItems: 'center',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.border6,
    },
    headerIcon: {
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.bg7,
      width: '13%',
    },
  });
