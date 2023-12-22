import ReactDOM from 'react-dom/client';
import { PageRouter } from './routes';
import CustomProvider from 'store/Provider';
import { setPageType } from 'utils/setBody';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
document.body.classList.add('popup-body');
setPageType('Popup');

root.render(
  <>
    <CustomProvider pageType="Popup">
      <PageRouter />
    </CustomProvider>
  </>,
);
