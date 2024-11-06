import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';

export const getStyles = makeStyles(() => ({
  modalContentWrap: {
    paddingHorizontal: pTd(16),
    paddingTop: pTd(8),
    paddingBottom: pTd(100),
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
  expiresByWrap: {
    marginTop: pTd(16),
  },
  expiresByInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiresByInputContainer: {
    width: pTd(100),
  },
  expiresByInput: {
    width: pTd(100),
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
