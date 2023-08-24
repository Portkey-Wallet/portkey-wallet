import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Popover } from 'antd';
import { emojiList } from '../assets/index';
import CustomSvg from '../components/CustomSvg';
import PopoverMenuList, { IPopoverMenuListData } from '../PopoverMenuList';
import Input from '../ChatInput';
import './index.less';

interface IInputBar {
  maxlength?: number;
  moreData?: IPopoverMenuListData[];
  showEmoji?: boolean;
  onSendMessage: (v: string) => void;
}

export default function InputBar({ moreData, showEmoji = true, onSendMessage, maxlength = 300 }: IInputBar) {
  const [showEmojiIcon, setShowEmojiIcon] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [popVisible, setPopVisible] = useState(false);
  const hidePop = useCallback((e: any) => {
    try {
      if (e.target.className.indexOf('show-emoji-icon-container') === -1) {
        setShowEmojiIcon(false);
      }
      if (e.target.className.indexOf('more-file-container') === -1) {
        setPopVisible(false);
      }
    } catch (e) {
      console.log('e', e);
    }
  }, []);
  const handleChange = (e: any) => {
    setValue(e.target.value);
  };
  const handleSend = () => {
    onSendMessage(value);
    setValue('');
  };
  const handleEnterKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (value?.trim()) {
        handleSend();
      }
    }
  };
  useEffect(() => {
    document.addEventListener('click', hidePop);
    return () => document.removeEventListener('click', hidePop);
  }, [hidePop]);

  return (
    <div>
      <div className="portkey-input-bar">
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
              content={<PopoverMenuList data={moreData} />}>
              <div
                className="more-file-container flex-center"
                onClick={() => {
                  setShowEmojiIcon(false);
                  setPopVisible(!popVisible);
                }}>
                <CustomSvg type="File" />
              </div>
            </Popover>
          ) : (
            <></>
          )}

          <div className="input-text">
            <Input
              autofocus
              referance={inputRef}
              value={value}
              multiline={true}
              maxHeight={140}
              maxlength={maxlength}
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
