import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Popover, message } from 'antd';
import { useCopyToClipboard } from 'react-use';
import { ParsedText, ParseShape } from 'react-parsed-text';
import clsx from 'clsx';
import { ITextMessageProps } from '../type';
import { formatTime } from '../utils';
import PopoverMenuList from '../PopoverMenuList';
import CustomSvg from '../components/CustomSvg';
import { UN_SUPPORTED_FORMAT } from '@portkey-wallet/constants/constants-ca/chat';
import './index.less';

const TextMessage: React.FC<ITextMessageProps> = (props) => {
  const showDate = useMemo(
    () => (props.dateString ? props.dateString : formatTime(props.date as any)),
    [props.date, props.dateString],
  );
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
          setCopied(props.text);
          message.success('Copy Success');
        },
      },
      {
        key: 'delete',
        leftIcon: <CustomSvg type="Delete" />,
        children: 'Delete',
        onClick: (e: React.MouseEvent<HTMLElement>) => props?.onDeleteMsg?.(e),
      },
    ],
    [props, setCopied],
  );
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
      {props.subType === 'non-support-msg' ? (
        <div className={clsx(['text-body', 'flex', props.position])}>
          <div className="text-text">
            <span className="non-support-msg" onClick={props.onClickUnSupportMsg}>
              {UN_SUPPORTED_FORMAT}
            </span>
            <span className="text-date-hidden">{showDate}</span>
          </div>
          <div className="text-date">{showDate}</div>
        </div>
      ) : (
        <Popover
          open={popVisible}
          overlayClassName={clsx(['message-text-popover', props.position])}
          placement="bottom"
          trigger="contextMenu"
          onOpenChange={(visible) => setPopVisible(visible)}
          showArrow={false}
          content={
            <PopoverMenuList
              data={popoverList.filter(
                (pop) => props.position === 'right' || (props.position === 'left' && pop.key !== 'delete'),
              )}
            />
          }>
          <div className={clsx(['text-body', 'flex', props.position])}>
            <div className="text-text">
              <ParsedText
                parse={[
                  {
                    type: 'url',
                    className: 'text-link',
                    onClick: handleUrlPress,
                  },
                ]}>
                {props.text}
              </ParsedText>
              <span className="text-date-hidden">{showDate}</span>
            </div>
            <div className="text-date">{showDate}</div>
          </div>
        </Popover>
      )}
    </div>
  );
};

export default TextMessage;
