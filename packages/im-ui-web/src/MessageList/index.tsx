import React, { FC, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import MessageItem from '../MessageItem';
import CustomSvg from '../components/CustomSvg';
import { IMessageListProps, MessageListEvent } from '../type';

import './index.less';

const MessageList: FC<IMessageListProps> = ({
  referance = null,
  lockable = false,
  toBottomHeight = 300,
  downButton,
  ...props
}) => {
  const [scrollBottom, setScrollBottom] = useState(0);
  const [_downButton, setDownButton] = useState(false);
  const prevProps = useRef(props);

  const checkScroll = () => {
    var e = referance;
    if (!e || !e.current) return;

    if (toBottomHeight === '100%' || (toBottomHeight && scrollBottom < (toBottomHeight as number))) {
      e.current.scrollTop = e.current.scrollHeight; // scroll to bottom
    } else {
      if (lockable === true) {
        e.current.scrollTop = e.current.scrollHeight - e.current.offsetHeight - scrollBottom;
      }
    }
  };

  useEffect(() => {
    if (!referance) return;

    if (prevProps.current.dataSource.length !== props.dataSource.length) {
      setScrollBottom(getBottom(referance));
      checkScroll();
    }

    prevProps.current = props;
  }, [prevProps, props]);

  const getBottom = (e: any) => {
    if (e.current) return e.current.scrollHeight - e.current.scrollTop - e.current.offsetHeight;
    return e.scrollHeight - e.scrollTop - e.offsetHeight;
  };

  const onDownload: MessageListEvent = (item, index, event) => {
    if (props.onDownload instanceof Function) props.onDownload(item, index, event);
  };

  const onPhotoError: MessageListEvent = (item, index, event) => {
    if (props.onPhotoError instanceof Function) props.onPhotoError(item, index, event);
  };

  const onScroll = (e: React.UIEvent<HTMLElement>): void => {
    var bottom = getBottom(e.currentTarget);
    setScrollBottom(bottom);
    if (toBottomHeight === '100%' || (toBottomHeight && bottom > (toBottomHeight as number))) {
      if (_downButton !== true) {
        setDownButton(true);
        setScrollBottom(bottom);
      }
    } else {
      if (_downButton !== false) {
        setDownButton(false);
        setScrollBottom(bottom);
      }
    }

    if (props.onScroll instanceof Function) {
      props.onScroll(e);
    }
  };

  const toBottom = (e: any) => {
    if (!referance) return;
    referance.current.scrollTop = referance.current.scrollHeight;
    if (props.onDownButtonClick instanceof Function) {
      props.onDownButtonClick(e);
    }
  };

  return (
    <div className={clsx(['portkey-message-list', 'flex', props.className])} {...props.customProps}>
      <div ref={referance} onScroll={onScroll} className="message-list-body">
        {props.dataSource.map((x, i: number) => (
          <MessageItem
            key={x.id}
            {...(x as any)}
            onPhotoError={props.onPhotoError && ((e: React.MouseEvent<HTMLElement>) => onPhotoError(x, i, e))}
            onDownload={props.onDownload && ((e: React.MouseEvent<HTMLElement>) => onDownload(x, i, e))}
            styles={props.messageBoxStyles}
          />
        ))}
      </div>
      {/* {downButton === true && _downButton && toBottomHeight !== '100%' && ( */}
      <div className="message-list-down-button flex-center" onClick={toBottom}>
        <CustomSvg type="LeftArrow" />
      </div>
      {/* )} */}
    </div>
  );
};

export default MessageList;
