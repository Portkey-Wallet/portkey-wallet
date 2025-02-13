import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

export const getCardStyles = makeStyles(theme => ({
  cardContainer: {
    marginBottom: pTd(24),
  },
  showHeader: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  editableHeader: {
    borderRadius: pTd(8),
    paddingVertical: pTd(16),
    paddingHorizontal: pTd(12),
    backgroundColor: theme.colors.bgBase2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: pTd(8),
  },
  editableHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconVector2: {
    marginRight: pTd(2),
    marginLeft: pTd(2),
  },
  addressNameShow: {
    color: theme.colors.textBase1Opacity07,
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
    marginRight: pTd(4),
  },
  addressNameEdit: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
    // fontWeight: 'bold',
  },
  manageText: {
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
    color: theme.colors.textBase4,
  },
}));

export const getAddressCardStyles = makeStyles(theme => ({
  cardListContainer: {
    borderRadius: pTd(8),
    backgroundColor: theme.colors.bgBase2,
  },
  cardContainer: {
    flexDirection: 'column',
    backgroundColor: theme.colors.bgBase2,
    paddingHorizontal: pTd(16),
    borderRadius: pTd(8),
  },
  divider: {
    backgroundColor: theme.colors.bgBase1,
    height: pTd(1),
  },
  card: {
    flexDirection: 'row',
    height: pTd(78),
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  operationCard: {
    height: pTd(64),
  },
  iconBase: {
    backgroundColor: 'transparent',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarIcon: {
    marginRight: pTd(12),
    backgroundColor: 'transparent',
  },
  loadingStyle: {
    width: pTd(20),
  },
  title: {
    ...fonts.SGMediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
    // marginTop: pTd(8),
  },
  titleRegular: {
    ...fonts.SGRegularFont,
  },
  operationText: {
    color: theme.colors.textBase1,
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
  },
  operationTextDisabled: {
    color: theme.colors.textDisabled1,
  },
  operationTextDisabled2: {
    color: theme.colors.textDisabled2,
  },
  subtitle: {
    color: theme.colors.textBase1Opacity07,
    fontSize: pTd(14),
    lineHeight: pTd(14) * 1.4,
    marginTop: pTd(4),
    width: pTd(250),
  },
  advanced: {
    backgroundColor: theme.colors.bgBase3,
    borderRadius: pTd(4),
    height: pTd(20),
    width: pTd(69),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  advancedText: {
    fontSize: pTd(12),
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export const getStyles = makeStyles(theme => ({
  containerStyles: {
    backgroundColor: theme.colors.bgBase1,
    justifyContent: 'space-between',
    paddingTop: pTd(16),
  },
  manageText: {
    fontSize: pTd(16),
    lineHeight: pTd(16) * 1.4,
    color: theme.colors.textBase4,
    marginRight: pTd(16),
  },
  icon: {
    backgroundColor: 'transparent',
  },
  marginTop16: {
    marginTop: pTd(16),
  },
  divider: {
    // marginTop: pTd(24),
    marginBottom: pTd(24),
    height: pTd(1),
    backgroundColor: theme.colors.bgBase3,
  },
  deleteWalletWrap: {
    // height: pTd(48),
    height: pTd(48),
    alignContent: 'center',
    justifyContent: 'center',
  },
  deleteWalletText: {
    ...fonts.SGMediumFont,
    color: theme.colors.textDanger1,
    fontSize: 16,
    textAlign: 'center',
  },
}));
