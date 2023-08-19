import Camera from './example-gifted-chat/src/Camera';
import ChatsDetail from './example-gifted-chat/src/Chats';

const chatNav = [
  {
    name: 'Camera',
    component: Camera,
  },
  {
    name: 'ChatsDetail',
    component: ChatsDetail,
  },
] as const;

export default chatNav;
