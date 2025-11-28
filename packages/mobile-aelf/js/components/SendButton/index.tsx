import React, { memo, useCallback } from 'react';
import navigationService from 'utils/navigationService';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-eoa/routeParams';
import { useLanguage } from 'i18n/hooks';
import OutlinedButton, { TOutlinedStyleProps } from 'components/OutlinedButton';

type TSendButtonType = TOutlinedStyleProps & {
  themeType?: 'dashBoard' | 'innerPage';
  sentToken?: TokenItemShowType;
};

const SendButton = (props: TSendButtonType) => {
  const { t } = useLanguage();
  const { themeType = 'dashBoard', sentToken } = props;

  const onPressButton = useCallback(() => {
    if (themeType === 'innerPage') {
      return navigationService.navigate('SendHome', {
        sendType: 'token',
        assetInfo: sentToken,
        toInfo: {
          name: '',
          address: '',
        },
      } as unknown as IToSendHomeParamsType);
    }
    navigationService.navigate('SelectAsset');
  }, [sentToken, themeType]);

  return <OutlinedButton {...props} iconName="send" title={t('Send')} onPress={onPressButton} />;
};

export default memo(SendButton);
