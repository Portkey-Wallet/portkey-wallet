import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

export const getStyles = makeStyles(() => ({
  swapEnterWrap: {
    flex: 1,
  },
  contentWrap: {
    flex: 1,
  },
  amountCardGroup: {
    marginTop: pTd(8),
  },
  infoWrap: {
    marginTop: pTd(8),
  },
  promptCard: {
    marginTop: pTd(16),
  },
  previewHide: {
    opacity: 0,
  },
}));
