import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

export const getStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
  },
  wrapStyle: {
    flexGrow: 1,
    marginTop: pTd(16),
  },
  item: {
    height: pTd(48),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pTd(8),
  },
  label: {
    fontSize: pTd(14),
    color: theme.colors.textBase1,
  },
}));
