import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, StatusBar, View, ScrollView } from 'react-native';
import { useLanguage } from 'i18n/hooks';
import CommonButton from '@portkey-wallet/rn-components/components/CommonButton';
import GStyles from 'assets/theme/GStyles';
import { pTd } from 'utils/unit';
import { defaultColors } from 'assets/theme';
import { TextL, TextM, TextXXL } from '@portkey-wallet/rn-components/components/CommonText';
import { FontStyles } from 'assets/theme/styles';
import fonts from 'assets/theme/fonts';
import SafeAreaBox from '@portkey-wallet/rn-components/components/SafeAreaBox';
import CommonSvg from '@portkey-wallet/rn-components/components/Svg';
import CommonAvatar from '@portkey-wallet/rn-components/components/CommonAvatar';
import { addressFormat, formatChainInfoToShow, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { ScreenWidth } from '@rneui/base';
import { bottomBarHeight } from '@portkey-wallet/utils/mobile/device';
import { copyText } from 'utils/commonUtil';
import { getStatusBarHeight } from 'utils/screen';
import useBaseContainer from 'model/container/UseBaseContainer';
import { PortkeyEntries } from 'config/entries';
import { IToSendHomeParamsType } from '@portkey-wallet/types/types-ca/routeParams';

export interface TokenDetailProps {
  nftItem: NftItemType;
}

interface NftItemType {
  alias: string;
  balance: string;
  chainId: ChainId;
  imageUrl: string;
  imageLargeUrl: string;
  symbol: string;
  tokenContractAddress: string;
  tokenId: string;
  totalSupply: string;
  collectionInfo: {
    imageUrl: string;
    collectionName: string;
  };
}

const NFTDetail: React.FC<TokenDetailProps> = ({ nftItem }: TokenDetailProps) => {
  const { t } = useLanguage();
  const { onFinish, navigateTo } = useBaseContainer();

  const {
    alias,
    balance,
    tokenContractAddress,
    imageLargeUrl,
    symbol,
    totalSupply,
    chainId,
    tokenId,
    collectionInfo: { imageUrl, collectionName },
  } = nftItem;

  const goBack = useCallback(() => {
    onFinish({
      status: 'success',
    });
  }, [onFinish]);

  return (
    <SafeAreaBox style={[styles.pageWrap, styles.pagePaddingTop]}>
      <StatusBar barStyle={'default'} />
      <TouchableOpacity style={styles.iconWrap} onPress={goBack}>
        <CommonSvg icon="left-arrow" size={20} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.collection, GStyles.flexRow, GStyles.itemCenter]}>
          <CommonAvatar imageUrl={imageUrl} title={collectionName} shapeType={'circular'} avatarSize={pTd(24)} />
          <TextM style={[FontStyles.font3, styles.marginLeft8, fonts.mediumFont]}>{collectionName}</TextM>
        </View>
        <TextXXL style={styles.tokenId}>{`${alias} #${tokenId}`}</TextXXL>

        <CommonAvatar
          title={alias}
          style={[imageLargeUrl ? styles.image1 : styles.image]}
          imageUrl={imageLargeUrl}
          avatarSize={pTd(335)}
        />

        <View style={styles.infoWrap}>
          <TextL style={[styles.basicInfoTitle, fonts.mediumFont]}>{t('Basic info')}</TextL>
          <View style={[GStyles.flexRow, styles.rowWrap]}>
            <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Contract address')}</TextM>
            <View style={GStyles.flex1} />
            <TextM style={[styles.leftTitle, FontStyles.font5]}>
              {formatStr2EllipsisStr(addressFormat(tokenContractAddress, chainId))}
            </TextM>
            <TouchableOpacity
              style={[styles.marginLeft8, GStyles.flexCol, styles.copyIconWrap]}
              onPress={async () => await copyText(addressFormat(tokenContractAddress, chainId))}>
              <CommonSvg icon="copy" size={pTd(13)} />
            </TouchableOpacity>
          </View>
          <View style={[GStyles.flexRow, styles.rowWrap]}>
            <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('BlockChain')}</TextM>
            <View style={GStyles.flex1} />
            <TextM style={[styles.leftTitle, FontStyles.font5]}>{formatChainInfoToShow(chainId)}</TextM>
          </View>
          <View style={[GStyles.flexRow, styles.rowWrap]}>
            <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Token symbol')}</TextM>
            <View style={GStyles.flex1} />
            <TextM style={[styles.leftTitle, FontStyles.font5]}>{symbol}</TextM>
          </View>
          <View style={[GStyles.flexRow, styles.rowWrap]}>
            <TextM style={[styles.leftTitle, FontStyles.font3]}>{t('Total supply')}</TextM>
            <View style={GStyles.flex1} />
            <TextM style={[styles.leftTitle, FontStyles.font5]}>{totalSupply ?? ''}</TextM>
          </View>
        </View>
      </ScrollView>

      <View style={[GStyles.flexCol, styles.bottomSection]}>
        <TextM style={[styles.balance, FontStyles.font5, fonts.mediumFont]}>{`You have: ${balance}`}</TextM>
        <CommonButton
          title={t('Send')}
          style={styles.sendBtn}
          type="primary"
          onPress={() => {
            navigateTo<IToSendHomeParamsType>(PortkeyEntries.SEND_TOKEN_HOME_ENTRY, {
              params: {
                sendType: 'nft',
                assetInfo: nftItem,
                toInfo: {
                  name: '',
                  address: '',
                },
              },
            });
          }}
        />
      </View>
    </SafeAreaBox>
  );
};

export default NFTDetail;

export const styles = StyleSheet.create({
  pageWrap: {
    backgroundColor: defaultColors.bg1,
    ...GStyles.paddingArg(0, 20, 0),
  },
  pagePaddingTop: {
    paddingTop: getStatusBarHeight(true),
  },
  iconWrap: {
    width: pTd(20),
    marginBottom: pTd(16),
    marginTop: pTd(16),
  },
  collection: {
    marginTop: pTd(8),
  },
  collectionAvatar: {},
  tokenId: {
    ...fonts.mediumFont,
    lineHeight: pTd(24),
    marginTop: pTd(8),
  },
  amount: {
    marginTop: pTd(8),
  },
  image: {
    marginTop: pTd(24),
    marginBottom: pTd(24),
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
    marginTop: pTd(24),
    marginBottom: pTd(24),
    width: pTd(335),
    height: pTd(335),
    borderRadius: pTd(8),
    lineHeight: pTd(335),
    textAlign: 'center',
    fontSize: pTd(100),
  },
  basicInfoTitle: {
    marginBottom: pTd(8),
  },
  rowWrap: {
    height: pTd(34),
    alignItems: 'center',
  },
  leftTitle: {},
  copyIconWrap: {},
  symbolDescribeTitle: {
    marginTop: pTd(32),
    ...fonts.mediumFont,
  },
  symbolContent: {
    marginTop: pTd(4),
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
  marginLeft8: {
    marginLeft: pTd(8),
  },
  bottomSection: {
    backgroundColor: defaultColors.bg1,
    position: 'absolute',
    bottom: bottomBarHeight,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: defaultColors.border6,
    width: ScreenWidth,
    height: pTd(110),
    paddingLeft: pTd(20),
    paddingRight: pTd(20),
  },
  balance: {
    width: '100%',
    textAlign: 'center',
    marginTop: pTd(10),
  },
  sendBtn: {
    marginTop: pTd(16),
    marginBottom: pTd(16),
  },
  infoWrap: {
    marginBottom: pTd(150),
  },
});
