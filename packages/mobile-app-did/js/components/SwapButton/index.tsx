import React, { memo, useCallback } from 'react';
import OutlinedButton from 'components/OutlinedButton';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';

const SwapButton = () => {
  const { t } = useLanguage();

  const onPress = useCallback(() => {
    // todo_wade: fix this
  }, []);

  return <OutlinedButton iconName="swap" title={t('Swap')} onPress={onPress} />;
};

export default memo(SwapButton);
