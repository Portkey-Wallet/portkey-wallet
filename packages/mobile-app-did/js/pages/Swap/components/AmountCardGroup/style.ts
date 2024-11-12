import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

export const getStyles = makeStyles(theme => ({
  amountCardGroup: {
    position: 'relative',
  },
  amountCardMarginTop: {
    marginTop: pTd(8),
  },
  swapIconWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: pTd(-20) }, { translateY: pTd(-20) }],
    justifyContent: 'center',
    alignItems: 'center',
    width: pTd(40),
    height: pTd(40),
    borderRadius: pTd(40),
    backgroundColor: theme.colors.bgBrand1,
  },
}));
