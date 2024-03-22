import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import { makeStyles } from '../../theme';

const useStyles = makeStyles(theme => {
  return {
    pageWrap: {
      backgroundColor: theme.bg1,
      width: '100%',
      height: '100%',
    },
    pageSafeBottom: {
      paddingBottom: bottomBarHeight || 25,
    },
  };
});

export default useStyles;
