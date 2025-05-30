import { addDapp, removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { SocialLoginEnum } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
import { useCrossTransferByEtransfer } from 'hooks/useCrossTransferByEtransfer';
import { useAppDispatch } from 'store/Provider/hooks';
import { setCountryModal } from 'store/reducers/modal/slice';
import googleAnalytics from 'utils/googleAnalytics';
import { setPinAction } from 'utils/lib/serviceWorkerAction';
import { clearLocalStorage } from 'utils/storage/chromeStorage';

export default function Example() {
  const dispatch = useAppDispatch();
  const { withdraw, withdrawPreview } = useCrossTransferByEtransfer();

  return (
    <div>
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
        <Button
          onClick={() => {
            // googleAnalytics.loginEvent('login_tesetttt', { date: Date.now() });
            googleAnalytics.loginStartEvent(SocialLoginEnum.Apple, { extra: Date.now() });
          }}>
          Analytics
        </Button>
        <Button
          onClick={() => {
            setPinAction('111111');
          }}>
          setPinAction
        </Button>
        <Button
          onClick={async () => {
            const withdrawPreviewResult = await withdrawPreview({
              chainId: 'tDVW',
              address: '0x76a7e856E90d1eeA61A74Dbfc1311A966e743929',
              symbol: 'ELF',
              network: 'TBSC',

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
        </Button>
      </div>
    </div>
  );
}
