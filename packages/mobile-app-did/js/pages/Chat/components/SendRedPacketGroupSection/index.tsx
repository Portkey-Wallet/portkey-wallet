import React, { useState } from 'react';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import FormItem from 'components/FormItem';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { TextL } from 'components/CommonText';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import TokenOverlay from 'components/TokenOverlay';
import { TokenItemShowType } from '@portkey-wallet/types/types-eoa/token';
import RedPacketAmountShow from '../RedPacketAmountShow';

type ValuesType = {
  packetNum?: string;
  amount?: string;
  symbol?: string;
  decimals?: string;
  memo?: string;
};

type SendRedPacketGroupSectionPropsType = {
  // TODO: change type
  type?: 'p2p' | 'random' | 'fixed';
  value?: ValuesType;
};

export default function SendRedPacketGroupSection(props: SendRedPacketGroupSectionPropsType) {
  const { type, value } = props;
  //   const errorMap = {};
  const token = useDefaultToken();

  const [values, setValues] = useState<ValuesType>(
    value || {
      packetNum: undefined,
      amount: undefined,
      symbol: token.symbol,
      decimals: token.decimals,
      memo: '',
    },
  );

  return (
    <>
      {type !== 'p2p' && (
        <FormItem title="Number of Red Packet">
          <CommonInput
            type="general"
            placeholder="Enter number"
            value={values.packetNum}
            onChangeText={v => setValues(pre => ({ ...pre, packetNum: v }))}
            inputContainerStyle={styles.inputWrap}
          />
        </FormItem>
      )}
      <FormItem title="Total Amount">
        <CommonInput
          type="general"
          value={values.amount}
          placeholder="Enter amount"
          inputContainerStyle={styles.inputWrap}
          rightIcon={
            <Touchable
              style={styles.unitWrap}
              onPress={() => {
                TokenOverlay.showTokenList({
                  onFinishSelectToken: (tokenInfo: TokenItemShowType) => {
                    setValues(pre => ({ ...pre, symbol: tokenInfo.symbol, decimals: String(tokenInfo.decimals) }));
                  },
                });
              }}>
              <Svg size={24} icon="elf-icon" iconStyle={styles.unitIconStyle} />
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{values.symbol}</TextL>
              <Svg size={16} icon="down-arrow" color={defaultColors.icon1} />
            </Touchable>
          }
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          onChangeText={v => setValues(pre => ({ ...pre, amount: v }))}
        />
      </FormItem>
      <FormItem title="Wished">
        <CommonInput
          type="general"
          value={values.memo}
          placeholder="Best Wishes!"
          maxLength={80}
          inputContainerStyle={styles.inputWrap}
          onChangeText={v => setValues(pre => ({ ...pre, memo: v }))}
        />
      </FormItem>
      {/* TODO: change real data */}
      <RedPacketAmountShow
        componentType="sendPacketPage"
        amount="1000000"
        symbol="ELF"
        decimals={8}
        textColor={defaultColors.font5}
      />
      <CommonButton
        disabled
        type="primary"
        title={'Prepare Red Packet'}
        onPress={() => {
          console.log('Prepare Red Packet');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    height: '100%',
    justifyContent: 'space-between',
  },
  inputWrap: {
    backgroundColor: defaultColors.bg1,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainerStyle: {
    height: pTd(64),
  },
  unitWrap: {
    width: pTd(112),
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: defaultColors.border6,
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingLeft: pTd(12),
  },
  unitIconStyle: {
    width: pTd(24),
    height: pTd(24),
    marginRight: pTd(8),
  },
  rateWrap: {
    flexDirection: 'row',
    paddingHorizontal: pTd(8),
  },
  refreshLabel: {
    marginLeft: pTd(4),
    color: defaultColors.font3,
  },
});
