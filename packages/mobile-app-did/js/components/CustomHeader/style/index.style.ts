import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

const { bg1, bg5, font5, icon5 } = defaultColors;

export const headerHeight = pTd(52);

const styles = StyleSheet.create({
  leftTitle: {
    height: '100%',
    paddingHorizontal: pTd(16),
  },
});

export const blueStyles = StyleSheet.create({
  ...styles,
  sectionContainer: {
    height: pTd(52),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: bg5,
  },
  leftDomWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  centerWrap: {
    flex: 2.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: bg1,
    fontWeight: 'bold',
    ...fonts.mediumFont,
  },
  rightDomWrap: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  leftBackTitle: {
    color: bg1,
    marginLeft: pTd(4),
  },
});

export const whitStyles = StyleSheet.create({
  ...styles,
  sectionContainer: {
    height: pTd(44),
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: bg1,
  },
  leftDomWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  centerWrap: {
    flex: 2.5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: font5,
    fontWeight: 'bold',
    ...fonts.mediumFont,
  },
  rightDomWrap: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  leftBackTitle: {
    color: icon5,
  },
});

export const hideTitleStyles = StyleSheet.create({
  leftDomWrap: {
    width: 'auto',
    flex: 2,
  },
  centerWrap: {
    flex: 0,
  },
  rightDomWrap: {
    width: 'auto',
    flex: 1,
  },
});

export default blueStyles;
