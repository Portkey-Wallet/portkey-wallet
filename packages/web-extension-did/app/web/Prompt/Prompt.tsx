import ReactDOM from 'react-dom/client';
import { PageRouter } from './routes';
import CustomProvider from 'store/Provider';

const RootWrapper = document.getElementById('root') as Element;

const root = ReactDOM.createRoot(RootWrapper);
document.body.classList.add('prompt-body');

root.render(
  <>
    <CustomProvider pageType="Prompt">
      <PageRouter />
    </CustomProvider>
  </>,
);
