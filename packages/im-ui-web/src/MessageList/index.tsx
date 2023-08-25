import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';

import MessageItem from '../MessageItem';
import CustomSvg from '../components/CustomSvg';
import CircleLoading from '../components/CircleLoading';
import { IMessageListProps, MessageListEvent, MessageType } from '../type';
import './index.less';

const MessageList: FC<IMessageListProps> = ({
  referance = null,
  lockable = false,
  toBottomHeight = 30,
  downButton = true,
  hasNext,
  next,
  loading = false,
  ...props
}) => {
  const [scrollBottom, setScrollBottom] = useState(0);
  const [_downButton, setDownButton] = useState(false);
  const prevProps = useRef(props);

  const checkScroll = useCallback(() => {
    const e = referance;
    if (!e || !e.current) return;

    if (toBottomHeight === '100%' || (toBottomHeight && scrollBottom < (toBottomHeight as number))) {
      e.current.scrollTop = e.current.scrollHeight; // scroll to bottom
    } else {
      if (lockable === true) {
        e.current.scrollTop = e.current.scrollHeight - e.current.offsetHeight - scrollBottom;
      }
    }
  }, [lockable, referance, scrollBottom, toBottomHeight]);

  useEffect(() => {
    if (!referance) return;

    if (prevProps.current.dataSource.length !== props.dataSource.length) {
      setScrollBottom(getBottom(referance));
      checkScroll();
    }

    prevProps.current = props;
  }, [checkScroll, prevProps, props, referance]);

  const getBottom = (e: any) => {
    if (e.current) return e.current.scrollHeight - e.current.scrollTop - e.current.offsetHeight;
    return e.scrollHeight - e.scrollTop - e.offsetHeight;
  };

  const onDownload: MessageListEvent = useCallback(
    (item, index, event) => {
      if (props.onDownload instanceof Function) props.onDownload(item, index, event);
    },
    [props],
  );

  const onPhotoError: MessageListEvent = useCallback(
    (item, index, event) => {
      if (props.onPhotoError instanceof Function) props.onPhotoError(item, index, event);
    },
    [props],
  );

  const onDelete = useCallback(
    (item: MessageType) => {
      if (props.onDelete instanceof Function) props.onDelete(item);
    },
    [props],
  );

  const onScroll = (e: React.UIEvent<HTMLElement>): void => {
    const bottom = getBottom(e.currentTarget);
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
    if (referance.current.scrollTop === 0) {
      if (hasNext) {
        next();
      }
    }
    if (props.onScroll instanceof Function) {
      props.onScroll(e);
    }
  };

  const toBottom = (e?: any) => {
    if (!referance) return;
    referance.current.scrollTop = referance.current.scrollHeight;
    if (props.onDownButtonClick instanceof Function) {
      props.onDownButtonClick(e);
    }
  };

  useEffect(() => {
    if (!referance) return;
    referance.current.scrollTop = referance.current.scrollHeight;
  }, [referance]);

  const renderMessageItem = useMemo(() => {
    let prev = 'left';
    let isShowMargin = false;
    return props.dataSource.map((x, i: number) => {
      if (i === 0) {
        prev = x.position;
      } else {
        isShowMargin = prev !== x.position;
        prev = x.position;
      }
      return (
        <MessageItem
          {...(x as any)}
          key={x.key}
          className={isShowMargin && 'showMargin'}
          onPhotoError={props.onPhotoError && ((e: React.MouseEvent<HTMLElement>) => onPhotoError(x, i, e))}
          onDownload={props.onDownload && ((e: React.MouseEvent<HTMLElement>) => onDownload(x, i, e))}
          onDelete={() => onDelete(x)}
        />
      );
    });
  }, [onDelete, onDownload, onPhotoError, props.dataSource, props.onDownload, props.onPhotoError]);

  return (
    <div className={clsx(['portkey-message-list', 'flex', props.className])} {...props.customProps}>
      <div ref={referance} onScroll={onScroll} className="message-list-body">
        {loading && (
          <div className="loading-more flex-center">
            <CircleLoading />
          </div>
        )}
        {renderMessageItem}
      </div>
      {downButton === true && _downButton && toBottomHeight !== '100%' && (
        <div className="message-list-down-button flex-center" onClick={toBottom}>
          <CustomSvg type="LeftArrow" />
        </div>
      )}
    </div>
  );
};

export default MessageList;
