import SwapHome from './SwapHome';
import SwapPreview from './SwapPreview';

const stackNav = [
  { name: 'SwapHome', component: SwapHome },
  { name: 'SwapPreview', component: SwapPreview },
] as const;

export default stackNav;
