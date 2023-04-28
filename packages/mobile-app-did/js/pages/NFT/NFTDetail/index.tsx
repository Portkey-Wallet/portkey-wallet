import React from 'react';
import { StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import CommonButton from 'components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { TextL, TextM, TextXL, TextXXL } from 'components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import navigationService from 'utils/navigationService';
import useRouterParams from '@portkey-wallet/hooks/useRouterParams';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';
import SafeAreaBox from 'components/SafeAreaBox';
import Svg from 'components/Svg';
import CommonAvatar from 'components/CommonAvatar';

export interface TokenDetailProps {
  route?: any;
}

interface NftItemType {
  alias: string;
  balance: string;
  chainId: string;
  imageUrl: string;
  imageLargeUrl: string;
  symbol: string;
  tokenContractAddress: string;
  tokenId: string;
}

const NFTDetail: React.FC<TokenDetailProps> = props => {
  const { t } = useLanguage();

  const nftItem = useRouterParams<NftItemType>();

  const { alias, balance, imageLargeUrl, symbol, tokenId } = nftItem;

  console.log('nftItem', nftItem);

  return (
    <SafeAreaBox style={styles.pageWrap}>
      <StatusBar barStyle={'default'} />
      <TouchableOpacity style={styles.iconWrap} onPress={() => navigationService.goBack()}>
        <Svg icon="left-arrow" size={20} />
      </TouchableOpacity>
      <TextXXL style={styles.title}>{`${alias} #${tokenId}`}</TextXXL>
      <TextM style={[FontStyles.font3, styles.balance]}>{`Balance ${balance}`}</TextM>

      <CommonAvatar title={alias} style={[imageLargeUrl ? styles.image1 : styles.image]} imageUrl={imageLargeUrl} />

      <CommonButton
        type="primary"
        onPress={() => {
          navigationService.navigate('SendHome', {
            sendType: 'nft',
            assetInfo: nftItem,
            toInfo: { name: '', address: '' },
          } as unknown as IToSendHomeParamsType);
        }}>
        {t('Send')}
      </CommonButton>
      <TextL style={styles.symbolDescribeTitle}>{symbol}</TextL>
      <TextXL style={[styles.symbolContent, FontStyles.font3]} />
    </SafeAreaBox>
  );
};

export default NFTDetail;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(0, 20, 0),
  },
  iconWrap: {
    width: pTd(20),
    marginBottom: pTd(16),
    marginTop: pTd(16),
  },
  title: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
    marginTop: pTd(8),
  },
  balance: {
    lineHeight: pTd(20),
    marginTop: pTd(8),
  },
  amount: {
    marginTop: pTd(8),
  },
  image: {
    marginTop: pTd(16),
    marginBottom: pTd(16),
    width: pTd(335),
    height: pTd(335),
    borderRadius: pTd(8),
    lineHeight: pTd(335),
    textAlign: 'center',
    fontSize: pTd(100),
    backgroundColor: defaultColors.bg7,
    color: defaultColors.font7,
  },
  image1: {
    marginTop: pTd(16),
    marginBottom: pTd(16),
    width: pTd(335),
    height: pTd(335),
    borderRadius: pTd(8),
    lineHeight: pTd(335),
    textAlign: 'center',
    fontSize: pTd(100),
  },
  symbolDescribeTitle: {
    marginTop: pTd(32),
    ...fonts.mediumFont,
  },
  symbolContent: {
    marginTop: pTd(4),
  },
});
