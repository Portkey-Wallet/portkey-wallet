import { CMSState } from '@portkey-wallet/store/store-ca/cms/types';

export const CmsState: { cms: CMSState } = {
  cms: {
    socialMediaListNetMap: {
      TESTNET: [
        {
          index: 1,
          link: 'https://twitter.com',
          svgUrl: { filename_disk: '1889.svg' },
          title: 'Follow us on Twitter test',
        },
        {
          index: 2,
          link: 'https://t.me',
          svgUrl: { filename_disk: '9e4c.svg' },
          title: 'Join us on Telegram test',
        },
      ],
      MAINNET: [
        {
          index: 1,
          link: 'https://twitter.com',
          svgUrl: { filename_disk: '2777.svg' },
          title: 'Follow us on Twitter main',
        },
        {
          index: 3,
          link: 'https://t.me',
          svgUrl: { filename_disk: '79e6.svg' },
          title: 'Join us on Telegram main',
        },
      ],
    },
    discoverGroupListNetMap: {
      TESTNET: [
        {
          id: '1',
          index: 1,
          title: 'GAME',
          items: [
            {
              id: '1',
              index: 1,
              title: 'mockTitle1',
              description: 'mockDescription1',
              url: 'http://xxx',
              imgUrl: { filename_disk: '8698.png' },
            },
            {
              id: '5',
              index: 1,
              title: 'mockTitle5',
              description: 'mockDescription5',
              url: 'http://xxx',
              imgUrl: { filename_disk: '32a4.png' },
            },
          ],
        },
        {
          id: '2',
          index: 1,
          title: 'Dapps',
          items: [
            {
              id: '3',
              index: 1,
              title: 'mockTitle3',
              description: 'mockDescription3',
              url: 'http://xxx',
              imgUrl: { filename_disk: '187f.png' },
            },
          ],
        },
      ],
    },
    tabMenuListNetMap: {
      TESTNET: [
        {
          index: 1,
          title: 'Wallet',
          type: {
            value: 'Wallet',
          },
        },
      ],
      MAINNET: [
        {
          index: 1,
          title: 'Wallet',
          type: {
            value: 'Wallet',
          },
        },
      ],
    },
    rememberMeBlackListMap: {
      TESTNET: [{ name: 'bingoGame', url: 'https://portkey-bingo-game.vercel.app' }],
      MAINNET: [{ name: 'bingoGame', url: 'https://portkey-bingo-game.vercel.app' }],
    },
  },
};
