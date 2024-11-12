import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

export const getStyles = makeStyles(theme => ({
  container: {
    backgroundColor: theme.colors.bgBase2,
    borderRadius: pTd(16),
  },
  arrowIcon: {
    marginHorizontal: pTd(26),
  },
  tokenItem: {
    paddingLeft: 0,
  },
  balanceTextStyle: {
    lineHeight: pTd(22),
  },
  balanceInUseTextStyle: {
    marginTop: 0,
  },
}));
