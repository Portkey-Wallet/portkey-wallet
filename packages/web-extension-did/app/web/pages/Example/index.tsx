import { addDapp, removeDapp } from '@portkey-wallet/store/store-ca/dapp/actions';
import { LoginMethod, SocialLoginEnum } from '@portkey-wallet/types/types-ca/wallet';
import { Button } from 'antd';
import { useAppDispatch } from 'store/Provider/hooks';
import { setCountryModal } from 'store/reducers/modal/slice';
import googleAnalytics from 'utils/googleAnalytics';
import { clearLocalStorage } from 'utils/storage/chromeStorage';

export default function Example() {
  const dispatch = useAppDispatch();

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
            // googleAnalytics.loginEvent('login_tesetttt', { date: Date.now() });
            googleAnalytics.loginEndEvent(LoginMethod.Signup, { extra: Date.now() });
          }}>
          Analytics
        </Button>
      </div>
    </div>
  );
}
