import { useRef, useState } from 'react';
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
  const [showIcon, setShowIcon] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleShowIcon = () => {
    if (showIcon) {
      setShowIcon(false);
    } else {
      setShowIcon(true);
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

  return (
    <div>
      <div className="portkey-input-bar">
        {showIcon && (
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
              trigger="click"
              showArrow={false}
              content={<PopoverMenuList data={moreData} />}>
              <CustomSvg type="File" />
            </Popover>
          ) : (
            <CustomSvg type="File" />
          )}

          <div className="input-text">
            <Input
              autofocus
              referance={inputRef}
              value={value}
              multiline={true}
              maxHeight={140}
              onChange={handleChange}
              onFocus={() => setShowIcon(false)}
              onKeyDown={handleEnterKeyDown}
            />
            {showEmoji && (
              <CustomSvg className={clsx([showIcon && 'has-show-icon'])} type="Emoji" onClick={handleShowIcon} />
            )}
          </div>
          {value && <CustomSvg type="Send" onClick={handleSend} />}
        </div>
      </div>
    </div>
  );
}
