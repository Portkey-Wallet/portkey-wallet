import { Button } from 'antd';
import clsx from 'clsx';
import './index.less';
import { CustomModalBottom } from '../../../components/CustomModalBottom';
import { useExitWallet } from '../ExitWalletModal/useExitWallet';

export interface IExitWalletProps {
  exitText: string;
  exitVisible?: boolean;
  className?: string;
  onExit?: () => void;
  onCancelExit: () => void;
}

export default function ExitWallet({ exitText, className, onCancelExit }: IExitWalletProps) {
  const { exitWallet } = useExitWallet();

  return (
    <>
      <div className={clsx(['exit-wallet', className])}>
        <Button
          type="default"
          onClick={() => {
            CustomModalBottom({
              type: 'warning',
              content: (
                <div>
                  <div className="title">Are you sure you want to exit your account?</div>
                  <div className="content">
                    After you exit, your assets remain in your account and you can access them through social recovery.
                  </div>
                </div>
              ),
              onOk: () => exitWallet(),
              onCancel: () => {
                onCancelExit();
              },
              title: 'Sign out',
              okText: 'Exit Anyway',
              cancelText: 'Cancel',
            });
          }}
          className="exit-wallet-btn">
          {exitText}
        </Button>
      </div>
    </>
  );
}
