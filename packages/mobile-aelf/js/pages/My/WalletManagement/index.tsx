// https://github.com/kuatsu/react-native-cloud-storage/blob/master/example/src/views/Home.tsx
import React, { useState } from 'react';
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

export default function WalletManagement() {
  const styles = getStyles();
  const addressCardStyles = getAddressCardStyles();
  const checkSecurityLock = useCheckSecurityLock();
  const currentWallet = useCurrentWallet();
  const walletList = useWalletListState();
  const [managing, setManaging] = useState(false);

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

        {/*<Text>Changed</Text>*/}
        {/*<AddressCard addressManaging={managing} />*/}

        {/*<Text>Select Show</Text>*/}
        {/*<AddressCard addressSelecting={true} />*/}

        {!managing && (
          <View>
            <View style={styles.divider} />
            <Touchable
              style={addressCardStyles.cardContainer}
              onPress={() => {
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
                    color={darkColors.textBase1Opacity07}
                  />
                  <View>
                    <Text style={addressCardStyles.operationText}>Import exciting wallet</Text>
                  </View>
                </View>
              </View>
            </Touchable>
            <Touchable
              style={[addressCardStyles.cardContainer, styles.marginTop16]}
              onPress={async () => {
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
                    color={darkColors.textBase1Opacity07}
                  />
                  <View>
                    <Text style={addressCardStyles.operationText}>Create a new wallet</Text>
                  </View>
                </View>
                <View style={addressCardStyles.advanced}>
                  <Text style={addressCardStyles.advancedText}>Advanced</Text>
                </View>
              </View>
            </Touchable>
          </View>
        )}
      </View>
    </PageContainer>
  );
}
