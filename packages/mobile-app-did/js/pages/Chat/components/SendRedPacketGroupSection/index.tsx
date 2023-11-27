import React from 'react';
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
import CommonAvatar from 'components/CommonAvatar';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { ChainId } from '@portkey-wallet/types';
import { filterEmoji } from 'utils';

export type ValuesType = {
  packetNum?: string;
  count: string;
  symbol: string;
  decimals: string;
  memo: string;
  chainId: ChainId;
};

export type SendRedPacketGroupSectionPropsType = {
  // TODO: change type
  type?: 'p2p' | 'random' | 'fixed';
  values: ValuesType;
  setValues: (v: ValuesType) => void;
  onPressButton: () => void;
};

export default function SendRedPacketGroupSection(props: SendRedPacketGroupSectionPropsType) {
  const { type, values, setValues, onPressButton } = props;
  //   const errorMap = {};
  const defaultToken = useDefaultToken();
  const symbolImages = useSymbolImages();

  return (
    <>
      {type !== 'p2p' && (
        <FormItem title="Number of Red Packet">
          <CommonInput
            type="general"
            placeholder="Enter number"
            value={values.packetNum}
            onChangeText={v => setValues({ ...values, packetNum: v })}
            inputContainerStyle={styles.inputWrap}
          />
        </FormItem>
      )}
      <FormItem title="Total Amount">
        <CommonInput
          type="general"
          value={values.count}
          placeholder="Enter amount"
          inputContainerStyle={styles.inputWrap}
          rightIcon={
            <Touchable
              style={styles.unitWrap}
              onPress={() => {
                TokenOverlay.showTokenList({
                  onFinishSelectToken: (tokenInfo: TokenItemShowType) => {
                    setValues({ ...values, symbol: tokenInfo.symbol, decimals: String(tokenInfo.decimals) });
                  },
                });
              }}>
              <CommonAvatar
                hasBorder
                style={styles.avatar}
                title={values.symbol}
                avatarSize={pTd(24)}
                // elf token icon is fixed , only use white background color
                svgName={values?.symbol === defaultToken.symbol ? 'testnet' : undefined}
                imageUrl={symbolImages[values.symbol]}
              />
              {/* <Svg size={24} icon="elf-icon" iconStyle={styles.unitIconStyle} /> */}
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{values.symbol}</TextL>
              <Svg size={16} icon="down-arrow" color={defaultColors.icon1} />
            </Touchable>
          }
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          onChangeText={v => setValues({ ...values, count: v })}
        />
      </FormItem>
      <FormItem title="Wished">
        <CommonInput
          type="general"
          value={values.memo}
          placeholder="Best Wishes!"
          maxLength={80}
          inputContainerStyle={styles.inputWrap}
          onChangeText={v => setValues({ ...values, memo: filterEmoji(v) })}
        />
      </FormItem>
      {/* TODO: change real data */}
      <RedPacketAmountShow
        componentType="sendPacketPage"
        amountShow={values.count}
        symbol={values.symbol}
        textColor={defaultColors.font5}
        wrapStyle={GStyles.marginTop(pTd(8))}
      />
      <CommonButton
        // TODO:
        disabled={false}
        type="primary"
        title={'Prepare Red Packet'}
        style={styles.btnStyle}
        onPress={onPressButton}
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
  btnStyle: {
    marginTop: pTd(24),
  },
  avatar: {
    marginRight: pTd(8),
    fontSize: pTd(12),
  },
});
