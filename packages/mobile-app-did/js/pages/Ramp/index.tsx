import RampHome from './RampHome';
import RampPreview from './RampPreview';

const stackNav = [
  { name: 'RampHome', component: RampHome },
  { name: 'RampPreview', component: RampPreview },
] as const;

export default stackNav;
