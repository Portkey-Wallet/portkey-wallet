import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

export const useWalletCommonStyles = makeStyles(theme => ({
  containerStyles: {
    backgroundColor: theme.colors.bgBase1,
  },
  title: {
    marginTop: pTd(24),
    // marginBottom: pTd(24),
    fontSize: pTd(32),
    lineHeight: pTd(32) * 1.2,
    ...fonts.BGMediumFont,
  },
  desc: {
    color: theme.colors.textBase2,
    marginTop: pTd(16),
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
  },
}));

export const useCardStyles = makeStyles(theme => ({
  card: {
    flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: theme.colors.bgBase2,
    paddingVertical: pTd(20),
    paddingHorizontal: pTd(16),
    borderRadius: pTd(8),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    fontWeight: 'bold',
    lineHeight: pTd(16) * 1.4,
  },
  subtitle: {
    color: theme.colors.textBase1Opacity07,
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
    marginTop: pTd(4),
  },
}));
