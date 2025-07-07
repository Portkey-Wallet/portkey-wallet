import PortKeyTitle from 'pages/components/PortKeyTitle';
import './index.less';
import { SetPinBase } from '@portkey/did-ui-react';
import { useLocationState, useNavigateState } from 'hooks/router';
import clsx from 'clsx';

type TRouterParams = {
  oldPin?: string;
  isBackHide?: boolean;
  mnemonics?: string;
  privateKey?: string;
  isBackup?: boolean;
};

export default function SetPin() {
  const { state } = useLocationState<TRouterParams>();
  const { mnemonics, privateKey, isBackup = false } = state || {};
  const navigate = useNavigateState();

  return (
    <div className="set-wallet-pin" id="set-wallet-pin">
      <PortKeyTitle
        hidePortKeyLogo
        leftElement={true}
        leftCallBack={() => navigate('/register')}
        renderContent={
          <>
            <div className="set-pin-header">{`Create a PIN to protect your wallet`}</div>
            <div className="set-pin-content">
              <SetPinBase
                className={clsx('portkey-card-height', 'portkey-ui-set-pin-pc')}
                onFinish={async (pin: string) => {
                  console.log('onFinish', pin);
                  navigate('/wallet/create', {
                    state: {
                      pin,
                      mnemonics,
                      privateKey,
                      isBackup,
                    },
                  });
                }}
                onFinishFailed={() => {
                  console.log('failed');
                }}
              />
            </div>
          </>
        }
      />
    </div>
  );
}
