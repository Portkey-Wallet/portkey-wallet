import BuyHome from './BuyHome';
import BuyPreview from './BuyPreview';

const stackNav = [
  { name: 'BuyHome', component: BuyHome },
  { name: 'BuyPreview', component: BuyPreview },
] as const;

export default stackNav;
