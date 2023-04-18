import SelectVerifier from './SelectVerifier';
import GuardianApproval from './GuardianApproval';
import VerifierDetails from './VerifierDetails';

const stackNav = [
  { name: 'SelectVerifier', component: SelectVerifier },
  { name: 'GuardianApproval', component: GuardianApproval },
  { name: 'VerifierDetails', component: VerifierDetails },
] as const;

export default stackNav;
