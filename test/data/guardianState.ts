import { GuardiansState } from '@portkey-wallet/store/store-ca/guardians/type';

export const GuardianState: { guardians: GuardiansState } = {
  guardians: {
    verifierMap: {
      'd0e...2025': {
        endPoints: ['http://localhost:8888'],
        verifierAddresses: ['2mBn...6Zy3'],
        id: 'd0e...2025',
        name: 'Portkey',
        imageUrl: 'https://localhost/img/Portkey.png',
      },
      '7a1...5241': {
        endPoints: ['http://localhost:8888'],
        verifierAddresses: ['3sWG...XwU4'],
        id: '7a1...5241',
        name: 'Minerva',
        imageUrl: 'https://localhost/img/Minerva.png',
      },
      '5f6...b5b2': {
        endPoints: ['http://localhost:8888'],
        verifierAddresses: ['2kq...yGwej'],
        id: '5f6...b5b2',
        name: 'DokewCapital',
        imageUrl: 'https://localhost/img/DokewCapital.png',
      },
      '069...fa4c': {
        endPoints: ['http://localhost:8888'],
        verifierAddresses: ['5M5...VDZ7'],
        id: '069...fa4c',
        name: 'Gauss',
        imageUrl: 'https://localhost/img/Gauss.png',
      },
      '2de...bda8': {
        endPoints: ['http://localhost:8888'],
        verifierAddresses: ['2bW...4hJz'],
        id: '2de...bda8',
        name: 'CryptoGuardian',
        imageUrl: 'https://localhost/img/CryptoGuardian.png',
      },
    },
    userGuardiansList: [
      {
        identifierHash: '667...6cef',
        salt: '67c...af64',
        guardianAccount: 'aurora@portkey.finance',
        guardianType: 0,
        key: 'aurora@portkey.finance&7a1...5241',
        verifier: {
          endPoints: ['http://localhost:8888'],
          verifierAddresses: ['3sW...XwU4'],
          id: '7a1...5241',
          name: 'Minerva',
          imageUrl: 'https://localhost/img/Minerva.png',
        },
        isLoginAccount: true,
      },
      {
        identifierHash: '667...6cef',
        salt: '67c...af64',
        guardianAccount: 'aurora@portkey.finance',
        guardianType: 0,
        key: 'aurora@portkey.finance&d0e...2025',
        verifier: {
          endPoints: ['http://localhost:8888'],
          verifierAddresses: ['2mBn...6Zy3'],
          id: 'd0e...2025',
          name: 'Portkey',
          imageUrl: 'https://localhost/img/Portkey.png',
        },
        isLoginAccount: false,
      },
    ],
    userGuardianStatus: {
      'aurora@portkey.finance&7a1...5241': {
        identifierHash: '667...6cef',
        salt: '67c...af64',
        guardianAccount: 'aurora@portkey.finance',
        guardianType: 0,
        key: 'aurora@portkey.finance&7a1...5241',
        verifier: {
          endPoints: ['http://localhost:8888'],
          verifierAddresses: ['3sW...XwU4'],
          id: '7a1...5241',
          name: 'Minerva',
          imageUrl: 'https://localhost/img/Minerva.png',
        },
        isLoginAccount: true,
      },
      'aurora@portkey.finance&d0e...2025': {
        identifierHash: '667...6cef',
        salt: '67c...af64',
        guardianAccount: 'aurora@portkey.finance',
        guardianType: 0,
        key: 'aurora@portkey.finance&d0e...2025',
        verifier: {
          endPoints: ['http://localhost:8888'],
          verifierAddresses: ['2mBn...6Zy3'],
          id: 'd0e...2025',
          name: 'Portkey',
          imageUrl: 'https://localhost/img/Portkey.png',
        },
        isLoginAccount: false,
      },
    },
  },
};
