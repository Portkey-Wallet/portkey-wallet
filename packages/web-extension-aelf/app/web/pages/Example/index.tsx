import { addDapp, removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { useNavigate } from 'react-router-dom';
// import { SocialLoginEnum } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
// [DEPRECATED-ETRANSFER] BEGIN - useCrossTransferByEtransfer import deprecated
// import { useCrossTransferByEtransfer } from 'hooks/useCrossTransferByEtransfer';
// [DEPRECATED-ETRANSFER] END
import { useAppDispatch } from 'store/Provider/hooks';
import { setCountryModal } from 'store/reducers/modal/slice';
// import googleAnalytics from 'utils/googleAnalytics';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { clearLocalStorage } from 'utils/storage/chromeStorage';
import { useBackupWalletModal } from 'hooks/wallet/useBackupWalletModal';

export default function Example() {
  const dispatch = useAppDispatch();
  // [DEPRECATED-ETRANSFER] BEGIN - ETransfer hook usage deprecated
  // const { withdraw, withdrawPreview } = useCrossTransferByEtransfer();
  // [DEPRECATED-ETRANSFER] END
  const { showBackupWalletModal } = useBackupWalletModal();
  const navigate = useNavigate();

  return (
    <div>
      {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
      <div style={{ margin: '8px 0px' }}>
        wallet
        <Button
          onClick={async () => {
            showBackupWalletModal();
          }}>
          showBackupWalletModal
        </Button>
        <Button
          onClick={async () => {
            navigate('/wallet/import');
          }}>
          ImportWallet
        </Button>
        <Button
          onClick={async () => {
            navigate('/wallet/backup/manual');
          }}>
          ManualBackup
        </Button>
        <Button
          onClick={async () => {
            navigate('/wallet/backup/manual/success');
          }}>
          ManualBackupSuccess
        </Button>
        <Button
          onClick={async () => {
            navigate('/wallet/backup/manual/confirm');
          }}>
          ConfirmBackup
        </Button>
      </div>

      <Button
        onClick={async () => {
          await clearLocalStorage();
          console.log('clearLocalStorage');
        }}>
        clearLocalStorage
      </Button>
      <Button
        onClick={() => {
          dispatch(setCountryModal(true));
        }}>
        CountryCode
      </Button>
      <div className="flex">
        <Button
          onClick={() => {
            dispatch(
              addDapp({
                networkType: 'TESTNET',
                dapp: {
                  origin: 'http://localhost:3000',
                  name: 'test',
                  icon: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
                },
              }),
            );
          }}>
          addDapp
        </Button>
        <Button
          onClick={() => {
            dispatch(
              addDapp({
                networkType: 'TESTNET',
                dapp: {
                  origin: 'http://192.168.11.251:3000',
                  name: 'test',
                  icon: 'https://www.baidu.com/img/flexible/logo/pc/result.png',
                },
              }),
            );
          }}>
          addDapp ip
        </Button>
      </div>
      <div className="flex">
        <Button
          onClick={() => {
            dispatch(
              removeDapp({
                networkType: 'TESTNET',
                origin: 'http://localhost:3000',
              }),
            );
          }}>
          removeDapp
        </Button>
        {/*<Button*/}
        {/*  onClick={() => {*/}
        {/*    // googleAnalytics.loginEvent('login_tesetttt', { date: Date.now() });*/}
        {/*    googleAnalytics.loginStartEvent(SocialLoginEnum.Apple, { extra: Date.now() });*/}
        {/*  }}>*/}
        {/*  Analytics*/}
        {/*</Button>*/}
        <Button
          onClick={() => {
            setPinAction('111111');
          }}>
          setPinAction
        </Button>
        {/* [DEPRECATED-ETRANSFER] BEGIN - ETransfer withdraw test button deprecated */}
        {/* <Button
          onClick={async () => {
            const withdrawPreviewResult = await withdrawPreview({
              chainId: 'tDVW',
              address: '0x76a7e856E90d1eeA61A74Dbfc1311A966e743929',
              symbol: 'ELF',
              network: 'TBSC',
              currentAccountAddress: 'TODO ?????????',
              amount: '5',
            });

            console.log(withdrawPreviewResult, 'withdrawPreviewResult=withdraw');

            const result = await withdraw({
              chainId: 'tDVW',
              toAddress: '0x76a7e856E90d1eeA61A74Dbfc1311A966e743929',
              amount: '5',
              tokenInfo: {
                symbol: 'ELF',
                decimals: 8,
                address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
              },
              network: 'TBSC',
            });
            console.log(result, 'result==withdraw');
          }}>
          withdraw
        </Button> */}
        {/* [DEPRECATED-ETRANSFER] END */}
      </div>
    </div>
  );
}
