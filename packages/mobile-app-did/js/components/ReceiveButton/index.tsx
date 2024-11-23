import React from 'react';
import OutlinedButton, { TOutlinedStyleProps } from 'components/OutlinedButton';
import { useLanguage } from 'i18n/hooks';

type ReceiveButtonType = TOutlinedStyleProps & {
  onPress: () => void;
};

export default function ReceiveButton(props: ReceiveButtonType) {
  const { onPress } = props;
  const { t } = useLanguage();

  return <OutlinedButton {...props} iconName="receive" title={t('Receive')} onPress={onPress} />;
}
