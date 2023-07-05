import { CMSState } from '@portkey-wallet/store/store-ca/cms/types';

export const CmsState: { cms: CMSState } = {
  cms: {
    socialMediaListNetMap: {
      TESTNET: [
        {
          index: 1,
          link: 'https://twitter.com/Portkey_DID',
          svgUrl: { filename_disk: '6e8441f7-2260-44fa-9673-94b0352c1889.svg' },
          title: 'Follow us on Twitter',
        },
        {
          index: 1,
          link: 'https://t.me/Portkey_Official_Group',
          svgUrl: { filename_disk: '54aefae4-1559-425d-af8b-c9a2752a9e4c.svg' },
          title: 'Join us on Telegram',
        },
        {
          index: 2,
          link: 'https://discord.com/invite/EUBq3rHQhr',
          svgUrl: { filename_disk: '22f51bce-6836-4815-b37b-88933254c7c2.svg' },
          title: 'Join us on Discord',
        },
      ],
      MAIN: [
        {
          index: 1,
          link: 'https://twitter.com/Portkey_DID',
          svgUrl: { filename_disk: '7fd9e50a-961a-46d4-a4b3-f8bcc66a2777.svg' },
          title: 'Follow us on Twitter',
        },
        {
          index: 2,
          link: 'https://discord.com/invite/EUBq3rHQhr',
          svgUrl: { filename_disk: 'fd871c3e-155a-4e2a-92bd-e21b24f92d3a.svg' },
          title: 'Join us on Discord',
        },
        {
          index: 3,
          link: 'https://t.me/Portkey_Official_Group',
          svgUrl: { filename_disk: 'd77dca95-7cae-455b-891f-85e6785779e6.svg' },
          title: 'Join us on Telegram',
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
              title: 'GAME111wdsadasdsadgfsgfsfaddaddasdasdasasdadasdsadasdsdsfdafdaadfdas',
              description: 'https://www.baidu.com',
              url: 'https://www.baidu.com',
              imgUrl: { filename_disk: '19f90253-7d3c-4fca-8fd0-780d40818698.png' },
            },
            {
              id: '5',
              index: 1,
              title: '不删档bingogame',
              description: '不删档bingogame',
              url: 'https://bingogame-test.portkey.finance',
              imgUrl: { filename_disk: '41c87959-be1a-44ce-8ff2-fd891e8232a4.png' },
            },
            {
              id: '8',
              index: 1,
              title: 'http',
              description: '啊大赛盛大',
              url: 'http://192.168.11.160:3000',
            },
            {
              id: '7',
              index: 6,
              title: '自己的local',
              description: 'http://192.168.10.139:3000/',
              url: 'http://192.168.10.139:3000/',
            },
            {
              id: '2',
              index: 12,
              title: 'Game2',
              description: 'Game2Game2Game2Game2Game2Game2Game2Game2',
              url: '',
              imgUrl: { filename_disk: '91a87175-7270-4eb5-b38d-b516ca6676e5.png' },
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
              title: 'Dapp1',
              description: 'http://192.168.11.79:3000',
              url: 'http://192.168.11.79:3000',
              imgUrl: { filename_disk: 'ddd16436-0939-4676-a01f-86ea4c1d187f.png' },
            },
            {
              id: '6',
              index: 3,
              title: 'bingogamel33',
              description: 'http://192.168.66.240:3000/',
              url: 'http://192.168.66.240:3000/',
              imgUrl: { filename_disk: '8bfde757-c2e9-43e8-8bb5-ff18beb7d5ed.png' },
            },
            {
              id: '4',
              index: 6,
              title: 'Dapp2',
              description: 'Dapp2Dapp2Dapp2Dapp2Dapp2Dapp2Dapp2',
              url: 'Dapp2Dapp2Dapp2Dapp2Dapp2Dapp2Dapp2',
              imgUrl: { filename_disk: '58b740f5-304f-4c6a-90c3-98d928132dd3.png' },
            },
          ],
        },
      ],
    },
    tabMenuListNetMap: {},
  },
};
