import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme/index';
import GStyles from 'assets/theme/GStyles';

const { border1, font1, bg5, font2 } = defaultColors;

export const style = StyleSheet.create({
  dialogWrap: {
    backgroundColor: font2,
    borderRadius: 8,
    width: 327,
    ...GStyles.paddingArg(24),
  },
  titleStyle: {
    textAlign: 'center',
    marginBottom: 0,
  },
  buttonWrap: {
    marginTop: 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonGeneral: {
    width: 131,
    height: 40,
    borderRadius: 4,
  },
  confirmButton: {
    backgroundColor: bg5,
  },
  confirmButtonTitle: {
    color: font2,
  },
  cancelButton: {
    borderColor: border1,
    borderWidth: 1,
  },
  cancelButtonTitle: {
    color: font1,
    fontSize: 14,
  },
});
