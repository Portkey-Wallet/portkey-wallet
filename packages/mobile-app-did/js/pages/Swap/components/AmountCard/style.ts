import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

export const getStyles = makeStyles(theme => ({
  container: {
    height: pTd(126),
    padding: pTd(16),
    borderRadius: pTd(16),
    backgroundColor: theme.colors.bgBase2,
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    borderStyle: 'solid',
  },
  title: {
    ...fonts.SGMediumFont,
    fontSize: pTd(14),
    lineHeight: pTd(14),
    color: theme.colors.textBase3,
  },
  amountWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pTd(54),
  },
  amountTextWrap: {
    flex: 1,
  },
  amountText: {
    fontFamily: 'BricolageGrotesque-Bold',
    fontSize: pTd(32),
    lineHeight: pTd(52),
    color: theme.colors.textBase1,
  },
  amountTextPlaceholder: {
    color: theme.colors.textBase3,
  },
  containerStyle: {
    flex: 1,
    height: pTd(52),
    paddingHorizontal: 0,
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
    height: pTd(52),
  },
  inputStyle: {
    padding: 0,
    fontFamily: 'BricolageGrotesque-Bold',
    fontSize: pTd(32),
    height: pTd(52),
    color: theme.colors.textBase1,
  },
  errorStyle: {
    display: 'none',
  },
  errorInputStyle: {
    color: theme.colors.textDanger1,
  },
  selectTokenButton: {
    marginLeft: pTd(8),
  },
  infoWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: pTd(26),
  },
  usdAmountWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  usdAmount: {
    flex: 1,
    fontSize: pTd(14),
    lineHeight: pTd(14),
    color: theme.colors.textBase2,
  },
  usdAmountPercent: {
    flexShrink: 0,
    fontSize: pTd(14),
    lineHeight: pTd(14),
  },
  usdAmountPercentPositive: {
    color: theme.colors.textSuccess1,
  },
  usdAmountPercentNegative: {
    color: theme.colors.textDanger2,
  },
  balanceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: pTd(8),
  },
  balanceAmount: {
    marginRight: pTd(8),
    fontSize: pTd(14),
    color: theme.colors.textBase2,
  },
  maxButton: {
    height: 'auto',
    paddingHorizontal: pTd(8),
    paddingVertical: pTd(6),
    borderWidth: pTd(1),
  },
  maxButtonTitle: {
    ...fonts.SGRegularFont,
    fontSize: pTd(14),
    lineHeight: pTd(14),
    color: theme.colors.textBase2,
  },
}));
