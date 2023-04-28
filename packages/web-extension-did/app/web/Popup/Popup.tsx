import ReactDOM from 'react-dom/client';
import { PageRouter } from './routes';
import CustomProvider from 'store/Provider';

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
document.body.classList.add('popup-body');
root.render(
  <>
    <CustomProvider pageType="Popup">
      <PageRouter />
    </CustomProvider>
  </>,
);
