import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Popover } from 'antd';
import clsx from 'clsx';
import { formatImageData, formatTime } from '../utils';
import CustomSvg from '../components/CustomSvg';
import { formatImageSize } from '@portkey-wallet/utils/img';
import PopoverMenuList from '../PopoverMenuList';
import { ParsedImage } from '@portkey-wallet/im';
import { IMessage, MessageShowPageEnum } from '../type';
import './index.less';

const ImageMessage: React.FC<IMessage> = (props) => {
  const {
    isGroup,
    pinInfo,
    parsedContent,
    isAdmin,
    createAt,
    showPageType = MessageShowPageEnum['MSG-PAGE'],
    position,
  } = props;
  const { thumbImgUrl, width, height, imgUrl } = formatImageData(parsedContent as ParsedImage);
  const [currentSrc, setCurrentSrc] = useState(thumbImgUrl);
  const [loadErr, setLoadErr] = useState(false);
  const imageSize = useMemo(
    () => formatImageSize({ width, height, maxWidth: 272, maxHeight: 272, minHeight: 92, minWidth: 92 }),
    [width, height],
  );
  const [popVisible, setPopVisible] = useState(false);
  const popAllList = useMemo(
    () => [
      {
        key: 'reply',
        leftIcon: <CustomSvg type="Reply" />,
        children: 'Reply',
        onClick: () => props?.onReplyMsg?.(props),
      },
      pinInfo
        ? {
            key: 'pin',
            leftIcon: <CustomSvg type="UnPin" />,
            children: 'Unpin',
            onClick: () => props?.onPinMsg?.(props),
          }
        : {
            key: 'pin',
            leftIcon: <CustomSvg type="Pin" />,
            children: 'Pin',
            onClick: () => props?.onPinMsg?.(props),
          },
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: () => props?.onDeleteMsg?.(props),
      },
    ],
    [pinInfo, props],
  );
  const popListFilter = useMemo(() => {
    let _popList: string[] = [];
    const isMine = position === 'right';
    if (showPageType === MessageShowPageEnum['MSG-PAGE']) {
      if (isGroup) {
        _popList = isAdmin ? ['pin', 'reply'] : ['reply'];
      }
    }
    if (showPageType === MessageShowPageEnum['PIN-PAGE']) {
      _popList = isAdmin ? ['pin'] : [];
    }
    if (isMine) {
      _popList.unshift('delete');
    }
    return popAllList.filter((t) => _popList.includes(t.key));
  }, [isAdmin, isGroup, popAllList, position, showPageType]);
  const showMask = useMemo(() => {
    const dataShow = props.dateString ? props.dateString : formatTime(createAt);
    return (
      <span className="show-mask flex-center">
        {pinInfo && showPageType === MessageShowPageEnum['MSG-PAGE'] && <CustomSvg type="MsgPin" />}
        <span>{dataShow}</span>
      </span>
    );
  }, [createAt, pinInfo, props.dateString, showPageType]);
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
          src={currentSrc}
          preview={{
            src: imgUrl,
          }}
          onError={(error: any) => {
            const _targetSrc = error.target?.currentSrc;
            if (_targetSrc === imgUrl) {
              setLoadErr(true);
            } else {
              setCurrentSrc(imgUrl);
            }
          }}
        />
        <div className="image-date flex-center">{showMask}</div>
      </>
    ),
    [currentSrc, imageSize.height, imageSize.width, imgUrl, showMask],
  );
  return (
    <div className={clsx(['portkey-message-image', 'flex', position])}>
      <div className={clsx(['image-body', position])}>
        {loadErr ? (
          <div className="image-error">
            <CustomSvg type="ImgErr" />
          </div>
        ) : popListFilter.length ? (
          <Popover
            open={popVisible}
            onOpenChange={(v) => setPopVisible(v)}
            overlayClassName={clsx(['message-image-popover', position])}
            placement="bottom"
            trigger="contextMenu"
            showArrow={false}
            content={<PopoverMenuList data={popListFilter} />}>
            {renderImage}
          </Popover>
        ) : (
          renderImage
        )}
      </div>
    </div>
  );
};

export default ImageMessage;
