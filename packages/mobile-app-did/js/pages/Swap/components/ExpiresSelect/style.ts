import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

export const getStyles = makeStyles(() => ({
  expiresSelectWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiresSelectText: {
    marginRight: pTd(8),
    ...fonts.SGMediumFont,
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
}));
