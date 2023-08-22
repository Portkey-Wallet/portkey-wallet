import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Popover } from 'antd';
import { emojiList } from '../assets/index';
import CustomSvg from '../components/CustomSvg';
import PopoverMenuList, { IPopoverMenuListData } from '../PopoverMenuList';
import Input from '../ChatInput';
import './index.less';

interface IInputBar {
  moreData?: IPopoverMenuListData[];
  showEmoji?: boolean;
  onSendMessage: (v: string) => void;
}

export default function InputBar({ moreData, showEmoji = true, onSendMessage, ...props }: IInputBar) {
  console.log(props);
  const [showEmojiIcon, setShowEmojiIcon] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const [popVisible, setPopVisible] = useState(false);
  const clearPop = (e: any) => {
    try {
      if (e.target.className.indexOf('close-show-emoji-icon') === -1) {
        setShowEmojiIcon(false);
      }
      if (e.target.className.indexOf('close-more-file') === -1) {
        setPopVisible(false);
      }
    } catch (e) {
      console.log('e', e);
    }
  };
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
      if (value) {
        handleSend();
      }
    }
  };
  useEffect(() => {
    document.addEventListener('click', clearPop);
    return () => document.removeEventListener('click', clearPop);
  }, []);

  return (
    <div>
      <div className="portkey-input-bar">
        {showEmojiIcon && (
          <div className="input-emoji">
            <div className="show-icon flex">
              {emojiList.map(item => (
                <div className="icon flex-center" key={item.name} onClick={() => setValue(value + item.code)}>
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
              <div className="close-more-file" onClick={() => setPopVisible(!popVisible)}>
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
              maxlength={300}
              onChange={handleChange}
              onFocus={() => setShowEmojiIcon(false)}
              onKeyDown={handleEnterKeyDown}
            />
            {showEmoji && (
              <div className="portkey-close-show-emoji-icon">
                <CustomSvg
                  className={clsx([showEmojiIcon && 'has-show-emoji-icon'])}
                  type="Emoji"
                  onClick={() => setShowEmojiIcon(!showEmojiIcon)}
                />
              </div>
            )}
          </div>
          {value && <CustomSvg type="Send" onClick={handleSend} />}
        </div>
      </div>
    </div>
  );
}
