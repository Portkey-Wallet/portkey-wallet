import GuardianHome from './GuardianHome';
import GuardianEdit from './GuardianEdit';
import GuardianDetail from './GuardianDetail';

const stackNav = [
  { name: 'GuardianHome', component: GuardianHome },
  { name: 'GuardianEdit', component: GuardianEdit },
  { name: 'GuardianDetail', component: GuardianDetail },
] as const;

export default stackNav;
