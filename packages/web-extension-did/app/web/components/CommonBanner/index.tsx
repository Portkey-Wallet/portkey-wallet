import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Image } from 'antd';
import { Swiper, SwiperProps, SwiperRef } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import SkeletonCom, { SkeletonComType } from 'pages/components/SkeletonCom';
import { useGetS3ImageUrl } from '@portkey-wallet/hooks/hooks-ca/cms';
import { TBaseCardItemType } from '@portkey-wallet/types/types-ca/cms';
import { isUrl } from '@portkey-wallet/utils';
import './index.less';

interface ICommonBannerProps {
  wrapClassName?: string;
  bannerList: TBaseCardItemType[];
}

const SWIPER_AUTOPLAY_INTERVAL = 5000;

export default function CommonBanner({ wrapClassName, bannerList }: ICommonBannerProps) {
  const commonBannerRef = useRef<SwiperRef | null>(null);

  const getS3ImageUrl = useGetS3ImageUrl();

  const [isShowSkeleton, setIsShowSkeleton] = useState(true);
  const [imageLoadedStatusList, setImageLoadedStatusList] = useState<boolean[]>([]);
  const [isShowArrow, setIsShowArrow] = useState(false);

  const canSwitch = useMemo(() => !isShowSkeleton && bannerList.length > 1, [bannerList.length, isShowSkeleton]);

  useEffect(() => {
    const tempImageLoadedStatusList = Array(bannerList.length).fill(false);
    setImageLoadedStatusList(tempImageLoadedStatusList);
  }, [bannerList]);

  useEffect(() => {
    if (imageLoadedStatusList.length > 0 && imageLoadedStatusList.every(Boolean)) {
      setIsShowSkeleton(false);
    }
  }, [imageLoadedStatusList]);

  const handleImageLoad = useCallback((index: number) => {
    setImageLoadedStatusList((prev) => {
      if (prev.length === 0) return prev;
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  }, []);

  const swiperItems = useMemo(
    () =>
      bannerList.map((item, index) => (
        <Swiper.Item key={index}>
          <Image
            className={clsx('common-banner-item', { ['cursor-pointer']: isUrl(item?.url) })}
            width="100%"
            height="100%"
            src={getS3ImageUrl(item?.imgUrl?.filename_disk)}
            preview={false}
            onLoad={() => handleImageLoad(index)}
            onClick={() => {
              if (isUrl(item?.url)) {
                window.open(item.url, '_blank');
              }
            }}
          />
        </Swiper.Item>
      )),
    [bannerList, getS3ImageUrl, handleImageLoad],
  );

  const swiperIndicator: SwiperProps['indicator'] = (total, current) => {
    if (!canSwitch) return null;
    return (
      <div className="common-banner-indicator flex-center cursor-pointer">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={clsx('common-banner-indicator-item', {
              ['common-banner-indicator-item-active']: index === current,
            })}
            onClick={() => commonBannerRef.current?.swipeTo(index)}
          />
        ))}
      </div>
    );
  };

  if (bannerList.length === 0) return null;

  return (
    <div
      className={clsx('common-banner-wrap', wrapClassName)}
      onMouseEnter={() => canSwitch && setIsShowArrow(true)}
      onMouseLeave={() => canSwitch && setIsShowArrow(false)}>
      {isShowSkeleton && (
        <div className="skeleton-wrap flex-row-between">
          <div className="skeleton-left flex-column">
            <SkeletonCom className="skeleton-left-top" type={SkeletonComType.avatar} />
            <SkeletonCom className="skeleton-left-bottom" type={SkeletonComType.avatar} />
          </div>
          <div className="skeleton-right">
            <SkeletonCom type={SkeletonComType.image} />
          </div>
        </div>
      )}
      <Swiper
        ref={commonBannerRef}
        className="common-banner"
        allowTouchMove={false}
        loop
        autoplay={canSwitch}
        autoplayInterval={SWIPER_AUTOPLAY_INTERVAL}
        indicator={swiperIndicator}>
        {swiperItems}
      </Swiper>
      <div
        className={clsx('common-banner-arrow', 'common-banner-arrow-left', {
          ['common-banner-arrow-hidden']: !isShowArrow,
        })}
        onClick={() => commonBannerRef.current?.swipePrev()}>
        <CustomSvg type="LeftArrowWithRightSideSpacing" />
      </div>
      <div
        className={clsx('common-banner-arrow', 'common-banner-arrow-right', {
          ['common-banner-arrow-hidden']: !isShowArrow,
        })}
        onClick={() => commonBannerRef.current?.swipeNext()}>
        <CustomSvg type="LeftArrowWithRightSideSpacing" />
      </div>
    </div>
  );
}
