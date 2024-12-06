import SwapHome from './SwapHome';
import SwapPreview from './SwapPreview';
import LimitPreview from './LimitPreview';
import CommonFinishPage from 'components/CommonFinishPage';

const stackNav = [
  { name: 'SwapHome', component: SwapHome },
  { name: 'SwapPreview', component: SwapPreview },
  { name: 'LimitPreview', component: LimitPreview },
  { name: 'SwapFinishPage', component: CommonFinishPage },
] as const;

export default stackNav;
