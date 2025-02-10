// https://github.com/kuatsu/react-native-cloud-storage/blob/master/example/src/views/Home.tsx
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { isIOS } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import Touchable from 'components/Touchable';
import { darkColors } from 'assets/theme';
import navigationService from 'utils/navigationService';
import { useCurrentWallet, useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { TWalletInfo } from '@portkey-wallet/types/types-eoa/wallet';
import CommonAvatar from '../../../components/CommonAvatar';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { getStyles, getAddressCardStyles } from './styles';
import { AddressCard } from './components/AddressCard';
import { MAX_WALLET_NUMBER } from '@portkey-wallet/store/store-eoa/wallet/config';
import CommonToast from 'components/CommonToast';

export default function WalletManagement() {
  const styles = getStyles();
  const addressCardStyles = getAddressCardStyles();
  const checkSecurityLock = useCheckSecurityLock();
  const currentWallet = useCurrentWallet();
  const walletList = useWalletListState();
  const [managing, setManaging] = useState(false);
  const [addWalletDisabled, setAddWalletDisabled] = useState(false);
  useEffect(() => {
    if (!walletList) {
      return;
    }
    walletList.length >= MAX_WALLET_NUMBER && setAddWalletDisabled(true);
  }, [walletList]);
  const iconColor = addWalletDisabled ? darkColors.textDisabled1 : darkColors.textBase1Opacity07;
  const failedToastText = `Add up to ${MAX_WALLET_NUMBER} wallets`;

  console.log('currentWallet, walletList', currentWallet, walletList);

  return (
    <PageContainer
      titleDom="Your Wallets"
      rightDom={
        <Touchable
          onPress={() => {
            if (managing) {
              // TODO: save the new info.
            }
            setManaging(!managing);
          }}>
          <Text style={styles.manageText}>{managing ? 'Done' : 'Manage'}</Text>
        </Touchable>
      }
      type="leftBack"
      pageSafeBottomPadding={!isIOS}
      containerStyles={styles.containerStyles}
      scrollViewProps={{ disabled: false }}>
      <View>
        {walletList.map((item: TWalletInfo, index: number) => {
          return <AddressCard walletInfo={item} currentWallet={currentWallet} addressManaging={managing} key={index} />;
        })}

        {!managing && (
          <View>
            <View style={styles.divider} />
            <Touchable
              style={addressCardStyles.cardContainer}
              onPress={() => {
                if (addWalletDisabled) {
                  CommonToast.fail(failedToastText);
                  return;
                }
                navigationService.push('WalletImportTypeSelect', {
                  needCheckSecurityLock: true,
                });
              }}>
              <View style={[addressCardStyles.card, addressCardStyles.operationCard]}>
                <View style={addressCardStyles.info}>
                  <CommonAvatar
                    hasBorder={false}
                    style={addressCardStyles.avatarIcon}
                    svgName="inport"
                    avatarSize={pTd(24)}
                    height={pTd(24)}
                    width={pTd(24)}
                    color={iconColor}
                  />
                  <View>
                    <Text
                      style={[
                        addressCardStyles.operationText,
                        addWalletDisabled ? addressCardStyles.operationTextDisabled : '',
                      ]}>
                      Import exciting wallet
                    </Text>
                  </View>
                </View>
              </View>
            </Touchable>
            <Touchable
              style={[addressCardStyles.cardContainer, styles.marginTop16]}
              onPress={async () => {
                if (addWalletDisabled) {
                  CommonToast.fail(failedToastText);
                  return;
                }
                await checkSecurityLock(() => {
                  navigationService.push('CreateNewWalletNote');
                });
              }}>
              <View style={[addressCardStyles.card, addressCardStyles.operationCard]}>
                <View style={addressCardStyles.info}>
                  <CommonAvatar
                    hasBorder={false}
                    style={addressCardStyles.avatarIcon}
                    svgName="wallet_fill"
                    avatarSize={pTd(24)}
                    height={pTd(24)}
                    width={pTd(24)}
                    color={iconColor}
                  />
                  <View>
                    <Text
                      style={[
                        addressCardStyles.operationText,
                        addWalletDisabled ? addressCardStyles.operationTextDisabled : '',
                      ]}>
                      Create a new wallet
                    </Text>
                  </View>
                </View>
                <View style={addressCardStyles.advanced}>
                  <Text
                    style={[
                      addressCardStyles.advancedText,
                      addWalletDisabled ? addressCardStyles.operationTextDisabled2 : '',
                    ]}>
                    Advanced
                  </Text>
                </View>
              </View>
            </Touchable>
          </View>
        )}
      </View>
    </PageContainer>
  );
}
