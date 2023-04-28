import BuyHome from './BuyHome';
import BuyPreview from './BuyPreview';
import BuyTestConfirm from './BuyTestConfirm';
import BuyTestPreview from './BuyTestPreview';

const stackNav = [
  { name: 'BuyHome', component: BuyHome },
  { name: 'BuyPreview', component: BuyPreview },
  { name: 'BuyTestConfirm', component: BuyTestConfirm },
  { name: 'BuyTestPreview', component: BuyTestPreview },
] as const;

export default stackNav;
