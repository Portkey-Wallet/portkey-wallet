import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

const getStyles = makeStyles(theme => ({
  itemRow: {
    height: pTd(48),
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: pTd(16),
  },
  verifierImageStyle: {
    marginRight: pTd(12),
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    position: 'absolute',
    right: 0,
  },
  typeOverlayTitleLabel: {
    marginTop: pTd(16),
    marginBottom: pTd(8),
    textAlign: 'center',
  },
  warnWrap: {
    backgroundColor: theme.colors.bg6,
    borderRadius: pTd(6),
    padding: pTd(12),
    flexDirection: 'row',
    marginTop: pTd(16),
    marginHorizontal: pTd(20),
  },
  warningIcon: {
    marginTop: pTd(2),
  },
  warnLabelWrap: {
    color: theme.colors.font3,
    marginLeft: pTd(8),
    flex: 1,
  },
  disableWrap: {
    opacity: 0.3,
  },
  tagStyle: {
    marginLeft: pTd(4),
    backgroundColor: theme.colors.bgSuccess2,
    color: theme.colors.textSuccess5,
  },
}));

export default getStyles;
