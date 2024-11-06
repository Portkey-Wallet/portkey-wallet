import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

export const getTagItemStyles = makeStyles(theme => ({
  tagItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: pTd(8),
    borderRadius: pTd(8),
    backgroundColor: theme.colors.bgNeutral2,
  },
  selectedTagItem: {
    backgroundColor: theme.colors.bgBrand1,
  },
  checkIcon: {
    marginRight: pTd(4),
  },
  label: {
    fontSize: pTd(16),
    lineHeight: pTd(16),
    color: theme.colors.textNeutral5,
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
