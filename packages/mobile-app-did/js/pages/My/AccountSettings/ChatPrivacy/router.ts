import ChatPrivacy from './index';
import EditChatPrivacy from './EditChatPrivacy';

const stackNav = [
  {
    name: 'ChatPrivacy',
    component: ChatPrivacy,
  },
  {
    name: 'EditChatPrivacy',
    component: EditChatPrivacy,
  },
] as const;

export default stackNav;
