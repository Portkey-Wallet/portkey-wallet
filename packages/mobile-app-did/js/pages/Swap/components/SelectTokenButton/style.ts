import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';

export const getButtonStyles = makeStyles(theme => ({
  selectTokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: pTd(4),
    borderRadius: pTd(17),
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    borderStyle: 'solid',
  },
  symbolText: {
    marginHorizontal: pTd(4),
    ...fonts.SGMediumFont,
    fontSize: pTd(16),
    lineHeight: pTd(16),
    color: theme.colors.textBase1,
  },
  iconWrap: {
    width: pTd(30),
    height: pTd(26),
    position: 'relative',
  },
  tokenIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  chainIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
  },
}));

export const getContentStyles = makeStyles(theme => ({
  containerStyle: {
    marginTop: pTd(4),
    marginBottom: pTd(12),
  },
  inputContainerStyle: {
    marginHorizontal: pTd(16),
  },
  tokenItem: {
    paddingLeft: 0,
  },
  emptyText: {
    paddingTop: pTd(16),
    paddingBottom: pTd(28),
    fontSize: pTd(16),
    lineHeight: pTd(22),
    color: theme.colors.textBase2,
    textAlign: 'center',
  },
}));
