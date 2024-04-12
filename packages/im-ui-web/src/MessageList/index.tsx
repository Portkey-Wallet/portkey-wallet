import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import MessageItem from '../MessageItem';
import CustomSvg from '../components/CustomSvg';
import CircleLoading from '../components/CircleLoading';
import { ExtraMessageTypeEnum, IMessageListProps, MessageContentType, MessagePositionEnum } from '../type';
import { SupportSysMsgType } from '../constants';
import { useEffectOnce } from '@portkey-wallet/hooks';
import './index.less';

const MessageList: FC<IMessageListProps> = ({
  reference = null,
  lockable = false,
  toBottomHeight = 30,
  downButton = true,
  hasNext,
  next,
  loading = false,
  dataSource,
  myPortkeyId,
  ...props
}) => {
  const scrollBottomRef = useRef<number>(0);
  const [showDownButton, setShowDownButton] = useState(false);
  const prevProps = useRef(dataSource);

  const checkScroll = useCallback(() => {
    if (!reference || !reference.current) return;
    if (toBottomHeight && scrollBottomRef.current < (toBottomHeight as number)) {
      reference.current.scrollTop = reference.current.scrollHeight; // scroll to bottom
    } else {
      if (lockable === true) {
        reference.current.scrollTop =
          reference.current.scrollHeight - reference.current.offsetHeight - scrollBottomRef.current;
        if (!reference.current.scrollTop) {
          setShowDownButton(false);
        }
      }
    }
  }, [lockable, reference, toBottomHeight]);

  const getBottom = useCallback((e: any) => {
    if (e.current) return e.current.scrollHeight - e.current.scrollTop - e.current.offsetHeight;
    return e.scrollHeight - e.scrollTop - e.offsetHeight;
  }, []);

  useEffect(() => {
    if (!reference) return;

    if (prevProps.current.length !== dataSource.length) {
      checkScroll();
      scrollBottomRef.current = getBottom(reference);
    }

    prevProps.current = dataSource;
  }, [checkScroll, dataSource, getBottom, reference]);

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLElement>): void => {
      const bottom = getBottom(e.currentTarget);
      scrollBottomRef.current = bottom;
      if (toBottomHeight && bottom > (toBottomHeight as number)) {
        setShowDownButton(true);
      } else {
        setShowDownButton(false);
      }
      if (reference.current.scrollTop === 0 && hasNext) next?.();
    },
    [getBottom, hasNext, next, reference, toBottomHeight],
  );

  const toBottom = useCallback(() => {
    if (!reference) return;
    reference.current.scrollTop = reference.current.scrollHeight;
  }, [reference]);

  useEffectOnce(() => {
    toBottom();
  });

  const renderMessageItem = useMemo(() => {
    let prev: MessageContentType | undefined = undefined;
    let isShowMargin = false;
    let hiddenAvatar = false;
    return dataSource.map((x) => {
      isShowMargin = false;
      hiddenAvatar = false;
      // hidden avatar logic
      if (prev?.type) {
        hiddenAvatar = !SupportSysMsgType.includes(prev?.type) && x?.fromName === prev?.fromName;
      }
      if (prev?.position !== x.position) {
        isShowMargin = true;
      } else {
        if (x.position === MessagePositionEnum.left) {
          isShowMargin = x.from !== prev?.from;
        }
        if (x.position === MessagePositionEnum.center) {
          isShowMargin =
            x.subType === ExtraMessageTypeEnum['DATE-SYS-MSG'] || prev.subType === ExtraMessageTypeEnum['DATE-SYS-MSG'];
        }
      }
      prev = x;
      return (
        <MessageItem
          {...(x as MessageContentType)}
          myPortkeyId={myPortkeyId}
          key={x.key}
          hideAvatar={hiddenAvatar}
          className={clsx([isShowMargin && 'show-margin'])}
          onDeleteMsg={props?.onDeleteMsg}
          onPinMsg={props?.onPinMsg}
          onReplyMsg={props?.onReplyMsg}
          onClickUrl={props?.onClickUrl}
          onClickUnSupportMsg={props?.onClickUnSupportMsg}
          onClickAvatar={props?.onClickAvatar}
        />
      );
    });
  }, [dataSource, myPortkeyId, props]);

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
      {downButton && showDownButton && (
        <div className="message-list-down-button flex-center" onClick={toBottom}>
          <CustomSvg type="DoubleDown" />
        </div>
      )}
    </div>
  );
};

export default MessageList;
