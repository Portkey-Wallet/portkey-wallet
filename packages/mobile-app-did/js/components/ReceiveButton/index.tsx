import React from 'react';
import OutlinedButton, { TOutlinedStyleProps } from 'components/OutlinedButton';
import { useLanguage } from 'i18n/hooks';

type ReceiveButtonType = TOutlinedStyleProps & {
  onPress: () => void;
};

export default function ReceiveButton(props: ReceiveButtonType) {
  const { onPress } = props;
  const { t } = useLanguage();

  // const onPressButton = useCallback(() => {
  //   if (themeType === 'innerPage') return navigationService.navigate('Receive', currentTokenInfo);
  //   navigationService.navigate('ReceiveSelectToken');
  // }, [currentTokenInfo, themeType]);

  return <OutlinedButton {...props} iconName="receive" title={t('Receive')} onPress={onPress} />;
}
