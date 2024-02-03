import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Popover } from 'antd';
import { useCopyToClipboard } from 'react-use';
import { ParsedText, ParseShape } from 'react-parsed-text';
import clsx from 'clsx';
import { ExtraMessageTypeEnum, IMessage, MessageShowPageEnum } from '../type';
import { formatImageData, formatTime } from '../utils';
import PopoverMenuList from '../PopoverMenuList';
import CustomSvg from '../components/CustomSvg';
import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';
import RepliedMsg from '../components/RepliedMsg';
import { MessageTypeEnum, ParsedImage } from '@portkey-wallet/im/types';
import { websiteRE } from '@portkey-wallet/utils/reg';
import singleMessage from '../utils/singleMessage';
import './index.less';

const TextMessage: React.FC<IMessage> = (props) => {
  const {
    isGroup,
    quote,
    position,
    pinInfo,
    parsedContent = '',
    isAdmin,
    createAt,
    showPageType = MessageShowPageEnum['MSG-PAGE'],
    dateString,
  } = props;
  const dataShowStr = useMemo(() => dateString || formatTime(createAt), [createAt, dateString]);
  const isPinIconShow = useMemo(
    () => pinInfo && showPageType === MessageShowPageEnum['MSG-PAGE'],
    [pinInfo, showPageType],
  );
  const showMask = useMemo(() => {
    return (
      <span className="flex-center">
        {isPinIconShow && <CustomSvg type="MsgPin" />}
        <span>{dataShowStr}</span>
      </span>
    );
  }, [isPinIconShow, dataShowStr]);
  const [, setCopied] = useCopyToClipboard();
  const [popVisible, setPopVisible] = useState(false);
  const hidePop = useCallback(() => {
    setPopVisible(false);
  }, []);
  const popoverAllList = useMemo(
    () => [
      {
        key: 'copy',
        leftIcon: <CustomSvg type="Copy" />,
        children: 'Copy',
        onClick: () => {
          setCopied(parsedContent as string);
          singleMessage.success('Copy Success');
        },
      },
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
    [parsedContent, pinInfo, props, setCopied],
  );
  const popListFilter = useMemo(() => {
    if (showPageType === MessageShowPageEnum['MSG-PAGE']) {
      if (isGroup) {
        return isAdmin ? ['copy', 'delete', 'pin', 'reply'] : ['copy', 'delete', 'reply'];
      }
      return ['copy', 'delete'];
    }
    if (showPageType === MessageShowPageEnum['PIN-PAGE']) {
      return isAdmin ? ['copy', 'delete', 'pin'] : ['copy', 'delete'];
    }
    return [];
  }, [isAdmin, isGroup, showPageType]);
  const popoverShowList = useMemo(
    () => popoverAllList.filter((item) => popListFilter.includes(item.key)),
    [popListFilter, popoverAllList],
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
          thumbImgUrl={thumbImgUrl || imgUrl}
          imgUrl={imgUrl}
          from={quote.fromName}
        />
      );
    }
    if (quote.type === MessageTypeEnum.TEXT) {
      return (
        <RepliedMsg
          msgType={MessageTypeEnum.TEXT}
          position={position}
          msgContent={quote.content || 'The message has been hidden.'}
          from={quote.fromName}
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
            <span className={clsx('text-date-hidden', isPinIconShow && 'pin-icon')}>{dataShowStr}</span>
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
              data={popoverShowList.filter(
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
                    {
                      pattern: websiteRE,
                      className: 'text-link',
                      onClick: handleUrlPress,
                    },
                  ]}>
                  {parsedContent as string}
                </ParsedText>
                <span className={clsx('text-date-hidden', isPinIconShow && 'pin-icon')}>{dataShowStr}</span>
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
