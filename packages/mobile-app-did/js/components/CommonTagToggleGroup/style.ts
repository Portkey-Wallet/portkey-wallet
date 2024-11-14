import { makeStyles } from '@rneui/themed';
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
    backgroundColor: theme.colors.bgBrand1,
  },
  mdTagItem: {
    paddingVertical: pTd(8),
  },
  smTagItem: {
    paddingVertical: pTd(6),
  },
  checkIcon: {
    marginRight: pTd(4),
  },
  label: {
    color: theme.colors.textNeutral5,
  },
  mdLabel: {
    fontSize: pTd(16),
    lineHeight: pTd(16),
  },
  smLabel: {
    fontSize: pTd(14),
    lineHeight: pTd(14),
  },
  selectedLabel: {
    color: theme.colors.textBrand4,
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
