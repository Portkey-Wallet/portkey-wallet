import React, { useCallback, useEffect } from 'react';
import Card from './Card';
import DashBoardTab from './DashBoardTab';
import SafeAreaBox from 'components/SafeAreaBox';
import { BGStyles } from 'assets/theme/styles';
import { RootStackName } from 'navigation';
import myEvents from 'utils/deviceEvent';
import useExceptionMessage from 'hooks/userExceptionMessage';
import { useEffectOnce } from '@portkey-wallet/hooks';
import CommonButton from 'components/CommonButton';
import navigationService from 'utils/navigationService';

const DashBoard: React.FC<any> = ({ navigation }) => {
  const exceptionMessage = useExceptionMessage();

  const navToChat = useCallback(
    (tabName: RootStackName) => {
      if (navigation && navigation.jumpTo) {
        navigation.jumpTo(tabName);
      }
    },
    [navigation],
  );

  useEffectOnce(() => {
    exceptionMessage('DashBoard');
  });

  // nav's to chat tab
  useEffect(() => {
    const listener = myEvents.navToBottomTab.addListener(({ tabName }) => navToChat(tabName));
    return () => listener.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <SafeAreaBox edges={['top', 'right', 'left']} style={[BGStyles.bg5]}>
      <Card />
      <DashBoardTab />
      <CommonButton
        onPress={() =>
          navigationService.navigateByMultiLevelParams('Home', { multiLevelParams: { name: 1 } })
        }></CommonButton>
    </SafeAreaBox>
  );
};

export default DashBoard;
