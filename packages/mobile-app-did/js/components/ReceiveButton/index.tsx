import React from 'react';
import OutlinedButton from 'components/OutlinedButton';
import { useLanguage } from 'i18n/hooks';

interface ReceiveButtonType {
  onPress: () => void;
}

export default function ReceiveButton(props: ReceiveButtonType) {
  const { onPress } = props;
  const { t } = useLanguage();

  // const onPressButton = useCallback(() => {
  //   if (themeType === 'innerPage') return navigationService.navigate('Receive', currentTokenInfo);
  //   navigationService.navigate('ReceiveSelectToken');
  // }, [currentTokenInfo, themeType]);

  return <OutlinedButton iconName="receive" title={t('Receive')} onPress={onPress} />;
}
