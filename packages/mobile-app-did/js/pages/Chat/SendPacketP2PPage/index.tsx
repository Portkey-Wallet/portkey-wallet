import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PageContainer from 'components/PageContainer';
import { defaultColors } from 'assets/theme';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import SendRedPacketGroupSection, { ValuesType } from '../components/SendRedPacketGroupSection';
import { TextM } from 'components/CommonText';
import { RedPackageTypeEnum } from '@portkey-wallet/im';

const SendPacketP2PPage = () => {
  const [values, setValues] = useState<ValuesType>({
    packetNum: '',
    count: '',
    symbol: 'ELF',
    decimals: '',
    memo: '',
  });

  return (
    <PageContainer
      titleDom="Send Red Packet"
      hideTouchable
      safeAreaColor={['blue', 'gray']}
      scrollViewProps={{ disabled: false }}
      containerStyles={styles.container}>
      <SendRedPacketGroupSection
        type={RedPackageTypeEnum.P2P}
        values={values}
        setValues={v => {
          setValues(v);
        }}
        onPressButton={() => console.log('hi')}
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
