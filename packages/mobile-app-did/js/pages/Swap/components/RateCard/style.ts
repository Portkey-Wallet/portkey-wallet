import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

export const getStyles = makeStyles(theme => ({
  rateCardWrap: {
    padding: pTd(16),
    borderRadius: pTd(16),
    backgroundColor: theme.colors.bgBase2,
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    borderStyle: 'solid',
  },
  title: {
    marginBottom: pTd(12),
    ...fonts.SGMediumFont,
    fontSize: pTd(14),
    lineHeight: pTd(14),
    color: theme.colors.textBase3,
  },
  amountWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pTd(12),
  },
  amountText: {
    ...fonts.BGMediumFont,
    fontSize: pTd(20),
    lineHeight: pTd(24),
    color: theme.colors.textBase1,
  },
  switchTokenButton: {
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    height: pTd(28),
  },
  switchTokenIcon: {
    marginRight: pTd(4),
  },
  switchTokenText: {
    ...fonts.SGRegularFont,
    fontSize: pTd(14),
    lineHeight: pTd(14),
    color: theme.colors.iconBase2,
  },
  tagItemStyle: {
    flex: 0,
  },
  containerStyle: {
    flex: 1,
    height: pTd(24),
    marginRight: -pTd(2),
    marginLeft: -pTd(10),
  },
  inputContainerStyle: {
    borderBottomWidth: 0,
    height: pTd(24),
  },
  inputStyle: {
    ...fonts.BGMediumFont,
    fontSize: pTd(20),
    lineHeight: pTd(24),
    color: theme.colors.textBase1,
  },
}));
