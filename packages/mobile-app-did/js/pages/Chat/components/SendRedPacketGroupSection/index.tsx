import React, { useCallback, useMemo, useState } from 'react';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
import fonts from 'assets/theme/fonts';
import FormItem from 'components/FormItem';
import CommonInput from 'components/CommonInput';
import CommonButton from 'components/CommonButton';
import { TextM, TextS } from 'components/CommonText';
import Svg from 'components/Svg';
import Touchable from 'components/Touchable';
import { useDefaultToken } from '@portkey-wallet/hooks/hooks-ca/chainList';
import RedPacketAmountShow from '../RedPacketAmountShow';
import CommonAvatar from 'components/CommonAvatar';
import { useSymbolImages } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { RedPackageTypeEnum } from '@portkey-wallet/im';
import { ChainId } from '@portkey-wallet/types';
import { INIT_NONE_ERROR, ErrorType } from '@portkey-wallet/constants/constants-ca/common';
import { useGetRedPackageConfig } from '@portkey-wallet/hooks/hooks-ca/im';
import { ZERO } from '@portkey-wallet/constants/misc';
import { convertAmountUSDShow, divDecimalsStr, timesDecimals } from '@portkey-wallet/utils/converter';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { RED_PACKAGE_DEFAULT_MEMO } from '@portkey-wallet/constants/constants-ca/im';
import { FontStyles } from 'assets/theme/styles';
import { useGetCurrentAccountTokenPrice } from '@portkey-wallet/hooks/hooks-ca/useTokensPrice';
import { isEmojiString } from 'pages/Chat/utils';
import { isPotentialNumber } from '@portkey-wallet/utils/reg';
import { formatChainInfoToShow } from '@portkey-wallet/utils';
import CryptoAssetsListOverlay from '../CryptoAssetsListOverlay';
import { AssetType } from '@portkey-wallet/constants/constants-ca/assets';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/store/store-ca/assets/type';

export type ValuesType = {
  packetNum?: string;
  count: string;
  symbol: string;
  decimals: string | number;
  memo: string;
  chainId: ChainId;
  assetType?: AssetType;
  alias?: string;
  tokenId?: string;
  imageUrl?: string;
};

export type SendRedPacketGroupSectionPropsType = {
  type?: RedPackageTypeEnum;
  groupMemberCount?: number;
  onPressButton: (values: ValuesType) => void;
};

