import { Button } from 'antd';
import ExitWalletModal from '../ExitWalletModal';
import clsx from 'clsx';
import './index.less';

export interface IExitWalletProps {
  exitText: string;
  exitVisible: boolean;
  className?: string;
  onExit: () => void;
  onCancelExit: () => void;
}

export default function ExitWallet({ exitText, exitVisible, className, onExit, onCancelExit }: IExitWalletProps) {
  return (
    <>
      <div className={clsx(['exit-wallet', className])}>
        <Button type="default" onClick={onExit} className="exit-wallet-btn">
          {exitText}
        </Button>
      </div>
      <ExitWalletModal open={exitVisible} onCancel={onCancelExit} />
    </>
  );
}
