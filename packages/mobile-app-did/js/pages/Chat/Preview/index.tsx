import React, { memo, useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import Touchable from 'components/Touchable';
import Svg from 'components/Svg';
import { makeStyles } from '@rneui/themed';
import { pTd } from 'utils/unit';
import { TextL, TextM, TextS, TextH1 } from 'components/CommonText';
import { DeviceEventEmitter, Image, View } from 'react-native';
import CommonButton from 'components/CommonButton';
import { useLanguage } from 'i18n/hooks';
import navigationService from 'utils/navigationService';
import GStyles from 'assets/theme/GStyles';
import fonts from 'assets/theme/fonts';
import { ICryptoBoxAssetItemType } from '@portkey-wallet/types/types-ca/crypto';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { CryptoValuesType } from '../components/SendRedPacketGroupSection';
import { divDecimals } from '@portkey-wallet/utils/converter';
import BigNumber from 'bignumber.js';
import { ZERO } from '@portkey-wallet/constants/misc';
interface IPreviewProps {
  assetInfo: ICryptoBoxAssetItemType;
  amount: string;
  fee: string;
  values: CryptoValuesType;
}
const Preview: React.FC = () => {
  const styles = getStyles();
  const { t } = useLanguage();
  const { assetInfo, fee, values } = useRouterParams<IPreviewProps>();
  const { balance, amountShowStr, amountUsdShowStr, tokenPrice } = values;
  const { symbol, decimals } = assetInfo;
  const showStr = (bnvalue: BigNumber.Value) => {
    return divDecimals(bnvalue, decimals).toFixed(2);
  };
  const showUsdStr = (bnvalue: BigNumber.Value) => {
    return `$${divDecimals(bnvalue, decimals)
      .times(tokenPrice || 0)
      .dp(2)
      .toFixed(2)}`;
  };
  const onConfirm = useCallback(() => {
    navigationService.navigate('SendPacketGroupPage', {
      isCryptoGift: true,
    });
  }, []);

  return (
    <PageContainer
      containerStyles={styles.pageStyles}
      titleDom="Preview"
      rightDom={
        <Touchable
          onPress={() => {
            // TODO: help
          }}>
          <Svg icon="help-white" size={pTd(24)} iconStyle={styles.headerHelpIcon} />
        </Touchable>
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
          <TextM>Balance</TextM>
          <View style={styles.infoItemRight}>
            <TextM style={styles.infoItemValue}>
              {showStr(balance)} {symbol}
            </TextM>
            <TextM style={styles.infoItemUsdValue}>{showUsdStr(balance)}</TextM>
          </View>
        </View>
        <View style={styles.infoItem}>
          <TextM>Transaction fee</TextM>
          <View style={styles.infoItemRight}>
            <TextM style={styles.infoItemValue}>
              {showStr(fee)} {symbol}
            </TextM>
            <TextM style={styles.infoItemUsdValue}>{showUsdStr(fee)}</TextM>
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
    // width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: pTd(42),
    alignItems: 'center',
  },
  infoItemRight: {
    alignItems: 'flex-end',
  },
  infoItemValue: {
    color: theme.colors.textBase1,
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
    borderWidth: pTd(1.5),
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
}));
