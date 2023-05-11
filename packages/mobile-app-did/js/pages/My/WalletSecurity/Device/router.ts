import DeviceList from './';
import DeviceDetail from './DeviceDetail';

const stackNav = [
  {
    name: 'DeviceList',
    component: DeviceList,
  },
  {
    name: 'DeviceDetail',
    component: DeviceDetail,
  },
] as const;

export default stackNav;
