import GuardianHome from './GuardianHome';
import GuardianEdit from './GuardianEdit';
import GuardianDetail from './GuardianDetail';
import TonApprove from './TonApprove';

const stackNav = [
  { name: 'GuardianHome', component: GuardianHome },
  { name: 'GuardianEdit', component: GuardianEdit },
  { name: 'GuardianDetail', component: GuardianDetail },
  { name: 'TonApprove', component: TonApprove },
] as const;

export default stackNav;
