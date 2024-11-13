import ChatPrivacyNav from './ChatPrivacy/router';
import AboutUs from './AboutUs';

const stackNav = [
  {
    name: 'AboutUs',
    component: AboutUs,
  },
  ...ChatPrivacyNav,
] as const;

export default stackNav;
