import BuyHome from './RampHome';
import BuyPreview from './RampPreview';

const stackNav = [
  { name: 'RampHome', component: BuyHome },
  { name: 'RampPreview', component: BuyPreview },
] as const;

export default stackNav;
