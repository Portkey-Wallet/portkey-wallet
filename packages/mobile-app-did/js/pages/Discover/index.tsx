import DiscoverSearch from './DiscoverSearch';
import Browser from './Browser';
import DiscoverHome from './DiscoverHome';
import Bookmark from './Bookmark';
import { SubLearnPage } from './components/SubPages/Learn/SubLearnPage';
import { TransitionPresets } from '@react-navigation/stack';
const stackNav = [
  { name: 'DiscoverSearch', component: DiscoverSearch, options: { ...TransitionPresets.ModalSlideFromBottomIOS } },
  { name: 'Browser', component: Browser },
  { name: 'DiscoverHome', component: DiscoverHome },
  { name: 'Bookmark', component: Bookmark },
  { name: 'SubLearnPage', component: SubLearnPage },
] as const;

export default stackNav;
