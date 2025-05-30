import { Button, ButtonProps } from 'antd';
import { useThrottleFirstCallback } from 'hooks/throttle';
import { useEffect, useRef } from 'react';

export default function ThrottleButton({ onClick, ...props }: ButtonProps) {
  const onClickRef = useRef(onClick);
  useEffect(() => {
    onClickRef.current = onClick;
  });
  const throttleClick = useThrottleFirstCallback(
    (e) => {
      onClickRef.current?.(e);
    },
    [],
    500,
  );
  return <Button {...props} onClick={throttleClick} />;
}
