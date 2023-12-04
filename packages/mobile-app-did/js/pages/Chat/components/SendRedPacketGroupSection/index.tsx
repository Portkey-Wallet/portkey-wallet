import React, { useCallback, useMemo, useState } from 'react';
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
import { RedPackageTypeEnum } from '@portkey-wallet/im';
import { ChainId } from '@portkey-wallet/types';
import { ErrorType } from 'types/common';
import { INIT_NONE_ERROR } from 'constants/common';
import { useGetRedPackageConfig } from '@portkey-wallet/hooks/hooks-ca/im';
import { ZERO } from '@portkey-wallet/constants/misc';
import { convertAmountUSDShow, divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { RED_PACKAGE_DEFAULT_MEMO } from '@portkey-wallet/constants/constants-ca/im';
import { FontStyles } from 'assets/theme/styles';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { isEmojiString } from 'pages/Chat/utils';

export type ValuesType = {
  packetNum?: string;
  count: string;
  symbol: string;
  decimals: string;
  memo: string;
  chainId: ChainId;
};

export type SendRedPacketGroupSectionPropsType = {
  type?: RedPackageTypeEnum;
  // TODO: change type
  groupMemberCount?: number;
  onPressButton: (values: ValuesType) => void;
};

export default function SendRedPacketGroupSection(props: SendRedPacketGroupSectionPropsType) {
  const { type, groupMemberCount, onPressButton } = props;
  const { getTokenInfo } = useGetRedPackageConfig();
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();

  const defaultToken = useDefaultToken(MAIN_CHAIN_ID);
  const [values, setValues] = useState<ValuesType>({
    packetNum: '',
    count: '',
    symbol: defaultToken.symbol,
    decimals: defaultToken.decimals,
    memo: '',
    chainId: MAIN_CHAIN_ID,
  });

  const tokenPrice = useMemo<string | number | undefined>(
    () => tokenPriceObject?.[values.symbol],
    [tokenPriceObject, values.symbol],
  );

  const symbolImages = useSymbolImages();
  const onAmountChange = useCallback(
    (value: string) => {
      const reg = /^(0|[1-9]\d*)(\.\d*)?$/;
      if (value === '') {
        setValues(pre => ({ ...pre, count: '' }));
        setCountError({ isError: false, errorMsg: '' });
        return;
      }
      if (value === '.') {
        setValues(pre => ({ ...pre, count: '0.' }));
        setCountError({ isError: false, errorMsg: '' });
        return;
      }

      setValues(pre => {
        const decimals = Number(pre.decimals || 0);
        if (decimals === 0 && value.split('.').length > 1) return pre;
        if (value.split('.')[1]?.length > Number(decimals)) return pre;
        if (!reg.test(value)) return pre;
        setCountError({ isError: false, errorMsg: '' });
        return { ...pre, count: value };
      });
    },
    [setValues],
  );

  const onPacketNumChange = useCallback(
    (value: string) => {
      if (value === '') {
        setValues(pre => ({ ...pre, packetNum: '' }));
        if (type === RedPackageTypeEnum.RANDOM) {
          setCountError({ isError: false, errorMsg: '' });
        }
        return;
      }

      const reg = /^[1-9]\d*$/;
      if (!reg.test(value)) return;
      if (Number(value) > 1000) return;
      if (type === RedPackageTypeEnum.RANDOM) {
        setCountError({ isError: false, errorMsg: '' });
      }
      setValues(pre => ({ ...pre, packetNum: value }));
    },
    [type],
  );

  const isAllowPrepare = useMemo(() => {
    if (!values.symbol || values.decimals === '' || values.count === '') return false;

    if (type !== RedPackageTypeEnum.P2P && !values.packetNum) {
      return false;
    }
    return true;
  }, [type, values.count, values.decimals, values.packetNum, values.symbol]);

  const [countError, setCountError] = useState<ErrorType>(INIT_NONE_ERROR);
  const onPreparePress = useCallback(() => {
    const { packetNum, count, decimals, chainId, symbol } = values;
    let isError = false;

    const amount = timesDecimals(count, decimals);
    const tokenConfig = getTokenInfo(chainId, symbol);
    const minAmount = tokenConfig?.minAmount || '1';

    if (type !== RedPackageTypeEnum.RANDOM) {
      if (amount.lt(minAmount)) {
        // TODO: adjust error msg
        setCountError({ isError: true, errorMsg: 'The amount is too small' });
        isError = true;
      }
    } else {
      const eachMinAmount = ZERO.plus(minAmount);
      const totalMinAmount = eachMinAmount.times(packetNum || '1');
      if (amount.lt(totalMinAmount)) {
        // TODO: adjust error msg
        setCountError({
          isError: true,
          errorMsg: `At least ${divDecimalsStr(minAmount, decimals || 1)} ${symbol} for each crypto box`,
        });
        isError = true;
      }
    }

    if (isError) return;
    onPressButton({
      ...values,
      packetNum: values.packetNum || '1',
      memo: values.memo.trim() || RED_PACKAGE_DEFAULT_MEMO,
      count:
        type === RedPackageTypeEnum.FIXED
          ? ZERO.plus(values.count)
              .times(values.packetNum || 0)
              .toFixed()
          : ZERO.plus(values.count).toFixed(),
    });
  }, [getTokenInfo, onPressButton, type, values]);

  const amountLabel = useMemo(() => (type === RedPackageTypeEnum.FIXED ? 'Amount Each' : 'Total Amount'), [type]);

  const amountShowStr = useMemo(() => {
    if (type !== RedPackageTypeEnum.FIXED) return values.count;
    if (values.packetNum === '' || values.count === '') return '';
    if (Number.isNaN(values.packetNum) || Number.isNaN(values.count)) return '';
    return ZERO.plus(values.count)
      .times(values.packetNum || '1')
      .toFixed();
  }, [type, values.count, values.packetNum]);

  const tokenPriceStr = useMemo(() => {
    if (!tokenPrice) return '';
    return convertAmountUSDShow(values.count, tokenPrice);
  }, [tokenPrice, values.count]);

  const onMemoChange = useCallback((_value: string) => {
    if (isEmojiString(_value)) return;
    setValues(pre => ({ ...pre, memo: _value }));
  }, []);

  return (
    <>
      {type !== RedPackageTypeEnum.P2P && (
        <FormItem title="Quantity of Crypto Box(es)">
          <CommonInput
            type="general"
            placeholder="Enter quantity"
            keyboardType="decimal-pad"
            value={values.packetNum}
            onChangeText={onPacketNumChange}
            inputContainerStyle={styles.inputWrap}
            errorMessage={groupMemberCount ? `${groupMemberCount} group members` : ''}
            errorStyle={FontStyles.font7}
            containerStyle={styles.packetNumWrap}
          />
        </FormItem>
      )}
      <FormItem title={amountLabel}>
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
                    setValues(pre => ({
                      ...pre,
                      count: pre.symbol !== tokenInfo.symbol || pre.chainId !== tokenInfo.chainId ? '' : pre.count,
                      symbol: tokenInfo.symbol,
                      decimals: String(tokenInfo.decimals),
                      chainId: tokenInfo.chainId,
                    }));
                  },
                  currentSymbol: values.symbol,
                  currentChainId: values.chainId,
                });
              }}>
              <CommonAvatar
                hasBorder
                resizeMode="cover"
                style={styles.avatar}
                title={values.symbol}
                avatarSize={pTd(24)}
                // elf token icon is fixed , only use white background color
                svgName={values?.symbol === defaultToken.symbol ? 'testnet' : undefined}
                imageUrl={symbolImages[values.symbol]}
              />
              <TextL style={[GStyles.flex1, fonts.mediumFont]}>{values.symbol}</TextL>
              <Svg size={16} icon="down-arrow" color={defaultColors.icon1} />
            </Touchable>
          }
          maxLength={30}
          autoCorrect={false}
          keyboardType="decimal-pad"
          onChangeText={onAmountChange}
          errorStyle={!countError.isError && FontStyles.font7}
          errorMessage={countError.isError ? countError.errorMsg : tokenPriceStr}
          containerStyle={(countError.isError || !!tokenPriceStr) && styles.amountTipsGap}
        />
      </FormItem>
      <FormItem title="Wishes">
        <CommonInput
          type="general"
          value={values.memo}
          placeholder={RED_PACKAGE_DEFAULT_MEMO}
          maxLength={80}
          inputContainerStyle={styles.inputWrap}
          onChangeText={onMemoChange}
        />
      </FormItem>
      <RedPacketAmountShow
        componentType="sendPacketPage"
        amountShow={amountShowStr}
        symbol={values.symbol}
        textColor={defaultColors.font5}
        wrapStyle={GStyles.marginTop(pTd(8))}
      />
      <CommonButton
        disabled={!isAllowPrepare}
        type="primary"
        title={'Send Crypto Box'}
        containerStyle={styles.btnStyle}
        onPress={onPreparePress}
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
  packetNumWrap: {
    marginBottom: pTd(8),
  },
  amountTipsGap: {
    marginBottom: pTd(8),
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
