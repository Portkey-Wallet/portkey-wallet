import { windowHeight } from 'packages/utils/mobile/device';
import { isIOS } from 'packages/utils/mobile/device';
import { pTd } from 'utils/unit';
import gSTyles from './GStyles';

export const useGStyles = {
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    ...gSTyles.paddingArg(0, 16),
  },
  pwTip: {
    marginTop: 3,
    color: 'white',
  },
  safeAreaContainer: {
    paddingBottom: !isIOS ? 20 : undefined,
  },
  overlayStyle: {
    height: windowHeight - pTd(isIOS ? 68 : 100),
  },
};
