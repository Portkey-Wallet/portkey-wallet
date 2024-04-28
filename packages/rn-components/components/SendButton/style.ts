import { pTd } from '@portkey-wallet/rn-base/utils/unit';
import { makeStyles } from '../../theme';

export const useStyles = makeStyles(theme => {
  return {
    buttonWrap: {
      marginBottom: 32,
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
      color: theme.font16,
      fontSize: pTd(12),
      lineHeight: pTd(16),
    },
    dashBoardTitleColorStyle: {
      color: theme.font16,
      lineHeight: pTd(16),
      fontWeight: '400',
    },
    innerPageTitleColorStyle: {
      color: theme.font4,
    },
  };
});
