import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { isIOS, screenHeight } from '@portkey-wallet/utils/mobile/device';
import { pTd } from 'utils/unit';
import { makeStyles } from '@rneui/themed';
import PageContainer from 'components/PageContainer';
import fonts from 'assets/theme/fonts';
import { defaultColors } from 'assets/theme';
import ActionSheet from 'components/ActionSheet';
import Svg from 'components/Svg';
import { useWalletCommonStyles } from '../../../Login/styles';
import { getAddressCardStyles, getStyles as getWalletStyles } from '../styles';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useWalletListState } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { resetWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import CommonAvatar from 'components/CommonAvatar';
import { LOCAL_AVATARS } from 'assets/image/avatars';
import Touchable from 'components/Touchable';

export default function ResetApp() {
  const dispatch = useAppCommonDispatch();
  const walletStyles = getWalletStyles();
  const styles = getStyles();
  const checkSecurityLock = useCheckSecurityLock();
  // const credentials = useCredentials();
  const commonStyles = useWalletCommonStyles();
  const addressCardStyles = getAddressCardStyles();
  const walletList = useWalletListState();

  return (
    <View>
      <PageContainer
        pageSafeBottomPadding={!isIOS}
        scrollViewProps={{ disabled: true }}
        containerStyles={[styles.referralContainer]}
        titleDom
        hideTouchable>
        <ScrollView>
          <Text style={commonStyles.title}>Ensure your wallet is backed up</Text>
          <Text style={[commonStyles.desc, { marginBottom: pTd(24) }]}>
            Each wallet has a seed phrase or private key, which is crucial for recovery. View and back them up:
          </Text>
          {walletList.map((wallet, index) => {
            const account = wallet.accountList[0];
            return (
              <View style={[addressCardStyles.card, styles.cardContainer]} key={index}>
                <View style={addressCardStyles.info}>
                  <CommonAvatar
                    hasBorder={false}
                    style={addressCardStyles.avatarIcon}
                    localImage={LOCAL_AVATARS[account.icon || 'avatar_1']}
                    avatarSize={pTd(24)}
                    height={pTd(24)}
                    width={pTd(24)}
                  />
                  <View>
                    <Text style={addressCardStyles.title}>{account.name}</Text>
                    <Text style={[addressCardStyles.subtitle, styles.subTitle]}>
                      {wallet.AESEncryptMnemonic ? 'Seed phrase' : 'Private eky'}
                    </Text>
                  </View>
                </View>
                {/* TODO: addressManageView && notSelected */}
                <Touchable
                  style={styles.viewButton}
                  onPress={() => {
                    console.log(111);
                  }}>
                  <Text style={styles.viewButtonText}>View</Text>
                </Touchable>
              </View>
            );
          })}
        </ScrollView>

        <View style={walletStyles.deleteWalletWrap}>
          <Text
            onPress={() => {
              ActionSheet.alert({
                isCloseShow: true,
                title: <Svg size={pTd(32)} icon="error" color={defaultColors.iconBase1} />,
                title2: 'Confirm the reset',
                message:
                  "If you haven't saved your seed phrase or private key, resetting the app may result in permanent loss of access to your wallet and assets.",
                buttonGroupDirection: 'column',
                buttons: [
                  {
                    title: 'Reset app',
                    type: 'warning',
                    onPress: () => {
                      checkSecurityLock(
                        () => {
                          dispatch(resetWallet());
                        },
                        true,
                        false,
                      );
                    },
                  },
                  {
                    title: 'Cancel',
                    type: 'outline',
                  },
                ],
              });
            }}
            style={walletStyles.deleteWalletText}>
            Reset app
          </Text>
        </View>
      </PageContainer>
    </View>
  );
}

const getStyles = makeStyles(theme => ({
  referralContainer: {
    height: screenHeight,
    backgroundColor: theme.colors.bgBase1,
    justifyContent: 'flex-start',
    gap: 0,
  },
  backgroundContainerWrap: {
    flex: 1,
    marginTop: pTd(44),
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  backgroundContainer: {
    width: pTd(240),
    height: pTd(240),
    padding: 0,
    margin: 0,
    marginTop: pTd(16),
  },
  brandLabel: {
    marginBottom: pTd(16),
  },
  buttonStyle: {
    marginBottom: pTd(16),
  },
  buttonText: {
    fontSize: pTd(16),
    ...fonts.mediumFont,
  },
  cardContainer: {
    borderRadius: pTd(8),
    backgroundColor: theme.colors.bgBase2,
    height: pTd(72),
    paddingHorizontal: pTd(16),
    marginBottom: pTd(16),
  },
  subTitle: {
    width: pTd(100),
  },
  viewButton: {
    height: pTd(32),
    width: pTd(66),
    borderRadius: pTd(999),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.textBase4,
  },
  viewButtonText: {
    ...fonts.SGMediumFont,
    color: theme.colors.bgBase1,
    fontSize: pTd(14),
  },
}));
