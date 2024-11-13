import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GStyles from 'assets/theme/GStyles';
import { StyleSheet, View } from 'react-native';
import { useCurrencyBalancesV2 } from 'hooks/awaken';
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
import {
  convertAmountUSDShow,
  divDecimals,
  divDecimalsStr,
  formatAmountShow,
  timesDecimals,
} from '@portkey-wallet/utils/converter';
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
import { makeStyles, useTheme } from '@rneui/themed';
import AmountCard from 'components/AmountCard';
import { useAsync } from 'react-use';
import { networkList } from 'constants/common';
import { SourceDestinationItem } from 'pages/Receive/components/SourceDestinationPicker';
import ModeChangeSelector from 'pages/DashBoard/componets/ModeChangeSelector';
import { useCurrentNetwork as useCurrentNetworkType } from '@portkey-wallet/hooks/hooks-ca/network';
import { IAccountCryptoBoxAssetItem } from '@portkey-wallet/types/types-ca/token';
import { useAccountCryptoBoxAssetList } from '@portkey-wallet/hooks/hooks-ca/balances';
import { merge } from 'lodash';
import { useUpdateAssetInfo } from 'hooks/useGetSymbolBalance';
import Bignumber from 'bignumber.js';
import { useCalculateRedPacketFee } from '../../../../hooks/useCalculateRedPacketFee';

export type TInputValue = {
  packetNum?: string;
  count: string;
  memo: string;
};

export type CryptoValuesType = TInputValue & {
  token: ICryptoBoxAssetItemType;
  isNewUserOnly?: boolean;
  balance: string;
  amountShowStr: string;
  amountUsdShowStr: string;
  tokenPrice?: string | number;
};

