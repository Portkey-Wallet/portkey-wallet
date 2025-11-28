import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CircleLoading from 'components/CircleLoading';
import { useLocationState } from 'hooks/router';
import { useAddWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import singleMessage from 'utils/singleMessage';
import './index.less';
import { SWEventDispatchAccountsChangedWithCurrentAccount } from 'utils/Wallet/account';

type RouterParams = {
  pin: string;
  mnemonics?: string;
  privateKey?: string;
  customTitle?: string;
  successToastShow?: boolean;
  isBackup?: boolean;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CreateNewWallet: React.FC = () => {
  const { state } = useLocationState<RouterParams>();
  const [loading, setLoading] = useState(true);
  const { pin, mnemonics, privateKey, successToastShow, isBackup = false } = state;
  // console.log('CreateNewWallet', pin, mnemonics);
  const navigate = useNavigate();
  const query = useQuery();
  const customTitle = query.get('customTitle');

  const addWallet = useAddWallet();

  const init = useCallback(() => {
    const result = addWallet(pin, mnemonics, privateKey, isBackup);
    if (!result || !result.success) {
      singleMessage.error(result?.message || 'Failed to be imported');
    } else {
      successToastShow && singleMessage.success('Successfully imported');
    }
    // console.log('pin: ', pin, mnemonics, privateKey, result);
    setTimeout(async () => {
      await SWEventDispatchAccountsChangedWithCurrentAccount();
      navigate('/', {
        state: {
          backupWalletModalShow: !(mnemonics || privateKey),
        },
      });
      setLoading(false);
    }, 500);
  }, [addWallet, pin, mnemonics, privateKey, isBackup, successToastShow, navigate]);
  const initRef = useRef(init);
  initRef.current = init;

  useEffect(() => {
    const timer = setTimeout(() => {
      initRef.current();
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="create-wallet-page">
      <div className="create-wallet-content">
        <h1 className="create-wallet-title">{customTitle || 'Creating your wallet...'}</h1>
        <div className="create-wallet-progress-wrap">
          {/*<Progress percent={percent} showInfo={false} />*/}
          {loading && <CircleLoading width={32} height={32} />}
        </div>
      </div>
    </div>
  );
};

export default CreateNewWallet;
