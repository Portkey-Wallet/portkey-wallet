import { makeStyles } from '@rneui/themed';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet } from 'react-native';
import { pTd } from 'utils/unit';

export const getStyles = makeStyles(theme => ({
  contentWrap: {
    ...GStyles.paddingArg(0, 16),
    marginBottom: pTd(100),
  },
  authInfo: {
    ...GStyles.paddingArg(16),
    marginTop: pTd(16),
    height: pTd(54),
    borderRadius: pTd(16),
    backgroundColor: theme.colors.bgBase2,
  },
  arrowIcon: {
    transform: [{ rotate: '-90deg' }],
  },
  bar: {
    marginTop: pTd(12),
    width: '100%',
    height: pTd(1),
    borderTopColor: theme.colors.borderBase1,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tokenWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexSpaceBetween: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    lineHeight: pTd(20),
  },
  section: {
    ...GStyles.paddingArg(16, 0),
  },
  bottomText: {
    marginTop: pTd(16),
    color: theme.colors.textBase2,
  },
}));
