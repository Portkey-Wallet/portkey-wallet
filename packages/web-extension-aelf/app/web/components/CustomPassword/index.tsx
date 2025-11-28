import { Input } from 'antd';
import { PasswordProps } from 'antd/lib/input';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useCallback } from 'react';

const { Password } = Input;

export default function CustomPassword({ maxLength, placeholder, iconRender, value, ...props }: PasswordProps) {
  const defaultIconRender = useCallback(
    (visible: boolean) =>
      visible ? (
        // eslint-disable-next-line no-inline-styles/no-inline-styles
        <CustomSvgV3 style={{ width: 16 }} fillColor="#FFFFFFB2" className="cursor-pointer" type="visibility" />
      ) : (
        // eslint-disable-next-line no-inline-styles/no-inline-styles
        <CustomSvgV3 style={{ width: 16 }} fillColor="#FFFFFFB2" className="cursor-pointer" type="visibility_off" />
      ),
    [],
  );

  return (
    <Password
      {...props}
      value={value}
      maxLength={maxLength ?? 16}
      allowClear={{ clearIcon: <CustomSvgV3 type="close-circle" /> }}
      placeholder={placeholder ?? 'Must be at least 6 characters'}
      iconRender={iconRender ?? defaultIconRender}
    />
  );
}
