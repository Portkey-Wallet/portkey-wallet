import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Popover } from 'antd';
import clsx from 'clsx';
import { IImageMessageProps } from '../type';
import { formatTime } from '../utils';
import CustomSvg from '../components/CustomSvg';
import { formatImageSize } from '@portkey-wallet/utils/img';
import PopoverMenuList from '../PopoverMenuList';
import './index.less';

const ImageMessage: React.FC<IImageMessageProps> = (props) => {
  const showMask = useMemo(() => {
    const dataShow = props.dateString ? props.dateString : formatTime(props.date as any);
    return (
      <span className="show-mask flex-center">
        {props.pin && <CustomSvg type="MsgPin" />}
        <span>{dataShow}</span>
      </span>
    );
  }, [props.date, props.dateString, props.pin]);
  const [loadErr, setLoadErr] = useState(false);
  const { thumbImgUrl, width, height, imgUrl } = props.imgData || {};
  const imageSize = useMemo(
    () => formatImageSize({ width, height, maxWidth: 272, maxHeight: 272, minHeight: 92, minWidth: 92 }),
    [width, height],
  );
  const [popVisible, setPopVisible] = useState(false);

  const popoverList = useMemo(
    () => [
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: (e: React.MouseEvent<HTMLElement>) => props?.onDeleteMsg?.(e),
      },
      {
        key: 'pin',
        leftIcon: <CustomSvg type="Pin" />,
        children: 'Pin',
        onClick: (e: React.MouseEvent<HTMLElement>) => props?.onPinMsg?.(e),
      },
      {
        key: 'unpin',
        leftIcon: <CustomSvg type="UnPin" />,
        children: 'Unpin',
        onClick: (e: React.MouseEvent<HTMLElement>) => props?.onPinMsg?.(e),
      },
      {
        key: 'reply',
        leftIcon: <CustomSvg type="Reply" />,
        children: 'Reply',
        onClick: (e: React.MouseEvent<HTMLElement>) => props?.onReplyMsg?.(e),
      },
    ],
    [props],
  );
  const hidePop = useCallback(() => {
    setPopVisible(false);
  }, []);
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  const renderImage = useMemo(
    () => (
      <>
        <Image
          style={{ width: imageSize.width, height: imageSize.height }}
          src={thumbImgUrl || imgUrl}
          preview={{
            src: imgUrl || thumbImgUrl,
          }}
          onError={() => setLoadErr(true)}
        />
        <div className="image-date flex-center">{showMask}</div>
      </>
    ),
    [imageSize, imgUrl, showMask, thumbImgUrl],
  );
  return (
    <div className={clsx(['portkey-message-image', 'flex', props.position])}>
      <div className={clsx(['image-body', props.position])}>
        {loadErr ? (
          <div className="image-error">
            <CustomSvg type="ImgErr" />
          </div>
        ) : props.position === 'right' ? (
          <>
            <Popover
              open={popVisible}
              onOpenChange={(v) => setPopVisible(v)}
              overlayClassName={clsx(['message-image-popover', props.position])}
              placement="bottom"
              trigger="contextMenu"
              showArrow={false}
              content={<PopoverMenuList data={popoverList} />}>
              {renderImage}
            </Popover>
          </>
        ) : (
          renderImage
        )}
      </div>
    </div>
  );
};

export default ImageMessage;
