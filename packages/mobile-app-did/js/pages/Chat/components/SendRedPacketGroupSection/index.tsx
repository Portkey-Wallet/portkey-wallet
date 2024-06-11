import React, { useCallback, useMemo, useRef, useState } from 'react';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { defaultColors } from 'assets/theme';
import { pTd } from 'utils/unit';
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
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import NFTAvatar from 'components/NFTAvatar';
import NewUserOnly from 'pages/CryptoGift/components/NewUserOnly';

export type TInputValue = {
  packetNum?: string;
  count: string;
  memo: string;
};

export type CryptoValuesType = TInputValue & {
  token: ICryptoBoxAssetItemType;
  isNewUserOnly?: boolean;
};

export type SendRedPacketGroupSectionPropsType = {
  type?: RedPackageTypeEnum;
  groupMemberCount?: number;
  isCryptoGift?: boolean;
  onPressButton: (values: CryptoValuesType) => void;
};

const AMOUNT_LABEL_MAP = {
  [RedPackageTypeEnum.P2P]: 'Amount',
  [RedPackageTypeEnum.FIXED]: 'Amount Each',
  [RedPackageTypeEnum.RANDOM]: 'Total Amount',
};

export default function SendRedPacketGroupSection(props: SendRedPacketGroupSectionPropsType) {
  const { type, groupMemberCount, isCryptoGift, onPressButton } = props;
  console.log('wfs=== isCryptoGift', isCryptoGift);
  const { getTokenInfo } = useGetRedPackageConfig();
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();

  const isNewUserOnly = useRef<boolean>(false);

  const defaultToken = useDefaultToken(MAIN_CHAIN_ID);

  const [selectToken, setSelectToken] = useState<ICryptoBoxAssetItemType>({
    ...defaultToken,
    chainId: MAIN_CHAIN_ID,
    assetType: AssetType.ft,
  });
  const [values, setValues] = useState<TInputValue>({
    packetNum: '',
    count: '',
    memo: '',
  });

  const tokenPrice = useMemo<string | number | undefined>(
    () => tokenPriceObject?.[selectToken.symbol],
    [tokenPriceObject, selectToken.symbol],
  );

  const symbolImages = useSymbolImages();
  const onAmountChange = useCallback(
    (value: string) => {
      if (value === '') {
        setValues(pre => ({ ...pre, count: '' }));
        setCountError({ ...INIT_NONE_ERROR });
        return;
      }

      const decimals = Number(selectToken.decimals || 0);
      if (value === '.') {
        if (decimals !== 0) {
          setValues(pre => {
            return { ...pre, count: '0.' };
          });
        }

        setCountError({ ...INIT_NONE_ERROR });
        return;
      }

      if (decimals === 0) {
        if (value === '0') return;
        if (value.split('.').length > 1) return;
      }
      if (value.split('.')[1]?.length > decimals) return;
      if (!isPotentialNumber(value)) return;

      setValues(pre => {
        setCountError({ ...INIT_NONE_ERROR });
        return { ...pre, count: value };
      });
    },
    [selectToken],
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

    if (!selectToken.symbol || selectToken.decimals === '' || values.count === '') return false;

    if (type !== RedPackageTypeEnum.P2P && !values.packetNum) {
      return false;
    }
    return true;
  }, [isGTMax, selectToken.decimals, selectToken.symbol, type, values.count, values.packetNum]);

  const [countError, setCountError] = useState<ErrorType>(INIT_NONE_ERROR);
  const onPreparePress = useCallback(() => {
    const { decimals, chainId, symbol, alias } = selectToken;
    const { packetNum, count } = values;
    let isError = false;

    console.log('onPreparePress', values);

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
          errorMsg: `At least ${divDecimalsStr(minAmount, decimals)} ${alias || symbol} for each crypto box`,
        });
        isError = true;
      }
    }

    if (isError) return;

    onPressButton({
      token: selectToken,
      packetNum: values.packetNum || '1',
      memo: values.memo.trim() || RED_PACKAGE_DEFAULT_MEMO,
      count:
        type === RedPackageTypeEnum.FIXED
          ? ZERO.plus(values.count)
              .times(values.packetNum || 0)
              .toFixed()
          : ZERO.plus(values.count).toFixed(),
      isNewUserOnly: isNewUserOnly.current,
    });
  }, [getTokenInfo, onPressButton, selectToken, type, values]);

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

  const onTokenChange = useCallback((assetInfo: ICryptoBoxAssetItemType) => {
    setSelectToken(pre => {
      if (pre.symbol !== assetInfo.symbol || pre.chainId !== assetInfo.chainId) {
        setValues(preValue => ({
          ...preValue,
          count: '',
        }));
        setCountError({ ...INIT_NONE_ERROR });
      }
      return assetInfo;
    });
  }, []);

  const assetName = useMemo(
    () =>
      selectToken.assetType === AssetType.nft
        ? `${selectToken.alias} #${selectToken.tokenId}` || selectToken.symbol
        : selectToken.symbol,
    [selectToken.alias, selectToken.assetType, selectToken.symbol, selectToken.tokenId],
  );

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
                  onFinishSelectAssets: onTokenChange,
                  currentSymbol: selectToken.symbol,
                  currentChainId: selectToken.chainId,
                });
              }}>
              {selectToken.assetType === AssetType.ft ? (
                <CommonAvatar
                  hasBorder
                  title={selectToken.symbol}
                  shapeType={'circular'}
                  resizeMode={'contain'}
                  titleStyle={styles.avatarTitleStyle}
                  borderStyle={GStyles.hairlineBorder}
                  avatarSize={pTd(24)}
                  // elf token icon is fixed , only use white background color
                  svgName={selectToken?.symbol === defaultToken.symbol ? 'testnet' : undefined}
                  imageUrl={selectToken.imageUrl || symbolImages[selectToken.symbol]}
                />
              ) : (
                <NFTAvatar disabled nftSize={pTd(24)} data={selectToken} style={styles.borderRadius4} />
              )}

              <View style={[styles.assetInfoWrap, GStyles.flex1]}>
                <TextM numberOfLines={1} style={GStyles.flex1}>
                  {assetName}
                </TextM>
                <TextS style={[GStyles.flex1, FontStyles.font3]} numberOfLines={1}>
                  {formatChainInfoToShow(selectToken.chainId)}
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
      {isCryptoGift && (
        <NewUserOnly
          onSwitchChanged={selected => {
            console.log('wfs=== NewUserOnly', selected);
            isNewUserOnly.current = selected;
          }}
        />
      )}
      {selectToken.assetType === AssetType.nft ? (
        <>
          <RedPacketAmountShow
            componentType="sendPacketPage"
            amountShow={amountShowStr}
            textColor={defaultColors.font5}
            wrapStyle={GStyles.marginTop(pTd(8))}
            assetType={selectToken.assetType}
          />
          <View style={[GStyles.flexRow, GStyles.center, styles.nftInfoWrap]}>
            <NFTAvatar disabled nftSize={pTd(24)} data={selectToken} style={styles.borderRadius4} />
            <TextM numberOfLines={1} style={styles.nftNameWrap}>
              {assetName}
            </TextM>
          </View>
        </>
      ) : (
        <RedPacketAmountShow
          componentType="sendPacketPage"
          amountShow={amountShowStr}
          symbol={selectToken.symbol}
          textColor={defaultColors.font5}
          wrapStyle={GStyles.marginTop(pTd(8))}
        />
      )}

      <CommonButton
        disabled={!isAllowPrepare}
        type="primary"
        title={isCryptoGift ? 'Send Crypto Gift' : 'Send Crypto Box'}
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
    borderColor: defaultColors.neutralBorder,
    borderWidth: 0.5,
    borderBottomWidth: 0.5,
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
  avatarTitleStyle: {
    fontSize: pTd(12),
    color: defaultColors.font11,
  },
  borderRadius4: {
    borderRadius: pTd(4),
  },
  assetInfoWrap: {
    marginLeft: pTd(8),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  nftInfoWrap: {
    marginTop: pTd(4),
  },
  nftNameWrap: {
    marginLeft: pTd(8),
    maxWidth: pTd(250),
  },
});
