import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import { pTd } from 'utils/unit';

export const getTagItemStyles = makeStyles(theme => ({
  tagItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: pTd(8),
    borderRadius: pTd(8),
    backgroundColor: theme.colors.bgNeutral2,
  },
  tagItemRound: {
    borderRadius: pTd(24),
  },
  tagItemOutline: {
    borderWidth: pTd(1),
    borderColor: theme.colors.borderBase1,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
  },
  tagItemSelected: {
    backgroundColor: theme.colors.bgBrandDefault,
  },
  mdTagItem: {
    height: pTd(32),
  },
  smTagItem: {
    height: pTd(26),
  },
  checkIcon: {
    marginRight: pTd(4),
  },
  label: {
    color: theme.colors.textNeutral5,
    ...fonts.regularFont,
  },
  mdLabel: {
    fontSize: pTd(16),
    lineHeight: pTd(20),
  },
  smLabel: {
    fontSize: pTd(14),
    lineHeight: pTd(17.5),
  },
  selectedLabel: {
    color: theme.colors.textBrandOn,
  },
}));

export const getTagGroupStyles = makeStyles(() => ({
  tagToggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagItemMarginLeft: {
    marginLeft: pTd(8),
  },
}));
