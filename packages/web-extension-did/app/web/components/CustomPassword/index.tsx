import { Input } from 'antd';
import { PasswordProps } from 'antd/lib/input';
import CustomSvg from 'components/CustomSvg';
import { useCallback } from 'react';

const { Password } = Input;

export default function CustomPassword({ maxLength, placeholder, iconRender, ...props }: PasswordProps) {
  const defaultIconRender = useCallback(
    (visible: boolean) =>
      visible ? (
        // eslint-disable-next-line no-inline-styles/no-inline-styles
        <CustomSvg style={{ cursor: 'pointer' }} type="EyeOutlined" />
      ) : (
        // eslint-disable-next-line no-inline-styles/no-inline-styles
        <CustomSvg style={{ cursor: 'pointer' }} type="EyeInvisibleOutlined" />
      ),
    [],
  );

  return (
    <Password
      {...props}
      maxLength={maxLength ?? 16}
      placeholder={placeholder ?? 'Must be at least 6 characters'}
      iconRender={iconRender ?? defaultIconRender}
    />
  );
}
