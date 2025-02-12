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
import { getStyles as getWalletStyles } from '../styles';
import { useCheckSecurityLock } from 'hooks/securityLock';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { resetWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';

export default function ResetApp() {
  const dispatch = useAppCommonDispatch();
  const walletStyles = getWalletStyles();
  const styles = getStyles();
  const checkSecurityLock = useCheckSecurityLock();
  // const credentials = useCredentials();
  const commonStyles = useWalletCommonStyles();

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
          <Text>Cards</Text>
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
}));
