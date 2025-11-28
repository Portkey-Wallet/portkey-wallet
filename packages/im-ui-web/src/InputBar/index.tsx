import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Popover } from 'antd';
import { emojiList } from '../assets/emoji/index';
import CustomSvg from '../components/CustomSvg';
import PopoverMenuList from '../PopoverMenuList';
import CustomInput from '../components/CustomInput';
import { IInputBarProps, PopDataProps } from '../type';
import ReplyMsg from './ReplyMsg';
import { MessageTypeEnum } from '@portkey-wallet/im/types';
import './index.less';

export default function InputBar({
  moreData,
  showEmoji = true,
  replyMsg,
  maxLength = 300,
  onCloseReply,
  onSendMessage,
}: IInputBarProps) {
  const [showEmojiIcon, setShowEmojiIcon] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [popVisible, setPopVisible] = useState(false);
  const formatMoreData = moreData?.map((item: PopDataProps) => ({
    ...item,
    onClick: () => {
      setPopVisible(false);
      item?.onClick?.();
    },
  }));
  const hidePop = useCallback((e: any) => {
    try {
      const _t = e?.target?.className;
      const isFun = _t.includes instanceof Function;
      if (isFun && !_t.includes('show-emoji-icon-container')) {
        setShowEmojiIcon(false);
      }
      if (isFun && !_t.includes('more-file-container')) {
        setPopVisible(false);
      }
    } catch (e) {
      console.log('===input bar hidePop error', e);
    }
  }, []);
  const handleChange = useCallback((e: any) => {
    setValue(e.target.value);
  }, []);
  const handleSend = useCallback(() => {
    onSendMessage(value);
    setValue('');
  }, [onSendMessage, value]);
  const handleEnterKeyDown = useCallback(
    (e: any) => {
      if (e.keyCode === 13 && e.shiftKey) {
        e.preventDefault();
        setValue(e.target.value + '\n');
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if (value?.trim()) {
          handleSend();
        }
      }
    },
    [handleSend, value],
  );
  const renderReplyMsg = useMemo(() => {
    if (replyMsg) {
      if ([MessageTypeEnum.IMAGE, MessageTypeEnum.TEXT].includes(replyMsg.msgType)) {
        return (
          <ReplyMsg
            msgType={replyMsg.msgType}
            msgContent={replyMsg.msgContent}
            thumbImgUrl={replyMsg.thumbImgUrl}
            imgUrl={replyMsg.imgUrl}
            toName={replyMsg.toName}
            onCloseReply={onCloseReply}
          />
        );
      }
      return null;
    }
    return null;
  }, [onCloseReply, replyMsg]);
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);

  return (
    <div>
      <div className="portkey-input-bar">
        {renderReplyMsg}
        {showEmojiIcon && (
          <div className="input-emoji">
            <div className="show-icon flex">
              {emojiList.map((item) => (
                <div
                  className="icon flex-center"
                  key={item.name}
                  onClick={() => {
                    setValue(value + item.code);
                    inputRef.current?.focus();
                  }}>
                  {item.code}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex input-box">
          {moreData ? (
            <Popover
              overlayClassName="portkey-input-more-popover"
              placement="top"
              open={popVisible}
              trigger="click"
              showArrow={false}
              content={<PopoverMenuList data={formatMoreData} />}>
              <div
                className="more-file-container flex-center"
                onClick={() => {
                  setShowEmojiIcon(false);
                  setPopVisible(!popVisible);
                }}>
                <CustomSvg className={clsx([popVisible && 'has-show-more-icon'])} type="File" />
              </div>
            </Popover>
          ) : null}
          <div className="input-text">
            <CustomInput
              autofocus
              reference={inputRef}
              value={value}
              multiline={true}
              maxHeight={140}
              maxLength={maxLength}
              onChange={handleChange}
              onKeyDown={handleEnterKeyDown}
            />
            {showEmoji && (
              <div className="show-emoji-icon-container">
                <CustomSvg
                  onClick={() => {
                    setPopVisible(false);
                    setShowEmojiIcon(!showEmojiIcon);
                  }}
                  className={clsx([showEmojiIcon && 'has-show-emoji-icon'])}
                  type="Emoji"
                />
              </div>
            )}
          </div>
          {value?.trim() && (
            <div className="show-send-container flex-center">
              <CustomSvg type="Send" onClick={handleSend} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
