import ReactDOM from 'react-dom/client';
import { PageRouter } from './routes';
import CustomProvider from 'store/Provider';
import { setPageType } from 'utils/setBody';
import { CommonPage } from 'components/CommonPage';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
document.body.classList.add('popup-body');
document.body.classList.add('theme-dark');
setPageType('Popup');
root.render(
  <>
    <CustomProvider pageType="Popup">
      <CommonPage>
        <PageRouter />
      </CommonPage>
    </CustomProvider>
  </>,
);
