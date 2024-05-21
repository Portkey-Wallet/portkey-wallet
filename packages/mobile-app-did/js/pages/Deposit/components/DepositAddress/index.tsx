import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import { ModalBody } from 'components/ModalBody';
import OverlayModal from 'components/OverlayModal';
import CommonQRCodeStyled from 'components/CommonQRCodeStyled';
import { useGStyles } from 'assets/theme/useGStyles';
import fonts from 'assets/theme/fonts';
import { TDepositInfo } from '@portkey-wallet/types/types-ca/deposit';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';

interface DepositAddressProps {
  depositInfo: TDepositInfo;
  contractAddress: string;
}

const DepositAddress: React.FC<DepositAddressProps> = ({ depositInfo, contractAddress }) => {
  const gStyles = useGStyles();
  const chainName = 'BNB Smart Chain';
  const tokenName = 'USDT';
  const tokenIcon =
    'https://dynamic-assets.coinbase.com/41f6a93a3a222078c939115fc304a67c384886b7a9e6c15dcbfa6519dc45f6bb4a586e9c48535d099efa596dbf8a9dd72b05815bcd32ac650c50abb5391a5bd0/asset_icons/1f8489bb280fb0a0fd643c1161312ba49655040e9aaaced5f9ad3eeaf868eadc.png';

  return (
    <ModalBody modalBodyType="bottom" title={'Deposit Address'} style={gStyles.overlayStyle}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.tokenWrap}>
            <Image style={styles.tokenImage} source={{ uri: tokenIcon }} />
            <Text style={styles.tokenText}>{tokenName}</Text>
          </View>
          <Text style={styles.chainText}>{chainName}</Text>
          <CommonQRCodeStyled style={styles.qrcode} qrData={depositInfo.depositAddress} width={pTd(240)} />
          <View style={styles.addressCard}>
            <Text style={styles.addressLabelText}>Deposit Address</Text>
            <View style={styles.addressWrap}>
              <Text style={styles.addressText}>{depositInfo.depositAddress}</Text>
              <View style={styles.copyButton} />
            </View>
          </View>
          {depositInfo.minAmount && (
            <View style={styles.minimumDepositWrap}>
              <Text style={styles.minimumDepositText}>Minimum Deposit</Text>
              <View style={styles.minimumAmountWrap}>
                <Text style={styles.minimumAmountText}>{depositInfo.minAmount}</Text>
                <Text style={styles.minimumAmountUsdText}>{depositInfo.minAmountUsd}</Text>
              </View>
            </View>
          )}
          {contractAddress && (
            <View style={styles.contractAddressWrap}>
              <Text style={styles.contractAddressLabel}>Contract Address</Text>
              <Text style={styles.contractAddressText}>{formatStr2EllipsisStr(contractAddress, 6)}</Text>
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
  tokenWrap: {
    marginTop: pTd(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenImage: {
    width: pTd(24),
    height: pTd(24),
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
  qrcode: {
    marginTop: pTd(16),
    width: pTd(240),
    height: pTd(240),
    borderRadius: pTd(11),
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
  },
  copyButton: {
    marginLeft: pTd(12),
    width: pTd(32),
    height: pTd(32),
    backgroundColor: 'blue',
    borderRadius: pTd(6),
  },
  minimumDepositWrap: {
    marginTop: pTd(12),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  minimumDepositText: {
    fontSize: pTd(12),
    color: defaultColors.font19,
  },
  minimumAmountWrap: {},
  minimumAmountText: {
    color: defaultColors.font20,
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
    justifyContent: 'space-between',
  },
  contractAddressLabel: {
    fontSize: pTd(12),
    color: defaultColors.font19,
  },
  contractAddressText: {
    fontSize: pTd(12),
    color: defaultColors.font20,
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
});
