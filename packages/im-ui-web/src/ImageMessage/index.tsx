import React, { useEffect, useMemo, useState } from 'react';
import { Image, Popover } from 'antd';
import clsx from 'clsx';

import { IImageMessageProps } from '../type';
import { formatTime } from '../utils';
import CustomSvg from '../components/CustomSvg';
import { formatImageSize } from '@portkey-wallet/utils/img';
import PopoverMenuList from '../PopoverMenuList';
import './index.less';

const ImageMessage: React.FC<IImageMessageProps> = props => {
  const showDate = useMemo(() => (props.dateString ? props.dateString : formatTime(props.date as any)), []);
  const [loadErr, setLoadErr] = useState(false);
  const { thumbImgUrl, width, height, imgUrl } = props.imgData || {};
  const imageSize = formatImageSize({ width, height, maxWidth: 280, maxHeight: 280 });
  const [popVisible, setPopVisible] = useState(false);
  const popoverList = [
    {
      key: 'delete',
      leftIcon: <CustomSvg type="Delete" />,
      children: 'Delete',
      onClick: () => props?.onDelete?.(`${props.id}`),
    },
  ];
  const hidePop = () => {
    setPopVisible(false);
  };
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, []);
  return (
    <div className={clsx(['portkey-message-image', 'flex', props.position])}>
      <div className={clsx(['image-body', props.position])}>
        {loadErr ? (
          <div className="image-error">
            <CustomSvg type="ImgErr" />
          </div>
        ) : (
          <>
            <Popover
              open={popVisible}
              onOpenChange={v => setPopVisible(v)}
              overlayClassName={clsx(['message-item-popover', props.position])}
              placement={props.position === 'left' ? 'right' : 'left'}
              trigger="contextMenu"
              showArrow={false}
              content={<PopoverMenuList data={popoverList} />}>
              <Image
                width={imageSize.width}
                height={imageSize.height}
                src={thumbImgUrl || imgUrl}
                onError={() => setLoadErr(true)}
              />
              <div className="image-date">{showDate}</div>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageMessage;
