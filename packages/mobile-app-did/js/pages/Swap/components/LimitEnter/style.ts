import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

export const getStyles = makeStyles(() => ({
  limitEnterWrap: {
    overflow: 'hidden',
  },
  amountCardGroup: {
    marginTop: pTd(8),
  },
  promptCard: {
    marginTop: pTd(16),
  },
  actionButton: {
    marginTop: pTd(16),
  },
  rateCard: {
    marginTop: pTd(16),
  },
  infoWrap: {
    marginTop: pTd(16),
  },
}));
