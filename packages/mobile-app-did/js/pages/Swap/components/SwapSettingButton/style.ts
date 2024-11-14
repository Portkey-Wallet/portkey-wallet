import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';

export const getStyles = makeStyles(theme => ({
  modalContentWrap: {
    paddingHorizontal: pTd(16),
    paddingTop: pTd(8),
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pTd(8),
  },
  labelText: {
    marginRight: pTd(4),
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  slippageToleranceInputContainer: {
    height: pTd(16),
    paddingHorizontal: 0,
  },
  slippageToleranceInputContainerStyle: {
    height: pTd(16),
    borderBottomWidth: 0,
  },
  slippageToleranceInputStyle: {
    ...fonts.SGRegularFont,
    fontSize: pTd(16),
    color: theme.colors.textBrand4,
    textAlign: 'right',
    paddingRight: pTd(2),
  },
  slippageToleranceUnitText: {
    fontSize: pTd(16),
    color: theme.colors.textBrand4,
  },
  expiresByWrap: {
    marginTop: pTd(16),
  },
  expiresByInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiresByInputContainer: {
    width: pTd(100),
    height: pTd(40),
  },
  expiresByUnitText: {
    marginLeft: pTd(10),
    fontSize: pTd(16),
    lineHeight: pTd(22),
  },
  bottomButton: {
    marginTop: pTd(16),
  },
}));
