import GStyles from 'assets/theme/GStyles';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';

const { font2, bg1 } = defaultColors;

export const getContactListStyles = makeStyles(theme => ({
  bg: {
    backgroundColor: theme.colors.bgBase1,
    // backgroundColor: 'red',
  },
  listWrap: {
    flex: 1,
  },
  noResult: {
    lineHeight: pTd(22),
    marginTop: pTd(60),
    textAlign: 'center',
  },
  addButtonWrap: {
    width: '100%',
    height: pTd(44),
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  addButton: {
    marginBottom: pTd(60),
    borderRadius: pTd(6),
    height: pTd(44),
    width: pTd(168),
  },
  addText: {
    marginLeft: pTd(8),
    color: font2,
  },
  addButtonTitleStyle: {
    fontSize: pTd(14),
    color: font2,
  },
  sectionIndex: {
    height: pTd(44),
    lineHeight: pTd(20),
    color: theme.colors.textBase2,
    ...GStyles.paddingArg(16, 16, 8, 16),
  },
  sectionIndexWrap: {
    backgroundColor: bg1,
  },
}));
