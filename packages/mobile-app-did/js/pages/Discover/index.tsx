import DiscoverSearch from './DiscoverSearch';
import Browser from './Browser';
import DiscoverHome from './DiscoverHome';
import Bookmark from './Bookmark';
const stackNav = [
  { name: 'DiscoverSearch', component: DiscoverSearch },
  { name: 'Browser', component: Browser },
  { name: 'DiscoverHome', component: DiscoverHome },
  { name: 'Bookmark', component: Bookmark },
] as const;

export default stackNav;
