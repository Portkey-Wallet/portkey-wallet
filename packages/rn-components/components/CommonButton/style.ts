import { pTd } from '../../utils/unit';
import { Theme } from '../../theme/type';
import { makeStyles } from '../../theme';
export const useStyles = makeStyles((theme: Theme) => {
  return {
    buttonStyle: {
      height: pTd(48),
      backgroundColor: theme.bg6,
    },
    titleStyle: {
      color: theme.font4,
      fontSize: pTd(16),
    },
    solidButtonStyle: {
      backgroundColor: theme.bg5,
      borderColor: theme.bg5,
    },
    solidTitleStyle: {
      color: theme.font2,
    },
    outlineTitleStyle: {
      color: theme.font2,
    },
    outlineButtonStyle: {
      backgroundColor: 'transparent',
    },
    primaryButtonStyle: {
      backgroundColor: theme.primaryColor,
    },
    primaryTitleStyle: {
      color: theme.font2,
    },
    disabledStyle: {
      opacity: 0.4,
    },
    disabledPrimaryStyle: {
      opacity: 1,
      backgroundColor: theme.bg14,
    },
    disabledTitleStyle: {
      color: theme.font2,
    },
    clearButtonStyle: {
      borderWidth: 0,
    },
    transparentButtonStyle: {
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
    outlineDisabledTitleStyle: {
      color: theme.font3,
    },
  };
});
