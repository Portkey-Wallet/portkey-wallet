import ActivityDetail from './ActivityDetail';
import ActivityListPage from './ActivityListPage';
import ViewOnWebView from './ViewOnWebView';

const stackNav = [
  { name: 'ActivityListPage', component: ActivityListPage },
  { name: 'ActivityDetail', component: ActivityDetail },
  { name: 'ViewOnWebView', component: ViewOnWebView },
] as const;

export default stackNav;
