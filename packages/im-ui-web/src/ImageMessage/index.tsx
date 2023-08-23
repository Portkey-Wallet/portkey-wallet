import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Popover, message } from 'antd';
import clsx from 'clsx';

import { IImageMessageProps } from '../type';
import { formatTime } from '../utils';
import CustomSvg from '../components/CustomSvg';
import { formatImageSize } from '@portkey-wallet/utils/img';
import PopoverMenuList from '../PopoverMenuList';
import './index.less';

const ImageMessage: React.FC<IImageMessageProps> = (props) => {
  const showDate = useMemo(
    () => (props.dateString ? props.dateString : formatTime(props.date)),
    [props.dateString, props.date],
  );
  const [loadErr, setLoadErr] = useState(false);
  const { thumbImgUrl, width, height, imgUrl } = props.imgData || {};
  const imageSize = useMemo(() => formatImageSize({ width, height, maxWidth: 272, maxHeight: 272 }), [width, height]);
  const [popVisible, setPopVisible] = useState(false);
  const handleDelMsg = useCallback(async () => {
    try {
      await props?.onDelete?.(`${props.id}`);
    } catch (e) {
      message.error('delete message error');
      console.log('===delete message error', e);
    }
  }, [props]);
  const popoverList = [
    {
      key: 'delete',
      leftIcon: <CustomSvg type="Delete" />,
      children: 'Delete',
      onClick: handleDelMsg,
    },
  ];
  const hidePop = () => {
    setPopVisible(false);
  };
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, []);
  const renderImage = useMemo(
    () => (
      <>
        <Image
          width={imageSize.width}
          height={imageSize.height}
          src={thumbImgUrl || imgUrl}
          preview={{
            src: imgUrl || thumbImgUrl,
          }}
          onError={() => setLoadErr(true)}
        />
        <div className="image-date">{showDate}</div>
      </>
    ),
    [imageSize.height, imageSize.width, imgUrl, showDate, thumbImgUrl],
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