const AMOUNT_LABEL_MAP = {
  [RedPackageTypeEnum.P2P]: 'Amount',
  [RedPackageTypeEnum.FIXED]: 'Amount Each',
  [RedPackageTypeEnum.RANDOM]: 'Total Amount',
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
    assetType: AssetType.ft,
  });

  const tokenPrice = useMemo<string | number | undefined>(
    () => tokenPriceObject?.[values.symbol],
    [tokenPriceObject, values.symbol],
  );

  const symbolImages = useSymbolImages();
  const onAmountChange = useCallback(
    (value: string) => {
      if (value === '') {
        setValues(pre => ({ ...pre, count: '' }));
        setCountError({ ...INIT_NONE_ERROR });
        return;
      }
      if (value === '.') {
        setValues(pre => ({ ...pre, count: '0.' }));
        setCountError({ ...INIT_NONE_ERROR });
        return;
      }

      setValues(pre => {
        const decimals = Number(pre.decimals || 0);
        if (decimals === 0 && value.split('.').length > 1) return pre;
        if (value.split('.')[1]?.length > Number(decimals)) return pre;
        if (!isPotentialNumber(value)) return pre;
        setCountError({ ...INIT_NONE_ERROR });
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
          setCountError({ ...INIT_NONE_ERROR });
        }
        return;
      }

      const reg = /^[1-9]\d*$/;
      if (!reg.test(value)) return;
      if (type === RedPackageTypeEnum.RANDOM) {
        setCountError({ ...INIT_NONE_ERROR });
      }
      setValues(pre => ({ ...pre, packetNum: value }));
    },
    [type],
  );

  const isGTMax = useMemo(() => {
    if (type === RedPackageTypeEnum.P2P) return false;
    return ZERO.plus(values.packetNum ?? 0).gt(1000);
  }, [type, values.packetNum]);

  const packetNumTips = useMemo(() => {
    if (isGTMax) return `The maximum quantity is limited to 1,000.`;
    return groupMemberCount ? `${groupMemberCount} group members` : '';
  }, [groupMemberCount, isGTMax]);

  const isAllowPrepare = useMemo(() => {
    if (isGTMax) return false;

    if (!values.symbol || values.decimals === '' || values.count === '') return false;

    if (type !== RedPackageTypeEnum.P2P && !values.packetNum) {
      return false;
    }
    return true;
  }, [isGTMax, type, values.count, values.decimals, values.packetNum, values.symbol]);

  const [countError, setCountError] = useState<ErrorType>(INIT_NONE_ERROR);
  const onPreparePress = useCallback(() => {
    const { packetNum, count, decimals, chainId, symbol } = values;
    let isError = false;

    const amount = timesDecimals(count, decimals);
    const tokenConfig = getTokenInfo(chainId, symbol);
    const minAmount = tokenConfig?.minAmount || '1';

    if (type !== RedPackageTypeEnum.RANDOM) {
      if (amount.lt(minAmount)) {
        setCountError({
          isError: true,
          errorMsg: `At least ${divDecimalsStr(minAmount, decimals || 1)} ${symbol} for each crypto box`,
        });
        isError = true;
      }
    } else {
      const eachMinAmount = ZERO.plus(minAmount);
      const totalMinAmount = eachMinAmount.times(packetNum || '1');
      if (amount.lt(totalMinAmount)) {
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

  const amountLabel = useMemo(() => AMOUNT_LABEL_MAP[type || RedPackageTypeEnum.P2P], [type]);

  const amountShowStr = useMemo(() => {
    if (type !== RedPackageTypeEnum.FIXED) return values.count;
    if (values.packetNum === '' || values.packetNum === undefined || values.count === '' || values.count === undefined)
      return '';
    if (ZERO.plus(values.packetNum).isNaN() || ZERO.plus(values.count).isNaN()) return '';
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
            maxLength={5}
            errorMessage={packetNumTips}
            errorStyle={!isGTMax && FontStyles.font7}
            inputStyle={isGTMax && FontStyles.error}
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
                CryptoAssetsListOverlay.showCryptoAssetList({
                  onFinishSelectAssets: (assetInfo: ICryptoBoxAssetItemType) => {
                    setValues(pre => ({
                      ...pre,
                      ...assetInfo,
                      count: pre.symbol !== assetInfo.symbol || pre.chainId !== assetInfo.chainId ? '' : pre.count,
                    }));
                    setCountError({ ...INIT_NONE_ERROR });
                  },
                  currentSymbol: values.symbol,
                  currentChainId: values.chainId,
                });
              }}>
              <CommonAvatar
                hasBorder
                shapeType={values.assetType === AssetType.nft ? 'square' : 'circular'}
                resizeMode={'contain'}
                style={[styles.avatar, values.assetType === AssetType.nft && styles.borderRadius4]}
                title={values.symbol}
                avatarSize={pTd(24)}
                // elf token icon is fixed , only use white background color
                svgName={values?.symbol === defaultToken.symbol ? 'testnet' : undefined}
                imageUrl={values.imageUrl || symbolImages[values.symbol]}
              />
              <View style={[styles.assetInfoWrap, GStyles.flex1]}>
                <TextM style={[GStyles.flex1, fonts.mediumFont]}>
                  {values.assetType === AssetType.nft
                    ? `${values.alias} #${values.tokenId}` || values.symbol
                    : values.symbol}
                </TextM>
                <TextS style={[GStyles.flex1, FontStyles.font3]} numberOfLines={1}>
                  {formatChainInfoToShow(values.chainId)}
                </TextS>
              </View>
              <Svg size={pTd(16)} icon="down-arrow" color={defaultColors.icon1} />
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
    width: pTd(156),
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: defaultColors.border6,
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingLeft: pTd(12),
    height: pTd(38),
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
    fontSize: pTd(12),
  },
  borderRadius4: {
    borderRadius: pTd(4),
  },
  assetInfoWrap: {
    marginLeft: pTd(8),
  },
});
