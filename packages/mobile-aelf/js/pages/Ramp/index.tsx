import RampEntry from './RampEntry';
import RampBuy from './RampBuy';
import RampSell from './RampSell';
import RampHome from './RampHome';
import RampPreview from './RampPreview';

const stackNav = [
  { name: 'RampEntry', component: RampEntry },
  { name: 'RampBuy', component: RampBuy },
  { name: 'RampSell', component: RampSell },
  { name: 'RampHome', component: RampHome },
  { name: 'RampPreview', component: RampPreview },
] as const;

export default stackNav;
