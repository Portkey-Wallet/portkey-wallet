import { Input } from 'antd';
import clsx from 'clsx';
import { FocusEventHandler, useState } from 'react';
import './index.less';

interface ToAccountProps {
  value?: { name?: string; address: string };
  onChange?: (value: { name?: string; address: string }) => void;
  onBlur?: FocusEventHandler<HTMLInputElement> | undefined;
  focus: boolean;
}

export default function ToAccount({ value, onChange, onBlur, focus }: ToAccountProps) {
  const [isFocus, setIsFocus] = useState(false);
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    onChange?.({
      name: '',
      address,
    });
  };
  return (
    <div className="to-account" onClick={() => focus && setIsFocus(true)}>
      {isFocus || !value?.address ? (
        <Input
          className={value?.name && 'with-name'}
          value={value?.address}
          autoFocus={isFocus}
          placeholder="Address"
          onChange={onInputChange}
          onBlur={(event) => {
            onBlur && onBlur(event);
            setIsFocus(false);
          }}
        />
      ) : (
        <p className={clsx('address-text', value?.name && 'with-name')}>{value?.address}</p>
      )}
      <p className="account-name">{value?.name && value?.address && <span>{value?.name}</span>}</p>
    </div>
  );
}
