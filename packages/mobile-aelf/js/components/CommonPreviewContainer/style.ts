import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';

export const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
  },
  headerHelpIcon: {
    marginRight: pTd(16),
  },
  footerWrap: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: pTd(16),
  },
  footerText: {
    ...fonts.SGRegularFont,
    color: theme.colors.textBase3,
    fontSize: pTd(12),
    lineHeight: pTd(12),
    marginRight: pTd(4),
  },
}));
