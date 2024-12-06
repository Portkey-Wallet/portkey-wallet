import { makeStyles } from '@rneui/themed';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';

const getStyles = makeStyles(theme => ({
  scrollWrap: {
    marginTop: pTd(8),
  },
  itemRow: {
    height: pTd(48),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: pTd(16),
  },
  networkImage: {
    width: pTd(24),
    height: pTd(24),
  },
  itemContent: {
    flex: 1,
    marginLeft: pTd(12),
    height: pTd(48),
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainTitle: {
    color: theme.colors.textBase1,
  },
  itemIcon: {
    position: 'absolute',
    right: 0,
  },
  noResult: {
    lineHeight: pTd(22),
    textAlign: 'center',
    marginVertical: pTd(60),
    color: defaultColors.font7,
  },
}));

export default getStyles;
