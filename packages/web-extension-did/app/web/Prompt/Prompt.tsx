import ReactDOM from 'react-dom/client';
import { PageRouter } from './routes';
import CustomProvider from 'store/Provider';
import { setPageType } from 'utils/setBody';

const RootWrapper = document.getElementById('root') as Element;

const root = ReactDOM.createRoot(RootWrapper);
document.body.classList.add('prompt-body');
// document.body.classList.add('popup-body');
setPageType('Prompt');

root.render(
  <>
    <CustomProvider pageType="Prompt">
      <PageRouter />
    </CustomProvider>
  </>,
);
