import React, { useRef } from 'react';
import ActionSheet from '@portkey-wallet/rn-components/components/ActionSheet';
import Button from 'pages/Login/components/Button';
import TopView from 'rn-teaset/components/Overlay/TopView';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import joinGroupBgImage from './joinGroupBgImage.png';
import ButtonCol from '@portkey-wallet/rn-components/components/ButtonCol';
import ButtonRow from '@portkey-wallet/rn-components/components/ButtonRow';
import { TextL, TextM, TextTitle } from '@portkey-wallet/rn-components/components/CommonText';
import CommonToast from '@portkey-wallet/rn-components/components/CommonToast';
import Progressbar, { IProgressbar } from '@portkey-wallet/rn-components/components/Progressbar';
import CommonThemeProvider from '@portkey-wallet/rn-components/theme/provider';
import BuyButton from 'components/BuyButton';
import { useUser } from 'store/hook';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
const JOIN_OFFICIAL_GROUP_TITLE = `Join Portkey Official Group!`;

const JOIN_OFFICIAL_GROUP_CONTENT = `Engage with the Portkey community for the latest updates and discussions.`;

const JOIN_OFFICIAL_GROUP_ERROR_TIP = `This group doesn't exist. Please check the Portkey group before you try again.`;

const JOIN_OFFICIAL_GROUP_BUTTON_TITTLE = 'Join';
const TestComp = () => {
  const { biometrics } = useUser();
  console.log('biometrics', biometrics);
  const progressbarRef = useRef<IProgressbar>(null);
  return (
    <CommonThemeProvider
      value={{
        light: {
          font5: 'blue',
          bg1: 'lightyellow',
        },
      }}>
      <TopView>
        {/*  eslint-disable-next-line react/react-in-jsx-scope*/}
        <SafeAreaView style={styles.container}>
          {/* eslint-disable-next-line react/react-in-jsx-scope */}
          <ButtonCol
            buttons={[
              {
                title: JOIN_OFFICIAL_GROUP_BUTTON_TITTLE,
                onPress: () => {
                  console.log('join!');
                },
              },
              {
                title: 'top',
                onPress: () => {
                  console.log('join!');
                },
              },
              {
                title: 'bottom',
                onPress: () => {
                  console.log('join!');
                },
              },
            ]?.map(i => ({
              ...i,
              onPress: () => {
                // if (autoClose) OverlayModal.hide();
                i.onPress?.();
              },
            }))}
          />
          <ButtonRow
            buttons={[
              {
                title: JOIN_OFFICIAL_GROUP_BUTTON_TITTLE,
                onPress: () => {
                  CommonToast.loading('Your ELF is on its way');
                },
              },
              {
                title: 'top',
                onPress: () => {
                  progressbarRef.current?.changeInnerBarWidth(0.8);
                },
              },
              {
                title: 'bottom',
                onPress: () => {
                  console.log('join!');
                },
              },
            ]?.map(i => ({
              ...i,
              onPress: () => {
                // if (autoClose) OverlayModal.hide();
                i.onPress?.();
              },
            }))}
          />
          <TextL>123</TextL>
          <TextM>123</TextM>
          <TextTitle>123</TextTitle>
          <Progressbar ref={progressbarRef} />
          {/*  eslint-disable-next-line react-native/no-inline-styles */}
          <View style={{ height: 20 }} />
          <BuyButton themeType="innerPage" />
          <Button
            title="ActionSheet alert"
            onPress={() => {
              ActionSheet.alert({
                isCloseShow: true,
                bgImage: joinGroupBgImage,
                title: JOIN_OFFICIAL_GROUP_TITLE,
                message: JOIN_OFFICIAL_GROUP_CONTENT,
                buttons: [
                  {
                    title: JOIN_OFFICIAL_GROUP_BUTTON_TITTLE,
                    onPress: () => {
                      console.log('join!');
                    },
                  },
                ],
              });
            }}
          />
          <Button title="ActionSheet show" onPress={() => ActionSheet.show([{ title: '123' }, { title: '123' }])} />
        </SafeAreaView>
      </TopView>
    </CommonThemeProvider>
  );
};
export default TestComp;
