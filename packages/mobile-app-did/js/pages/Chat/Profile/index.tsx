import React from 'react';

import { TextM } from 'components/CommonText';
import navigationService from 'utils/navigationService';

export default function DiscoverHome() {
  return <TextM onPress={() => navigationService.navigate('ChatDetails')}>ChatHome</TextM>;
}