export type TCryptoBoxAssetItem = ICryptoBoxAssetItemType & {
  chainImageUrl?: string;
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
  const styles = getStyles();
  const { theme } = useTheme();
  // chain
  const [destinationChain, setDestinationChain] = useState(networkList[0]);
  const currentNetworkType = useCurrentNetworkType();
  const destinationChainId = useMemo(() => {
    return destinationChain.key === 'aelf dAppChain' ? (currentNetworkType === 'MAINNET' ? 'tDVV' : 'tDVW') : 'AELF';
  }, [destinationChain, currentNetworkType]);

  const { type, groupMemberCount, onPressButton } = props;
  // token
  const { getTokenInfo } = useGetRedPackageConfig();
  const [tokenPriceObject] = useGetCurrentAccountTokenPrice();
  const isNewUserOnly = useRef<boolean>(true);
  const defaultToken = useDefaultToken(MAIN_CHAIN_ID);
  const [selectToken, setSelectToken] = useState<TCryptoBoxAssetItem>({
    ...defaultToken,
    chainId: destinationChainId,
    assetType: AssetType.ft,
    chainImageUrl: destinationChain.imageUrl,
  });
  useEffect(() => {
    setSelectToken(prev => {
      return { ...prev, chainId: destinationChainId, chainImageUrl: destinationChain.imageUrl };
    });
  }, [destinationChain, destinationChainId]);
  // values
  const [values, setValues] = useState<TInputValue>({
    packetNum: '',
    count: '',
    memo: '',
  });

  // balance
  const accountAssetList = useAccountCryptoBoxAssetList();
  const [assetMap] = useMemo(() => {
    const currentSymbolList: IAccountCryptoBoxAssetItem[] = [];
    const map: { [key: string]: IAccountCryptoBoxAssetItem } = accountAssetList.reduce((acc, item) => {
      if (item?.symbol === selectToken?.symbol) {
        currentSymbolList.push(item);
        return merge(acc, { [item?.chainId]: item });
      }
      return acc;
    }, {});
    return [map];
  }, [accountAssetList, selectToken?.symbol]);
  const currentAssetInfo: IAccountCryptoBoxAssetItem | undefined = useMemo(() => {
    if (assetMap?.[destinationChainId]) return assetMap?.[destinationChainId];
    return accountAssetList.find(ele => ele.symbol === selectToken.symbol);
  }, [accountAssetList, selectToken.symbol, assetMap, destinationChainId]);
  const updateAssetInfo = useUpdateAssetInfo(destinationChainId, selectToken, currentAssetInfo);

  // fee
  const calculateRedPacketFee = useCalculateRedPacketFee();
  const gasFee = useAsync(async () => {
    const fee = calculateRedPacketFee({
      symbol: selectToken.symbol,
      chainId: selectToken.chainId,
      decimals: selectToken.decimals,
      count: values.count,
    });
    return fee;
  }, [calculateRedPacketFee, selectToken.symbol, selectToken.chainId, selectToken.decimals]);

  // token price
  const tokenPrice = useMemo<string | number | undefined>(
    () => tokenPriceObject?.[selectToken.symbol],
    [tokenPriceObject, selectToken.symbol],
  );
  const amountUsd = useMemo(() => {
    return `$${ZERO.plus(values.count.trim() || 0)
      .times(tokenPrice || 0)
      .dp(2)
      .toFixed()}`;
  }, [values, tokenPrice]);
  const amountShowStr = useMemo(() => {
    if (type !== RedPackageTypeEnum.FIXED) return formatAmountShow(values.count);
    if (values.packetNum === '' || values.packetNum === undefined || values.count === '' || values.count === undefined)
      return '';
    if (ZERO.plus(values.packetNum).isNaN() || ZERO.plus(values.count).isNaN()) return '';
    return ZERO.plus(formatAmountShow(values.count))
      .times(values.packetNum || '1')
      .toFixed();
  }, [type, values.count, values.packetNum]);
  const amountUsdShowStr = useMemo(() => {
    return `$${ZERO.plus(values.count || 0)
      .times(tokenPrice || 0)
      .dp(2)
      .toFixed(2)}`;
  }, [tokenPrice, values.count]);

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

  // insufficient balance
  const isInsufficientBalance = useMemo(() => {
    const balance = updateAssetInfo?.balance || 0;
    const fee = gasFee.value || 0;
    const _valueBN = ZERO.plus(balance).minus(fee);
    const v = divDecimals(_valueBN, selectToken.decimals);
    return v.lte(values.count);
  }, [updateAssetInfo?.balance, gasFee.value, selectToken.decimals, values.count]);

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

  // press btn
  const [countError, setCountError] = useState<ErrorType>(INIT_NONE_ERROR);

  const onPreparePress = useCallback(() => {
    const { decimals, chainId, symbol, alias } = selectToken;
    const { packetNum, count } = values;
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
          errorMsg: `At least ${divDecimalsStr(minAmount, decimals)} ${alias || symbol} for each crypto box`,
        });
        isError = true;
      }
    }
    if (isError) return;
    // press cb
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
      balance: updateAssetInfo?.balance || '0',
      amountShowStr,
      amountUsdShowStr,
      tokenPrice,
    });
  }, [
    amountShowStr,
    amountUsdShowStr,
    getTokenInfo,
    onPressButton,
    selectToken,
    tokenPrice,
    type,
    updateAssetInfo?.balance,
    values,
  ]);

  const amountLabel = useMemo(() => AMOUNT_LABEL_MAP[type || RedPackageTypeEnum.P2P], [type]);

  const onMemoChange = useCallback((_value: string) => {
    if (isEmojiString(_value)) return;
    setValues(pre => ({ ...pre, memo: _value }));
  }, []);

  const onTokenChange = useCallback((token: TCryptoBoxAssetItem) => {
    setSelectToken(pre => {
      if (pre.symbol !== token.symbol || pre.chainId !== token.chainId) {
        setValues(preValue => ({
          ...preValue,
          count: '',
        }));
        setCountError({ ...INIT_NONE_ERROR });
      }
      return token;
    });
  }, []);

  const showDestinationList = useCallback(() => {
    ModeChangeSelector.showList({
      list: networkList,
      selectedIndex: destinationChain.key,
      iconSize: 20,
      isShowRightCloseIcon: true,
      title: 'Network',
      onSelected: (_item, key) => {
        const currentSourceChain = networkList.find(item => item.key === key);
        currentSourceChain && setDestinationChain(currentSourceChain);
      },
    });
  }, [destinationChain]);

  return (
    <>
      {type !== RedPackageTypeEnum.P2P && (
        <FormItem title="Number of gifts" titleStyle={{ fontSize: pTd(16) }}>
          <CommonInput
            type="general"
            placeholder="Enter number of gifts"
            keyboardType="decimal-pad"
            value={values.packetNum}
            onChangeText={onPacketNumChange}
            inputContainerStyle={styles.inputWrap}
            maxLength={5}
            errorMessage={packetNumTips}
            errorStyle={!isGTMax && FontStyles.font7}
            inputStyle={isGTMax && FontStyles.error}
            containerStyle={packetNumTips ? styles.packetQuantityWrapError : styles.packetQuantityWrap}
          />
        </FormItem>
      )}
      <FormItem title={amountLabel} titleStyle={{ fontSize: pTd(16) }}>
        <SourceDestinationItem
          icon={destinationChain.imageUrl}
          chainName={destinationChain.name}
          onPress={showDestinationList}
          containerStyles={styles.selectContainerStyles}
        />
        <AmountCard
          amount={values.count}
          onAmountChange={onAmountChange}
          balance={updateAssetInfo?.balance}
          amountUsd={amountUsd}
          token={selectToken as any}
          isMaxShow={true}
          gasFee={gasFee.value}
          onShowCryptoAssetList={() => {
            CryptoAssetsListOverlay.showCryptoAssetList({
              onFinishSelectAssets: onTokenChange,
              currentSymbol: selectToken.symbol,
              currentChainId: destinationChainId,
              accountAssetList: accountAssetList,
            });
          }}
          isError={isInsufficientBalance}
          errorMessage={countError.isError ? countError.errorMsg : ''}
        />
      </FormItem>
      <FormItem title="Gift message" style={{ marginTop: pTd(16) }} titleStyle={{ fontSize: pTd(16) }}>
        <CommonInput
          type="general"
          value={values.memo}
          placeholder={RED_PACKAGE_DEFAULT_MEMO}
          maxLength={80}
          inputContainerStyle={styles.inputWrap}
          onChangeText={onMemoChange}
          containerStyle={styles.packetNumWrap}
        />
      </FormItem>
      <NewUserOnly
        onSwitchChanged={selected => {
          isNewUserOnly.current = selected;
        }}
        containerStyle={{ marginBottom: pTd(16) }}
      />

      <RedPacketAmountShow
        componentType="sendPacketPage"
        amountShow={amountShowStr}
        amountUsdShowStr={amountUsdShowStr}
        symbol={selectToken.symbol}
        wrapStyle={GStyles.marginTop(pTd(8))}
        usdWrapStyle={GStyles.marginTop(pTd(8))}
        usdTextColor={theme.colors.textBase2}
      />

      <CommonButton
        disabled={!isAllowPrepare || isInsufficientBalance}
        type="primary"
        title={isInsufficientBalance ? 'Insufficient ELF balance' : 'Preview'}
        containerStyle={styles.btnStyle}
        onPress={onPreparePress}
      />
    </>
  );
}

const getStyles = makeStyles(theme => ({
  formContainer: {
    height: '100%',
    justifyContent: 'space-between',
  },
  inputWrap: {
    backgroundColor: theme.colors.bgBase1,
    borderColor: theme.colors.textBase3,
    borderWidth: 0.5,
    borderBottomWidth: 0.5,
  },
  packetQuantityWrapError: {
    marginBottom: pTd(40),
  },
  packetQuantityWrap: {
    marginBottom: pTd(16),
  },
  selectContainerStyles: {
    flex: 0,
    borderWidth: pTd(1),
    height: pTd(40),
    borderColor: theme.colors.textBase3,
    borderRadius: pTd(8),
    marginBottom: pTd(16),
  },
  packetNumWrap: {
    height: pTd(52),
  },
  amountTipsGap: {
    marginBottom: pTd(8),
  },
  unitWrap: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
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
  tokenWrap: {
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
}));
