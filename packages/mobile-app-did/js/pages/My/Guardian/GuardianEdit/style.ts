import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { windowHeight } from '@portkey-wallet/utils-mobile/device';
import { makeStyles } from '@rneui/themed';

export const getPageStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(16, 16, 0),
    minHeight: windowHeight - pTd(100),
  },
  contentWrap: {
    flex: 1,
  },
  titleLabel: {
    color: theme.colors.textBase1,
    lineHeight: pTd(22),
    marginRight: pTd(4),
  },
  typeWrap: {
    marginBottom: pTd(24),
  },
  titleTextStyle: {
    fontSize: pTd(16),
  },
  selectListTitleStyle: {
    ...GStyles.flexRowWrap,
    ...GStyles.itemCenter,
    paddingVertical: pTd(12),
  },
  notSelectedTitleStyle: {
    color: theme.colors.textBase3,
  },
  verifierImageStyle: {
    marginRight: pTd(8),
  },
  formItemLabelWrap: {
    ...GStyles.flexRow,
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  verifierWrap: {
    marginBottom: pTd(4),
  },
  removeBtnWrap: {
    marginTop: pTd(8),
  },
  errorTips: {
    color: theme.colors.textDanger2,
    paddingTop: pTd(8),
  },
  warningTips: {
    color: theme.colors.textDanger2,
    marginTop: pTd(8),
  },
  accountWrap: {
    marginBottom: pTd(24),
  },
  accountLabel: {
    color: theme.colors.textBase1,
    marginBottom: pTd(8),
    lineHeight: pTd(22),
  },
  typeIcon: {
    borderRadius: pTd(14),
    marginRight: pTd(12),
  },
  itemIconWrap: {
    marginRight: pTd(8),
  },
}));
