import React, { memo, useCallback, useMemo, useState } from 'react';
import PageContainer from 'components/PageContainer';
import Svg from 'components/Svg';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { TextL, TextM } from 'components/CommonText';
import { View } from 'react-native';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import fonts from 'assets/theme/fonts';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { CryptoValuesType } from '../components/SendRedPacketGroupSection';
import { divDecimals, timesDecimals } from '@portkey-wallet/utils/converter';
import BigNumber from 'bignumber.js';
import CommonAvatar from 'components/CommonAvatar';
import { networkList } from '../../../constants/common';
import { chainShowText, checkIsUserCancel } from '@portkey-wallet/utils';
import { useGetCryptoGiftConfig, useSendCryptoGift } from '@portkey-wallet/hooks/hooks-ca/cryptogift';
import { useGetCAContract } from 'hooks/contract';
import { useCheckAllowanceAndApprove } from 'hooks/wallet';
import CommonToast from 'components/CommonToast';
import Loading from '../../../components/Loading';
import { GroupRedPacketTabEnum } from '../types';
import { RedPackageTypeEnum } from '@portkey-wallet/im';
import { reportSendCryptoGiftSuccess } from '../../../utils/analysisiReport';
import { useAccountCryptoBoxAssetList } from '@portkey-wallet/hooks/hooks-ca/balances';
import { IAccountCryptoBoxAssetItem } from '@portkey-wallet/types/types-ca/token';
import { merge } from 'lodash';
import { useUpdateAssetInfo } from '../../../hooks/useGetSymbolBalance';
import CommonTooltip from '../../../components/CommonTooltip';

interface IPreviewProps {
  assetInfo: ICryptoBoxAssetItemType;
  amount: string;
  fee: string;
  values: CryptoValuesType;
  selectTab: GroupRedPacketTabEnum;
}
const Preview: React.FC = () => {
  const styles = getStyles();
  const { t } = useLanguage();
  const { assetInfo, values, selectTab } = useRouterParams<IPreviewProps>();
  const { amountShowStr, amountUsdShowStr, tokenPrice, token } = values;
  const [balance, setBalance] = useState<string | number>(values.balance);
  const [isLgBalance, setIsLgBalance] = useState<boolean>(true);
  const { symbol, decimals, chainId } = assetInfo;
  const showStr = (bnvalue: BigNumber.Value) => {
    return divDecimals(bnvalue, decimals).toFixed(2);
  };
  const showUsdStr = (bnvalue: BigNumber.Value) => {
    return `$${divDecimals(bnvalue, decimals)
      .times(tokenPrice || 0)
      .dp(2)
      .toFixed(2)}`;
  };
  const chainName = useMemo(() => {
    return `aelf ${chainShowText(chainId)}`;
  }, [chainId]);
  const imgUrl = useMemo(() => {
    return networkList.find(item => item.name === chainName)?.imageUrl;
  }, [chainName]);

  // balance
  const accountAssetList = useAccountCryptoBoxAssetList();
  const [assetMap] = useMemo(() => {
    const currentSymbolList: IAccountCryptoBoxAssetItem[] = [];
    const map: { [key: string]: IAccountCryptoBoxAssetItem } = accountAssetList.reduce((acc, item) => {
      if (item?.symbol === symbol) {
        currentSymbolList.push(item);
        return merge(acc, { [item?.chainId]: item });
      }
      return acc;
    }, {});
    return [map];
  }, [accountAssetList, symbol]);
  const currentAssetInfo: IAccountCryptoBoxAssetItem | undefined = useMemo(() => {
    if (assetMap?.[chainId]) {
      return assetMap?.[chainId];
    }
    return accountAssetList.find(ele => ele.symbol === symbol);
  }, [accountAssetList, symbol, assetMap, chainId]);
  const updateAssetInfo = useUpdateAssetInfo(chainId, token, currentAssetInfo);

  const checkBalance = useCallback(() => {
    return new BigNumber(values.count).lt(new BigNumber(updateAssetInfo?.balance || 0));
  }, [updateAssetInfo?.balance, values.count]);

  // click confirm btn
  const { getCryptoGiftContractAddress } = useGetCryptoGiftConfig();
  const getCAContract = useGetCAContract();
  const checkAllowanceAndApprove = useCheckAllowanceAndApprove();
  const sendCryptoGift = useSendCryptoGift();
  const onConfirm = useCallback(async () => {
    Loading.show();
    // check if count < balance
    setIsLgBalance(checkBalance());
    if (!isLgBalance) {
      setBalance(updateAssetInfo?.balance || 0);
      return;
    }
    let caContract, totalAmount;
    try {
      const redPacketContractAddress = getCryptoGiftContractAddress(token.chainId);
      if (!redPacketContractAddress) {
        throw new Error('redPacketContractAddress is not exist');
      }
      caContract = await getCAContract(token.chainId);
      totalAmount = timesDecimals(values.count, decimals);
      await checkAllowanceAndApprove({
        caContract,
        spender: redPacketContractAddress,
        bigAmount: totalAmount,
        symbol: token.symbol,
        chainId: token.chainId,
        decimals: Number(token.decimals),
        isShowOnceLoading: true,
        alias: token.alias,
      });
    } catch (error) {
      console.log(error, 'send check ====error');
      if (!checkIsUserCancel(error)) {
        CommonToast.failError('Crypto box failed to be sent. Please try again.');
      }
      Loading.hide();
      return;
    }
    Loading.showOnce();
    try {
      const giftId = await sendCryptoGift({
        totalAmount: totalAmount.toFixed(0),
        memo: values.memo,
        caContract: caContract,
        type: selectTab === GroupRedPacketTabEnum.Fixed ? RedPackageTypeEnum.FIXED : RedPackageTypeEnum.RANDOM,
        count: Number(values.packetNum || 1),
        token,
        isNewUsersOnly: values.isNewUserOnly,
      });
      reportSendCryptoGiftSuccess();
      console.log(giftId, 'giftId');
      navigationService.navigate('GiftResult', {
        giftId,
      });
    } catch (error) {
      CommonToast.failError('Create failed. Please click the button below and try again.');
    } finally {
      Loading.hide();
    }
  }, [
    checkAllowanceAndApprove,
    checkBalance,
    decimals,
    getCAContract,
    getCryptoGiftContractAddress,
    selectTab,
    sendCryptoGift,
    token,
    updateAssetInfo?.balance,
    values.count,
    values.isNewUserOnly,
    values.memo,
    values.packetNum,
  ]);

  return (
    <PageContainer
      containerStyles={styles.pageStyles}
      titleDom="Preview"
      rightDom={
        <CommonTooltip
          iconStyle={{ marginRight: pTd(16) }}
          iconName="help-white"
          iconSize={pTd(24)}
          tooltipProps={{
            title: 'About crypto gift',
            description: `Crypto Gift lets Portkey users send crypto assets as gifts.

To get started, click "Create crypto gift" to choose the asset, quantity, and claim requirements. After sending, share the generated gift link with friends.

To claim, click the link, log in to your Portkey account, and verify eligibility. Gifts are valid for 24 hours, and unclaimed tokens or NFTs are returned to you afterward.`,
          }}
        />
      }
      scrollViewProps={{ disabled: true }}>
      <View style={styles.amountInfo}>
        <View style={styles.circle}>
          <Svg icon="gift-thin" size={pTd(44)} />
        </View>
        <TextL style={styles.amountShowStr}>
          {amountShowStr} {symbol}
        </TextL>
        <TextL style={styles.fee}>{amountUsdShowStr}</TextL>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <View>
            <TextM style={styles.infoItemTitle}>Balance</TextM>
            {!isLgBalance && <TextM style={styles.errorMessages}>Not enough ELF</TextM>}
          </View>
          <View style={styles.infoItemRight}>
            <TextM style={[styles.infoItemValue, !isLgBalance && styles.errorMessages]}>
              {showStr(balance)} {symbol}
            </TextM>
            <TextM style={[styles.infoItemUsdValue, !isLgBalance && styles.errorMessages]}>{showUsdStr(balance)}</TextM>
          </View>
        </View>
        <View style={styles.infoItem}>
          <TextM style={styles.infoItemTitle}>Network</TextM>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CommonAvatar avatarSize={pTd(18)} imageUrl={imgUrl} style={{ marginRight: pTd(4) }} />
            <TextM style={styles.infoItemValue}>{chainName}</TextM>
          </View>
        </View>
        <View style={styles.infoItem}>
          <TextM style={styles.infoItemTitle}>
            Transaction fee
            <CommonTooltip
              iconStyle={{ marginLeft: pTd(2) }}
              iconSize={pTd(16)}
              tooltipProps={{
                title: 'Estimated network fee',
                description: 'Fee applied by the blockchain to process your transaction, also known as gas fee.',
              }}
            />
          </TextM>
          <View style={styles.infoItemRight}>
            <TextM style={styles.infoItemValue}>0 ELF</TextM>
            <TextM style={styles.infoItemUsdValue}>$0.00</TextM>
          </View>
        </View>
      </View>
      <CommonButton
        containerStyle={styles.button}
        buttonStyle={styles.buttonStyle}
        type="transparent"
        onPress={onConfirm}>
        <View style={styles.buttonContainer}>
          <TextL style={styles.buttonText}>{t('Confirm')}</TextL>
        </View>
      </CommonButton>
    </PageContainer>
  );
};
export default memo(Preview);

