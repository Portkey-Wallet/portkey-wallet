import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Popover, message } from 'antd';
import { useCopyToClipboard } from 'react-use';
import { ParsedText, ParseShape } from 'react-parsed-text';
import clsx from 'clsx';
import { ExtraMessageTypeEnum, IMessage } from '../type';
import { formatImageData, formatTime } from '../utils';
import PopoverMenuList from '../PopoverMenuList';
import CustomSvg from '../components/CustomSvg';
import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';
import RepliedMsg from '../components/RepliedMsg';
import { MessageTypeEnum, ParsedImage } from '@portkey-wallet/im/types';
import './index.less';

const TextMessage: React.FC<IMessage> = (props) => {
  const { isGroup, quote, position, pinInfo, parsedContent = '', isAdmin, createAt } = props;
  const showMask = useMemo(() => {
    const dataShow = props.dateString ? props.dateString : formatTime(createAt);
    return (
      <span className="flex-center">
        {pinInfo && <CustomSvg type="MsgPin" />}
        <span>{dataShow}</span>
      </span>
    );
  }, [props.dateString, createAt, pinInfo]);
  const [, setCopied] = useCopyToClipboard();
  const [popVisible, setPopVisible] = useState(false);
  const hidePop = useCallback(() => {
    setPopVisible(false);
  }, []);
  const popoverList = useMemo(
    () => [
      {
        key: 'copy',
        leftIcon: <CustomSvg type="Copy" />,
        children: 'Copy',
        onClick: () => {
          setCopied(parsedContent as string);
          message.success('Copy Success');
        },
      },
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: (e: React.MouseEvent<HTMLElement>) => props?.onDeleteMsg?.(e),
      },
      pinInfo
        ? {
            key: 'unpin',
            leftIcon: <CustomSvg type="UnPin" />,
            children: 'Unpin',
            onClick: (e: React.MouseEvent<HTMLElement>) => props?.onPinMsg?.(e),
          }
        : {
            key: 'pin',
            leftIcon: <CustomSvg type="Pin" />,
            children: 'Pin',
            onClick: (e: React.MouseEvent<HTMLElement>) => props?.onPinMsg?.(e),
          },
      {
        key: 'reply',
        leftIcon: <CustomSvg type="Reply" />,
        children: 'Reply',
        onClick: (e: React.MouseEvent<HTMLElement>) => props?.onReplyMsg?.(e),
      },
    ],
    [parsedContent, pinInfo, props, setCopied],
  );
  const showPopoverList = useMemo(
    () =>
      isGroup
        ? isAdmin
          ? popoverList
          : popoverList.filter((item) => ['copy', 'delete', 'reply'].includes(item.key))
        : popoverList.filter((item) => ['copy', 'delete'].includes(item.key)),
    [isAdmin, isGroup, popoverList],
  );
  const renderReplyMsg = useMemo(() => {
    if (!quote) {
      return <></>;
    }
    if (quote.type === MessageTypeEnum.IMAGE) {
      const { thumbImgUrl, imgUrl } = formatImageData(quote.parsedContent as ParsedImage);
      return (
        <RepliedMsg
          msgType={MessageTypeEnum.IMAGE}
          position={position}
          msgContent={thumbImgUrl || imgUrl}
          from={quote.fromName || 'Wallet'}
        />
      );
    }
    if (quote.type === MessageTypeEnum.TEXT) {
      return (
        <RepliedMsg
          msgType={MessageTypeEnum.TEXT}
          position={position}
          msgContent={quote.content}
          from={quote.fromName || 'Wallet'}
        />
      );
    }
    return <></>;
  }, [position, quote]);
  const handleUrlPress: ParseShape['onClick'] = useCallback(
    (url: string) => {
      if (props.onClickUrl instanceof Function) {
        props.onClickUrl(url);
      }
    },
    [props],
  );
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);
  return (
    <div className="portkey-message-text">
      {props.subType === ExtraMessageTypeEnum['NO-SUPPORT-MSG'] ? (
        <div className={clsx(['text-body', 'flex', position])}>
          <div className="text-text">
            <span className="non-support-msg" onClick={props.onClickUnSupportMsg}>
              {UN_SUPPORTED_FORMAT}
            </span>
            <span className="text-date-hidden">{showMask}</span>
          </div>
          <div className="text-date">{showMask}</div>
        </div>
      ) : (
        <Popover
          open={popVisible}
          overlayClassName={clsx(['message-text-popover', position])}
          placement="bottom"
          trigger="contextMenu"
          onOpenChange={(visible) => setPopVisible(visible)}
          showArrow={false}
          content={
            <PopoverMenuList
              data={showPopoverList.filter(
                (pop) => position === 'right' || (position === 'left' && pop.key !== 'delete'),
              )}
            />
          }>
          <div className={clsx(['text-body', 'flex', position])}>
            <div className="text-container flex-column">
              {renderReplyMsg}
              <div className="text-text">
                <ParsedText
                  parse={[
                    {
                      type: 'url',
                      className: 'text-link',
                      onClick: handleUrlPress,
                    },
                  ]}>
                  {parsedContent as string}
                </ParsedText>
                <span className="text-date-hidden">{showMask}</span>
              </div>
            </div>
            <div className="text-date">{showMask}</div>
          </div>
        </Popover>
      )}
    </div>
  );
};

export default TextMessage;
