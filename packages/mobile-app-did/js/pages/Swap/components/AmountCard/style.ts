import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

export const getStyles = makeStyles(theme => ({
  container: {
    padding: pTd(16),
    borderRadius: pTd(16),
    backgroundColor: theme.colors.bgBase2,
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    borderStyle: 'solid',
  },
  title: {
    marginBottom: pTd(8),
    ...fonts.SGMediumFont,
    fontSize: pTd(14),
    lineHeight: pTd(14),
    color: theme.colors.textBase3,
  },
  amountWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  amountText: {
    flex: 1,
    ...fonts.BGMediumFont,
    fontSize: pTd(32),
    lineHeight: pTd(38),
    color: theme.colors.textBase1,
  },
  containerStyle: {
    flex: 1,
    height: pTd(38),
    marginRight: -pTd(2),
    marginLeft: -pTd(10),
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
  },
  inputStyle: {
    ...fonts.BGMediumFont,
    fontSize: pTd(32),
    lineHeight: pTd(38),
    color: theme.colors.textBase1,
  },
  infoWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usdAmount: {
    flex: 1,
    fontSize: pTd(14),
    lineHeight: pTd(14),
    color: theme.colors.textBase2,
  },
  balanceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: pTd(8),
  },
  balanceAmount: {
    marginRight: pTd(8),
    fontSize: pTd(14),
    lineHeight: pTd(14),
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
