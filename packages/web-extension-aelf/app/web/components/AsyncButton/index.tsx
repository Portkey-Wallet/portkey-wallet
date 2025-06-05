import { Button, ButtonProps } from 'antd';
import { useCallback, useState } from 'react';

export interface AsyncButtonProps extends ButtonProps {
  onClick: () => Promise<any>;
}

export default function AsyncButton({ onClick, ...props }: AsyncButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.log('===AsyncButton click error:', error);
    } finally {
      setLoading(false);
    }
  }, [onClick]);
  return <Button {...props} loading={loading} onClick={handleClick} />;
}
