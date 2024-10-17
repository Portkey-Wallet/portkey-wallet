import React, { memo, useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import { StyleProp, ViewProps } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import AssetsOverlay from 'pages/DashBoard/AssetsOverlay';
import OutlinedButton from 'components/OutlinedButton';

interface SendButtonType {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
  wrapStyle?: StyleProp<ViewProps>;
}

const SendButton = (props: SendButtonType) => {
  const { t } = useLanguage();
  const { themeType = 'dashBoard', sentToken } = props;

  const onPressButton = useCallback(() => {
    if (themeType === 'innerPage')
      return navigationService.navigate('SendHome', {
        sendType: 'token',
        assetInfo: sentToken,
        toInfo: {
          name: '',
          address: '',
        },
      } as unknown as IToSendHomeParamsType);
    AssetsOverlay.showAssetList();
  }, [sentToken, themeType]);
  return <OutlinedButton iconName="send" title={t('Send')} onPress={onPressButton} />;
};

export default memo(SendButton);
