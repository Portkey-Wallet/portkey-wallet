import { Button } from 'antd';
import clsx from 'clsx';
import './index.less';

interface ISubmitPinButtonProps {
  text: string;
  disable: boolean;
  className?: string;
}
export default function SubmitPinButton({ text, disable, className }: ISubmitPinButtonProps) {
  return (
    <div className={clsx(['submit-pin-btn', className])}>
      <Button className="submit-btn" type="primary" htmlType="submit" disabled={disable}>
        {text}
      </Button>
    </div>
  );
}
