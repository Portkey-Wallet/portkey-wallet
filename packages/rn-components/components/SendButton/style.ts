import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { makeStyles } from '../../theme';

export const useStyles = makeStyles(theme => {
  return {
    buttonWrap: {
      marginBottom: pTd(24),
      width: pTd(65),
    },
    iconWrapStyle: {
      display: 'flex',
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
    },
    commonTitleStyle: {
      width: '100%',
      marginTop: pTd(4),
      textAlign: 'center',
      color: theme.font2,
      fontSize: pTd(14),
      lineHeight: pTd(20),
    },
    dashBoardTitleColorStyle: {
      color: theme.font2,
    },
    innerPageTitleColorStyle: {
      color: theme.font4,
    },
  };
});
