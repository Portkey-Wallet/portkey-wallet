import { Button } from 'antd';
import clsx from 'clsx';
import './index.less';
import { CustomModalBottom } from '../../../components/CustomModalBottom';
import { useExitWallet } from '../ExitWalletModal/useExitWallet';
import { useCommonState } from 'store/Provider/hooks';

export interface IExitWalletProps {
  exitText: string;
  exitVisible?: boolean;
  className?: string;
  onExit?: () => void;
  onCancelExit: () => void;
}

export default function ExitWallet({ exitText, className, onCancelExit }: IExitWalletProps) {
  const { exitWallet } = useExitWallet();
  const { isPrompt } = useCommonState();

  return (
    <>
      <div className={clsx(['exit-wallet', className])}>
        <Button
          type="default"
          onClick={() => {
            CustomModalBottom({
              type: 'warning',
              isPrompt,
              content: (
                <div>
                  {/*<div className="title">Are you sure you want to exit your account?</div>*/}
                  <div className="title">Confirm sign out</div>
                  <div className="content">
                    Your assets will remain safe in your account and accessible next time you log in via social
                    recovery.
                  </div>
                </div>
              ),
              onOk: () => exitWallet(),
              onCancel: () => {
                onCancelExit();
              },
              // title: 'Sign out',
              okText: 'Sign out',
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
