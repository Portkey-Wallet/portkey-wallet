import navigationService, { NavigateName } from 'utils/navigationService';
import { useDiscoverJumpWithNetWork } from './discover';
import { Linking } from 'react-native';
import { useCallback } from 'react';
import { TAppLink } from '@portkey-wallet/types/types-ca/cms';

export default function useJump() {
  const jumpToWebview = useDiscoverJumpWithNetWork();
  const jump = useCallback(
    (appRouter: TAppLink) => {
      try {
        const { type, location, params } = appRouter;
        console.log('wfs=== useJump', appRouter);
        if (type === 'internal') {
          jumpToWebview({
            item: {
              name: location,
              url: location,
            },
          });
        } else if (type === 'native') {
          navigationService.navigate(location as NavigateName, params);
        } else {
          Linking.openURL(location);
        }
      } catch (e) {
        console.log('wfs=== error', e);
      }
    },
    [jumpToWebview],
  );
  return jump;
}
