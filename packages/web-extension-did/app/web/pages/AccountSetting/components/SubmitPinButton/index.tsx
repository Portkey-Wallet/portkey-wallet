import { Button } from 'antd';
import clsx from 'clsx';
import './index.less';

interface ISubmitPinButtonProps {
  text: string;
  disable: boolean;
  onClick: () => void;
  className?: string;
}
export default function SubmitPinButton({ text, disable, onClick, className }: ISubmitPinButtonProps) {
  return (
    <div className={clsx(['submit-pin-btn', className])}>
      <Button className="submit-btn" type="primary" disabled={disable} onClick={onClick}>
        {text}
      </Button>
    </div>
  );
}
