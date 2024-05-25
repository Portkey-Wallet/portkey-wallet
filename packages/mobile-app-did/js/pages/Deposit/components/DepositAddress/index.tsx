import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import OverlayModal from 'components/OverlayModal';
import Svg from 'components/Svg';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { CopyButton } from 'components/CopyButton';
import { useGStyles } from 'assets/theme/useGStyles';
import fonts from 'assets/theme/fonts';
import { TDepositInfo } from '@portkey-wallet/types/types-ca/deposit';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { TTokenItem, TNetworkItem, TRecordsStatus } from '@portkey-wallet/types/types-ca/deposit';
import { formatSymbolDisplay } from '@portkey-wallet/utils/format';
import { useDepositRecord } from '@portkey-wallet/hooks/hooks-ca/deposit';
import { showCopyDepositAddress } from '../CopyContractAddress';

interface DepositAddressProps {
  fromNetwork: TNetworkItem;
  fromToken: TTokenItem;
  depositInfo: TDepositInfo;
  contractAddress: string;
}

const DepositAddress: React.FC<DepositAddressProps> = ({ fromNetwork, fromToken, depositInfo, contractAddress }) => {
  const gStyles = useGStyles();
  const { lastRecord } = useDepositRecord({ fromSymbol: fromToken.symbol, address: depositInfo.depositAddress });

  const onContactPortkeyTeam = useCallback(() => {
    Linking.openURL('https://t.me/Portkey_Official_Group');
  }, []);

  const isSameSymbol = useMemo(() => {
    return lastRecord?.fromTransfer?.symbol === lastRecord?.toTransfer?.symbol;
  }, [lastRecord]);

  const recordBgColor = useMemo(() => {
    if (lastRecord?.status === TRecordsStatus.Succeed) {
      return defaultColors.bg36;
    } else if (lastRecord?.status === TRecordsStatus.Failed) {
      return defaultColors.bg38;
    } else {
      // default is TRecordsStatus.Processing
      return defaultColors.bg37;
    }
  }, [lastRecord?.status]);

  const recordIcon = useMemo(() => {
    if (lastRecord?.status === TRecordsStatus.Succeed) {
      return 'deposit_status_success';
    } else if (lastRecord?.status === TRecordsStatus.Failed) {
      return 'deposit_status_failed';
    } else {
      // default is TRecordsStatus.Processing
      return 'deposit_status_processing';
    }
  }, [lastRecord?.status]);

  const depositSucceedText = useMemo(() => {
    let text = '';
    if (isSameSymbol) {
      text = `Deposit successful, with ${lastRecord?.toTransfer?.amount} ${lastRecord?.toTransfer?.symbol} sent to you.`;
    } else {
      text = `Swap successful, with ${lastRecord?.toTransfer?.amount} ${lastRecord?.toTransfer?.symbol} sent to you.`;
    }
    return <Text style={styles.recordText}>{text}</Text>;
  }, [isSameSymbol, lastRecord]);
  const depositFailedText = useMemo(() => {
    if (isSameSymbol) {
      return (
        <Text style={styles.recordText}>
          Swap failed. Please contact the{' '}
          <Text onPress={onContactPortkeyTeam} style={styles.contactPortkeyText}>
            Portkey team
          </Text>{' '}
          for help.
        </Text>
      );
    } else {
      return (
        <Text
          style={
            styles.recordText
          }>{`Swap failed, with ${lastRecord?.fromTransfer?.amount} ${lastRecord?.fromTransfer?.symbol} sent to you.`}</Text>
      );
    }
  }, [isSameSymbol, lastRecord, onContactPortkeyTeam]);
  const depositProcessingText = useMemo(() => {
    let text = '';
    if (isSameSymbol) {
      text = `${lastRecord?.toTransfer?.amount} ${lastRecord?.toTransfer?.symbol} received, pending cross-chain transfer.`;
    } else {
      text = `${lastRecord?.toTransfer?.amount} ${lastRecord?.toTransfer?.symbol} received, pending swap.`;
    }
    return <Text style={styles.recordText}>{text}</Text>;
  }, [isSameSymbol, lastRecord]);

  const recordText = useMemo(() => {
    if (lastRecord?.status === TRecordsStatus.Succeed) {
      return depositSucceedText;
    } else if (lastRecord?.status === TRecordsStatus.Failed) {
      return depositFailedText;
    } else {
      // default is TRecordsStatus.Processing
      return depositProcessingText;
    }
  }, [depositFailedText, depositProcessingText, depositSucceedText, lastRecord]);

  const onPressContractAddress = useCallback(() => {
    showCopyDepositAddress({
      fromNetwork,
      fromToken,
      contractAddress,
      onExplore: () => {
        // dismiss the current modal when push to discover page
        OverlayModal.hide(false);
      },
    });
  }, [contractAddress, fromNetwork, fromToken]);

  return (
    <ModalBody modalBodyType="bottom" title={'Deposit Address'} style={gStyles.overlayStyle}>
      <ScrollView>
        <View style={styles.container}>
          {lastRecord && (
            <View style={[styles.recordWrap, { backgroundColor: recordBgColor }]}>
              <Svg iconStyle={styles.recordIcon} size={pTd(16)} icon={recordIcon} />
              {recordText}
            </View>
          )}
          <View style={styles.tokenWrap}>
            <Image style={styles.tokenImage} source={{ uri: fromToken.icon }} />
            <Text style={styles.tokenText}>{formatSymbolDisplay(fromToken.symbol)}</Text>
          </View>
          <Text style={styles.chainText}>{fromNetwork.name}</Text>
          <View style={styles.qrcodeWrap}>
            <CommonQRCodeStyled
              style={styles.qrcode}
              qrData={depositInfo.depositAddress}
              width={pTd(216)}
              logo={undefined}
            />
            <View style={styles.qrCodeLogoWrap}>
              <View style={styles.qrCodeLogo}>
                <Image style={styles.qrCodeImage} source={{ uri: fromToken.icon }} />
              </View>
            </View>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressLabelText}>Deposit Address</Text>
            <View style={styles.addressWrap}>
              <Text style={styles.addressText}>{depositInfo.depositAddress}</Text>
              <CopyButton copyContent={contractAddress} />
            </View>
          </View>
          {depositInfo.minAmount && (
            <View style={styles.minimumDepositWrap}>
              <Text style={styles.minimumDepositText}>Minimum Deposit</Text>
              <View style={styles.minimumAmountWrap}>
                <Text style={styles.minimumAmountText}>{depositInfo.minAmount + ' ' + fromToken.symbol}</Text>
                <Text style={styles.minimumAmountUsdText}>{'$ ' + depositInfo.minAmountUsd}</Text>
              </View>
            </View>
          )}
          {contractAddress && (
            <View style={styles.contractAddressWrap}>
              <Text style={styles.contractAddressLabel}>Contract Address</Text>
              <View style={styles.flex} />
              <Text style={styles.contractAddressText}>{formatStr2EllipsisStr(contractAddress, 6)}</Text>
              <TouchableOpacity onPress={onPressContractAddress}>
                <Svg icon={'question'} size={pTd(12)} iconStyle={styles.contractAddressIcon} />
              </TouchableOpacity>
            </View>
          )}
          {depositInfo.extraNotes && (
            <View style={styles.noteWrap}>
              {depositInfo.extraNotes?.map((item, index) => {
                return (
                  <Text style={styles.noteText} key={index + ''}>
                    {'• ' + item}
                  </Text>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </ModalBody>
  );
};

export const showDepositAddress = (props: DepositAddressProps) => {
  OverlayModal.show(<DepositAddress {...props} />, {
    position: 'bottom',
    enabledNestScrollView: true,
  });
};

export default {
  showDepositAddress,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: pTd(16),
    alignItems: 'center',
    paddingBottom: pTd(24),
  },
  recordWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: pTd(10),
    borderRadius: pTd(6),
  },
  recordIcon: {
    marginLeft: pTd(8),
    borderRadius: pTd(8),
  },
  recordText: {
    marginLeft: pTd(8),
    marginRight: pTd(8),
    color: defaultColors.font1,
    fontSize: pTd(12),
  },
  contactPortkeyText: {
    color: defaultColors.font25,
    textDecorationLine: 'underline',
  },
  tokenWrap: {
    marginTop: pTd(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenImage: {
    width: pTd(24),
    height: pTd(24),
    borderRadius: pTd(12),
  },
  tokenText: {
    marginLeft: pTd(8),
    fontSize: pTd(20),
    color: defaultColors.font5,
    ...fonts.mediumFont,
  },
  chainText: {
    color: defaultColors.font11,
    fontSize: pTd(14),
  },
  qrcodeWrap: {
    marginTop: pTd(16),
    width: pTd(240),
    height: pTd(240),
    borderRadius: pTd(11),
    borderColor: defaultColors.border8,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrcode: {
    width: pTd(216),
    height: pTd(216),
  },
  qrCodeLogoWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeLogo: {
    width: pTd(26),
    height: pTd(26),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultColors.white,
  },
  qrCodeImage: {
    width: pTd(20),
    height: pTd(20),
  },
  addressCard: {
    marginTop: pTd(24),
    width: '100%',
    padding: pTd(12),
    borderWidth: 0.5,
    borderColor: defaultColors.border8,
    borderRadius: pTd(6),
  },
  addressLabelText: {
    color: defaultColors.font11,
    fontSize: pTd(12),
  },
  addressWrap: {
    marginTop: pTd(8),
    flexDirection: 'row',
  },
  addressText: {
    flex: 1,
    fontSize: pTd(14),
    color: defaultColors.font5,
    ...fonts.mediumFont,
    marginRight: pTd(12),
  },
  minimumDepositWrap: {
    marginTop: pTd(12),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  minimumDepositText: {
    fontSize: pTd(12),
    color: defaultColors.font23,
  },
  minimumAmountWrap: {
    alignItems: 'flex-end',
  },
  minimumAmountText: {
    color: defaultColors.font24,
    fontSize: pTd(12),
  },
  minimumAmountUsdText: {
    color: defaultColors.font11,
    fontSize: pTd(12),
  },
  contractAddressWrap: {
    marginTop: pTd(12),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  contractAddressLabel: {
    fontSize: pTd(12),
    color: defaultColors.font23,
  },
  contractAddressText: {
    fontSize: pTd(12),
    color: defaultColors.font24,
  },
  contractAddressIcon: {
    marginLeft: pTd(4),
  },
  noteWrap: {
    width: '100%',
    backgroundColor: defaultColors.bg33,
    marginTop: pTd(24),
    padding: pTd(12),
    borderRadius: pTd(6),
  },
  noteText: {
    color: defaultColors.font18,
    fontSize: pTd(12),
  },
  flex: {
    flex: 1,
  },
});
