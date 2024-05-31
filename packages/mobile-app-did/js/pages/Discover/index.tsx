import DiscoverSearch from './DiscoverSearch';
import Browser from './Browser';
import DiscoverHome from './DiscoverHome';
import Bookmark from './Bookmark';
import { SubLearnPage } from './components/SubPages/Learn/SubLearnPage';
const stackNav = [
  { name: 'DiscoverSearch', component: DiscoverSearch },
  { name: 'Browser', component: Browser },
  { name: 'DiscoverHome', component: DiscoverHome },
  { name: 'Bookmark', component: Bookmark },
  { name: 'SubLearnPage', component: SubLearnPage },
] as const;

export default stackNav;
