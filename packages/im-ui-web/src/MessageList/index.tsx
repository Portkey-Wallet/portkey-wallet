import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import MessageItem from '../MessageItem';
import CustomSvg from '../components/CustomSvg';
import CircleLoading from '../components/CircleLoading';
import { IMessageListProps, MessageListEvent, MessageType } from '../type';
import './index.less';

const MessageList: FC<IMessageListProps> = ({
  reference = null,
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
    if (!reference || !reference.current) return;

    if (toBottomHeight === '100%' || (toBottomHeight && scrollBottom < (toBottomHeight as number))) {
      reference.current.scrollTop = reference.current.scrollHeight; // scroll to bottom
    } else {
      if (lockable === true) {
        reference.current.scrollTop = reference.current.scrollHeight - reference.current.offsetHeight - scrollBottom;
      }
    }
  }, [lockable, reference, scrollBottom, toBottomHeight]);

  const getBottom = useCallback((e: any) => {
    if (e.current) return e.current.scrollHeight - e.current.scrollTop - e.current.offsetHeight;
    return e.scrollHeight - e.scrollTop - e.offsetHeight;
  }, []);

  useEffect(() => {
    if (!reference) return;

    if (prevProps.current.dataSource.length !== props.dataSource.length) {
      setScrollBottom(getBottom(reference));
      checkScroll();
    }

    prevProps.current = props;
  }, [checkScroll, getBottom, prevProps, props, reference]);

  const onDeleteMsg: MessageListEvent = useCallback(
    (item, index, event) => {
      if (props.onDeleteMsg instanceof Function) props.onDeleteMsg(item, index, event);
    },
    [props],
  );

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLElement>): void => {
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
      if (reference.current.scrollTop === 0) {
        if (hasNext) {
          next();
        }
      }
      if (props.onScroll instanceof Function) {
        props.onScroll(e);
      }
    },
    [_downButton, getBottom, hasNext, next, props, reference, toBottomHeight],
  );

  const toBottom = useCallback(
    (e?: React.MouseEvent<HTMLElement>) => {
      if (!reference) return;
      reference.current.scrollTop = reference.current.scrollHeight;
      if (props.onDownButtonClick instanceof Function) {
        props.onDownButtonClick(e);
      }
    },
    [props, reference],
  );

  useEffect(() => {
    if (!reference) return;
    reference.current.scrollTop = reference.current.scrollHeight;
  }, [reference]);

  const renderMessageItem = useMemo(() => {
    let prev: MessageType | undefined = undefined;
    return props.dataSource.map((x, i: number) => {
      let isShowMargin = false;
      if (x.type === 'system' || prev?.type === 'system') {
        isShowMargin = true;
      } else {
        isShowMargin = prev?.position !== x.position;
      }
      prev = x;
      return (
        <MessageItem
          {...(x as MessageType)}
          key={x.key}
          className={clsx([isShowMargin && 'show-margin'])}
          onDeleteMsg={(e: React.MouseEvent<HTMLElement>) => onDeleteMsg(x, i, e)}
        />
      );
    });
  }, [onDeleteMsg, props.dataSource]);

  return (
    <div className={clsx(['portkey-message-list', props.className])} {...props.customProps}>
      <div ref={reference} onScroll={onScroll} className="message-list-body flex-column">
        {loading && (
          <div className="loading-more flex-center">
            <CircleLoading />
          </div>
        )}
        {renderMessageItem}
      </div>
      {downButton === true && _downButton && toBottomHeight !== '100%' && (
        <div className="message-list-down-button flex-center" onClick={toBottom}>
          <CustomSvg type="DoubleDown" />
        </div>
      )}
    </div>
  );
};

export default MessageList;