const getStyles = makeStyles(theme => ({
  pageStyles: {
    backgroundColor: theme.colors.bgBase1,
    flex: 1,
  },
  headerHelpIcon: { marginRight: pTd(16) },
  title: {
    marginTop: pTd(24),
  },
  subTitle: {
    marginTop: pTd(16),
    marginBottom: pTd(64),
    color: theme.colors.textBase2,
  },
  amountInfo: {
    alignItems: 'center',
  },
  circle: {
    marginTop: pTd(36),
    width: pTd(64),
    height: pTd(64),
    borderRadius: pTd(32),
    backgroundColor: theme.colors.bgBrand2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountShowStr: { color: theme.colors.textBase1, fontSize: pTd(32), marginTop: pTd(40), ...fonts.mediumFont },
  fee: {
    color: theme.colors.textBase2,
    marginTop: pTd(8),
  },
  infoContainer: {
    flexDirection: 'column',
    marginTop: pTd(40),
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pTd(74),
    paddingVertical: pTd(16),
    alignItems: 'center',
  },
  infoItemRight: {
    alignItems: 'flex-end',
  },
  infoItemValue: {
    ...fonts.mediumFont,
    color: theme.colors.textBase1,
    fontSize: pTd(16),
  },
  infoItemUsdValue: {
    color: theme.colors.textBase2,
  },
  button: {
    position: 'absolute',
    left: pTd(16),
    bottom: pTd(24),
  },
  buttonStyle: {
    height: pTd(48),
    paddingVertical: pTd(3.5),
    paddingHorizontal: pTd(3.5),
  },
  buttonContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bgBrand1,
    borderRadius: pTd(38),
  },
  buttonText: {
    lineHeight: pTd(24),
    color: theme.colors.bgNeutral4,
    ...fonts.mediumFont,
  },
  errorMessages: {
    color: theme.colors.textDanger2,
  },
  infoItemTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: pTd(16),
  },
}));
