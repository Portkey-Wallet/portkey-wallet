import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import MessageItem from '../MessageItem';
import CustomSvg from '../components/CustomSvg';
import CircleLoading from '../components/CircleLoading';
import { ExtraMessageTypeEnum, IMessageListProps, MessageContentType } from '../type';
import { MessageTypeEnum } from '@portkey-wallet/im';
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
  const scrollBottomRef = useRef<number>(0);
  const [_downButton, setDownButton] = useState(false);
  const prevProps = useRef(props);

  const checkScroll = useCallback(() => {
    if (!reference || !reference.current) return;

    if (toBottomHeight === '100%' || (toBottomHeight && scrollBottomRef.current < (toBottomHeight as number))) {
      reference.current.scrollTop = reference.current.scrollHeight; // scroll to bottom
    } else {
      if (lockable === true) {
        reference.current.scrollTop =
          reference.current.scrollHeight - reference.current.offsetHeight - scrollBottomRef.current;
      }
    }
  }, [lockable, reference, toBottomHeight]);

  const getBottom = useCallback((e: any) => {
    if (e.current) return e.current.scrollHeight - e.current.scrollTop - e.current.offsetHeight;
    return e.scrollHeight - e.scrollTop - e.offsetHeight;
  }, []);

  useEffect(() => {
    if (!reference) return;

    if (prevProps.current.dataSource.length !== props.dataSource.length) {
      checkScroll();
      scrollBottomRef.current = getBottom(reference);
    }

    prevProps.current = props;
  }, [checkScroll, getBottom, prevProps, props, reference]);

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLElement>): void => {
      const bottom = getBottom(e.currentTarget);
      scrollBottomRef.current = bottom;
      if (toBottomHeight === '100%' || (toBottomHeight && bottom > (toBottomHeight as number))) {
        setDownButton(true);
      } else {
        setDownButton(false);
      }
      if (reference.current.scrollTop === 0 && hasNext) next?.();
      props?.onScroll?.(e);
    },
    [getBottom, hasNext, next, props, reference, toBottomHeight],
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
    let prev: MessageContentType | undefined = undefined;
    let isShowMargin = false;
    let hiddenAvatar = false;
    return props.dataSource.map((x, i: number) => {
      // hidden avatar logic
      hiddenAvatar = x?.fromName === prev?.fromName;
      isShowMargin = prev?.position !== x.position;
      if (prev?.position !== x.position) {
        isShowMargin = true;
      } else {
        isShowMargin = x.subType === ExtraMessageTypeEnum['DATE-SYS-MSG'];
      }
      if (x.type === MessageTypeEnum.SYS && prev?.type === MessageTypeEnum.SYS) {
        isShowMargin = x.subType !== prev?.subType;
      }
      prev = x;
      return (
        <MessageItem
          {...(x as MessageContentType)}
          key={x.key}
          className={clsx([isShowMargin && 'show-margin', hiddenAvatar && 'hidden-avatar'])}
          onDeleteMsg={(e: React.MouseEvent<HTMLElement>) => props?.onDeleteMsg?.(x, i, e)}
          onPinMsg={(e: React.MouseEvent<HTMLElement>) => props?.onPinMsg?.(x, i, e)}
          onReplyMsg={(e: React.MouseEvent<HTMLElement>) => props?.onReplyMsg?.(x, i, e)}
          onClickUrl={props?.onClickUrl}
          onClickUnSupportMsg={props?.onClickUnSupportMsg}
          onClickAvatar={(e: React.MouseEvent<HTMLElement>) => props?.onClickAvatar?.(x, i, e)}
        />
      );
    });
  }, [props]);

  return (
    <div className={clsx(['portkey-message-list', 'flex', props.className])} {...props.customProps}>
      <div ref={reference} onScroll={onScroll} className="message-list-body">
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
