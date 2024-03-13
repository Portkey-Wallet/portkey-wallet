import { defaultColors } from 'assets/theme';
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth, windowHeight } from 'packages/utils/mobile/device';
import { pTd } from 'utils/unit';

export const overlayStyles = StyleSheet.create({
  // bottom
  bottomBox: {
    overflow: 'hidden',
    borderTopLeftRadius: pTd(8),
    borderTopRightRadius: pTd(8),
    width: screenWidth,
    backgroundColor: defaultColors.bg1,
    maxHeight: screenHeight * 0.6,
    marginBottom: 20,
  },
  // center
  centerBox: {
    maxHeight: windowHeight * 0.7,
    maxWidth: 500,
    width: screenWidth - 48,
    backgroundColor: defaultColors.bg1,
    borderRadius: pTd(8),
    padding: pTd(24),
  },
  //account list
  headerRow: {
    paddingTop: 14,
    paddingBottom: 7,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: defaultColors.border6,
  },
  headerIcon: {
    height: 5,
    borderRadius: 3,
    backgroundColor: defaultColors.bg7,
    width: '13%',
  },
});
