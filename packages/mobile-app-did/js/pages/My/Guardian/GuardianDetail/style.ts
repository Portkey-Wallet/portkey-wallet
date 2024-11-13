import { pTd } from 'utils/unit';
import GStyles from 'assets/theme/GStyles';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';

export const getPageStyles = makeStyles(theme => ({
  pageWrap: {
    flex: 1,
    backgroundColor: theme.colors.bgBase1,
    justifyContent: 'space-between',
    ...GStyles.paddingArg(16, 16, 0),
  },
  contentWrap: {
    flex: 1,
  },
  guardianInfoWrap: {
    backgroundColor: theme.colors.bgBase1,
    marginBottom: pTd(24),
    borderRadius: pTd(6),
  },
  dividerStyle: {
    ...GStyles.marginArg(4, 16),
  },
  guardianTypeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifierInfoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginSwitchWrap: {
    backgroundColor: theme.colors.bgNeutral2,
    marginBottom: pTd(16),
    borderRadius: pTd(6),
    padding: pTd(16),
  },
  rowSpaceBetweenItemsCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginSwitchTitle: {
    lineHeight: pTd(22),
  },
  tips: {
    color: theme.colors.textBase2,
    lineHeight: pTd(20),
    paddingTop: pTd(4),
  },
  guardianInfoItem: {
    ...GStyles.paddingArg(16, 0),
  },
  guardianInfoText: {
    marginLeft: pTd(4),
    ...fonts.SGMediumFont,
  },
  textBold: {
    ...fonts.SGMediumFont,
  },
  guardianAccountWrap: {
    alignItems: 'flex-end',
  },
  loginTypeIcon: {
    borderRadius: pTd(14),
    marginRight: pTd(12),
  },
}));
