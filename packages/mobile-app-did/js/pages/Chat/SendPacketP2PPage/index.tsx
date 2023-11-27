import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import SendRedPacketGroupSection, { ValuesType } from '../components/SendRedPacketGroupSection';
import { TextM } from 'components/CommonText';
import PaymentOverlay from 'components/PaymentOverlay';
import { usePin } from 'hooks/store';
import { getManagerAccount } from 'utils/redux';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';

const SendPacketP2PPage = () => {
  const [values, setValues] = useState<ValuesType>({
    packetNum: '',
    count: '',
    symbol: 'ELF',
    decimals: '8',
    memo: '',
    chainId: 'AELF',
    tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
  });
  const pin = usePin();
  const wallet = useCurrentWalletInfo();
  const chainInfo = useCurrentChain(values.chainId);

  const onPressBtn = useCallback(async () => {
    try {
      const req = await PaymentOverlay.showRedPacket({
        tokenInfo: {
          symbol: values.symbol,
          decimals: Number(values.decimals),
        },
        amount: values.count,
        chainId: values.chainId,
        calculateTransactionFee: async () => {
          if (!pin) throw new Error('PIN is required');
          const account = getManagerAccount(pin);
          if (!account || !chainInfo) throw new Error('Account is required');
          const contract = await getContractBasic({
            contractAddress: chainInfo.caContractAddress,
            rpcUrl: chainInfo.endPoint,
            account,
          });

          return contract.calculateTransactionFee('ManagerForwardCall', {
            caHash: wallet.caHash,
            contractAddress: values.tokenContractAddress,
            methodName: 'Transfer',
            args: {
              symbol: values.symbol,
              to: '2PfWcs9yhY5xVcJPskxjtAHiKyNUbX7wyWv2NcwFJEg9iNfnPj',
              amount: 1 * 10 ** 8,
              memo: values.memo,
            },
          });
        },
      });
      console.log(req, '====req');
    } catch (error) {
      console.log(error, '====error');
    }
  }, [
    chainInfo,
    pin,
    values.chainId,
    values.count,
    values.decimals,
    values.memo,
    values.symbol,
    values.tokenContractAddress,
    wallet.caHash,
  ]);

  return (
    <PageContainer
      titleDom="Send Red Packet"
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: false }}
      containerStyles={styles.container}>
      <SendRedPacketGroupSection
        type="p2p"
        values={values}
        setValues={v => {
          setValues(v);
        }}
        onPressButton={onPressBtn}
      />
      <View style={GStyles.flex1} />
      <TextM style={styles.tips}>
        Red Packet is valid for 24 hours. Expired Red Packet will be refunded to you within 24 hours after expiration.
      </TextM>
    </PageContainer>
  );
};

export default SendPacketP2PPage;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: defaultColors.bg4,
    minHeight: '100%',
    ...GStyles.paddingArg(24, 20),
  },
  groupNameWrap: {
    height: pTd(72),
    paddingHorizontal: pTd(16),
    marginHorizontal: pTd(20),
    marginVertical: pTd(24),
    borderRadius: pTd(6),
    backgroundColor: defaultColors.bg1,
  },
  selectHeaderWrap: {
    marginTop: pTd(16),
    marginHorizontal: pTd(20),
  },
  inputWrap: {
    paddingTop: pTd(12),
    paddingBottom: pTd(8),
    paddingHorizontal: pTd(20),
  },
  buttonWrap: {
    ...GStyles.paddingArg(10, 20, 16),
    backgroundColor: defaultColors.bg1,
  },
  nameInputStyle: {
    fontSize: pTd(16),
  },
  nameInputContainerStyle: {
    flex: 1,
  },
  nameInputErrorStyle: {
    height: 0,
    padding: 0,
    margin: 0,
  },
  tips: {
    textAlign: 'center',
    color: defaultColors.font3,
  },
});
