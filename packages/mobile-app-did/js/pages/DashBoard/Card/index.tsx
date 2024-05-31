import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleProp, ViewProps, TouchableOpacity } from 'react-native';
import { styles } from './style';
import SendButton from 'components/SendButton';
import ReceiveButton from 'components/ReceiveButton';
import ActivityButton from 'pages/DashBoard/ActivityButton';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useCurrentUserInfo, useSetHideAssets } from '@portkey-wallet/hooks/hooks-ca/wallet';
import FaucetButton from 'components/FaucetButton';
import GStyles from 'assets/theme/GStyles';
import DepositButton from 'components/DepositButton';
import BuyButton from 'components/BuyButton';
import { useAppRampEntryShow } from 'hooks/ramp';
import { useAppETransShow } from 'hooks/cms';
import { PortkeyLinearGradient } from 'components/PortkeyLinearGradient';
import { pTd } from 'utils/unit';
import { Skeleton } from '@rneui/base';
import Svg from 'components/Svg';
import { useCmsBanner } from '@portkey-wallet/hooks/hooks-ca/cms/banner';
import CarouselComponent, { CarouselItemProps } from 'components/Carousel';
import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';

const Card: React.FC<{ title: string }> = ({ title }) => {
  const { homeBannerList = [] } = useCmsBanner();
  const getS3ImgUrl = useGetS3ImageUrl();
  const lists: CarouselItemProps[] = useMemo(() => {
    return homeBannerList.map(it => {
      return {
        imgUrl: getS3ImgUrl(it.imgUrl.filename_disk),
        url: it.url,
      };
    });
  }, [getS3ImgUrl, homeBannerList]);
  const isMainnet = useIsMainnet();
  const userInfo = useCurrentUserInfo();
  const setHideAssets = useSetHideAssets();
  const { isETransDepositShow } = useAppETransShow();
  const { isRampShow } = useAppRampEntryShow();
  const buttonCount = useMemo(() => {
    let count = 3;
    if (isETransDepositShow) count++;
    if (isRampShow) count++;
    if (!isMainnet) count++; // faucet
    return count;
  }, [isETransDepositShow, isMainnet, isRampShow]);

  const buttonGroupWrapStyle = useMemo(
    () => (buttonCount < 5 ? (GStyles.flexCenter as StyleProp<ViewProps>) : undefined),
    [buttonCount],
  );
  const buttonWrapStyle = useMemo(
    () => (buttonCount < 5 ? (styles.buttonWrapStyle1 as StyleProp<ViewProps>) : undefined),
    [buttonCount],
  );

  const { eTransferUrl = '' } = useCurrentNetworkInfo();

  const onHideAssets = useCallback(() => {
    setHideAssets(!userInfo.hideAssets);
  }, [setHideAssets, userInfo.hideAssets]);

  return (
    <View style={[styles.cardWrap]}>
      <View style={styles.textColumn}>
        {title ? (
          <View style={styles.usdtBalanceWrap}>
            <Text style={[styles.usdtBalance, userInfo.hideAssets && { letterSpacing: pTd(3.2) }]}>
              {userInfo.hideAssets ? '******' : title}
            </Text>
            {isMainnet && (
              <TouchableOpacity onPress={onHideAssets}>
                <Svg icon={userInfo.hideAssets ? 'eyeClosed' : 'eye'} size={pTd(16)} iconStyle={styles.eyeIcon} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Skeleton
            animation="wave"
            LinearGradientComponent={() => <PortkeyLinearGradient />}
            height={pTd(40)}
            width={pTd(140)}
            style={styles.skeletonStyle}
          />
        )}
      </View>
      <View style={[GStyles.flexRow, GStyles.spaceBetween, styles.buttonGroupWrap, buttonGroupWrapStyle]}>
        <SendButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        <ReceiveButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
        {isRampShow && <BuyButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        {isETransDepositShow && <DepositButton wrapStyle={buttonWrapStyle} depositUrl={eTransferUrl} />}
        {!isMainnet && <FaucetButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />}
        <ActivityButton themeType="dashBoard" wrapStyle={buttonWrapStyle} />
      </View>
      <CarouselComponent items={lists} />
    </View>
  );
};

export default Card;
