import { useCallback } from 'react';
import ActionSheet from 'components/ActionSheet';
import { Text, View } from 'react-native';
import { pTd } from 'utils/unit';
import navigationService from 'utils/navigationService';
import React from 'react';
import { makeStyles } from '@rneui/themed';
import fonts from 'assets/theme/fonts';
import Svg from 'components/Svg';
import { TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import { useCurrentWallet, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { AddressCard } from '../components/AddressCard';
import Touchable from 'components/Touchable';
import OverlayModal from 'components/OverlayModal';

export const useAddressSelect = () => {
  const styles = getStyles();
  const currentWallet = useCurrentWallet();
  const walletList = useWalletListState();

  const showAddressSelectModal = useCallback(() => {
    ActionSheet.alert({
      isCloseShow: false,
      title: (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your wallets</Text>
            <Touchable
              onPress={() => {
                // TODO: confirm the router
                // navigationService.push('ProfileSettings');
                OverlayModal.hide();
                navigationService.push('AboutUs');
              }}>
              <Svg icon="gear" size={pTd(20)} />
            </Touchable>
          </View>
        </View>
      ),
      titleStyle: {
        marginBottom: pTd(16),
      },
      message: (
        <View style={styles.container}>
          {walletList.map((item: TWalletInfo, index: number) => {
            return <AddressCard walletInfo={item} currentWallet={currentWallet} addressSelecting={true} key={index} />;
          })}
        </View>
      ),
      buttonGroupDirection: 'column',
      buttons: [
        {
          type: 'outline',
          title: 'Add & manage wallets',
          onPress: async () => {
            navigationService.push('WalletManagement');
          },
        },
      ],
    });
  }, [currentWallet, styles.container, styles.header, styles.headerTitle, walletList]);
  return {
    showAddressSelectModal,
  };
};

const getStyles = makeStyles(() => ({
  container: {
    flexDirection: 'column',
    // alignItems: 'center',
    // width: '100%',
    // position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // marginBottom: pTd(22),
  },
  headerTitle: {
    ...fonts.BGMediumFont,
    fontSize: pTd(20),
    lineHeight: pTd(20) * 1.2,
  },
  logo: {
    backgroundColor: 'transparent',
  },
  title: {
    ...fonts.BGMediumFont,
    fontSize: pTd(32),
    lineHeight: pTd(32) * 1.2,
    textAlign: 'center',
    width: '100%',
  },
  subTitle: {
    fontSize: pTd(14),
    width: '100%',
    lineHeight: pTd(14) * 1.4,
    textAlign: 'center',
    marginTop: pTd(16),
    marginBottom: pTd(48),
  },
}));
