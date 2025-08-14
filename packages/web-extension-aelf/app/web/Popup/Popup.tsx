import ReactDOM from 'react-dom/client';
import { PageRouter } from './routes';
import CustomProvider from 'store/Provider';
import { setPageType } from 'utils/setBody';
import { updateUserActivityListeners } from 'utils/storage/lock/updateUserActivityTime';
import { CommonPage } from 'components/CommonPage';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
document.body.classList.add('popup-body');
document.body.classList.add('theme-dark');
setPageType('Popup');
updateUserActivityListeners();

root.render(
  <>
    <CustomProvider pageType="Popup">
      <CommonPage>
        <PageRouter />
      </CommonPage>
    </CustomProvider>
  </>,
);
