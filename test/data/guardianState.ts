import { GuardiansState } from '@portkey-wallet/store/store-ca/guardians/type';

export const GuardianState: { guardians: GuardiansState } = {
  guardians: {
    verifierMap: {
      d0e2442158b870190362c8daea87a6687a59fef94937a88bd7dcb464e8e21025: {
        endPoints: ['http://192.168.66.240:16010'],
        verifierAddresses: ['2mBnRTqXMb5Afz4CWM2QakLRVDfaq2doJNRNQT1MXoi2uc6Zy3'],
        id: 'd0e2442158b870190362c8daea87a6687a59fef94937a88bd7dcb464e8e21025',
        name: 'Portkey',
        imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/Portkey.png',
      },
      '7a1063a8efa7f376c11525b30fb0eec37149ad3f39d96af8ad63e8d4f03b5241': {
        endPoints: ['http://192.168.66.240:16020'],
        verifierAddresses: ['3sWGDJhu5XDycTWXGa6r4qicYKbUyy6oZyRbRRDKGTiWTXwU4'],
        id: '7a1063a8efa7f376c11525b30fb0eec37149ad3f39d96af8ad63e8d4f03b5241',
        name: 'Minerva',
        imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/Minerva.png',
      },
      '5f64472b83dcd57f0459ed98717dc8acecdddbf4e37ac7bf024c932e6abdb5b2': {
        endPoints: ['http://192.168.66.240:16030'],
        verifierAddresses: ['2kqh5HHiL4HoGWqwBqWiTNLBnr8eAQBEJi3cjH1btPovTyGwej'],
        id: '5f64472b83dcd57f0459ed98717dc8acecdddbf4e37ac7bf024c932e6abdb5b2',
        name: 'DokewCapital',
        imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/DokewCapital.png',
      },
      '0695738e530b835a91e9dfa491439411ddf4dd3bbd442d92d1ee0d7b5cdcfa4c': {
        endPoints: ['http://192.168.66.240:16040'],
        verifierAddresses: ['5M5sG4v1H9cdB4HKsmGrPyyeoNBAEbj2moMarNidzp7xyVDZ7'],
        id: '0695738e530b835a91e9dfa491439411ddf4dd3bbd442d92d1ee0d7b5cdcfa4c',
        name: 'Gauss',
        imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/Gauss.png',
      },
      '2ded69773bd1173a5638a002912a0348ff3adcd801a5b0e58fc36699568dbda8': {
        endPoints: ['http://192.168.66.240:16050'],
        verifierAddresses: ['2bWwpsN9WSc4iKJPHYL4EZX3nfxVY7XLadecnNMar1GdSb4hJz'],
        id: '2ded69773bd1173a5638a002912a0348ff3adcd801a5b0e58fc36699568dbda8',
        name: 'CryptoGuardian',
        imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/CryptoGuardian.png',
      },
    },
    userGuardiansList: [
      {
        identifierHash: '66751f086f626e9348e5e2e4e818c0b3c45537208947c2830cbdad2c24d26cef',
        salt: '67c3720a2841460cb307b1649680af64',
        guardianAccount: 'yangkexin@portkey.finance',
        guardianType: 0,
        key: 'yangkexin@portkey.finance&7a1063a8efa7f376c11525b30fb0eec37149ad3f39d96af8ad63e8d4f03b5241',
        verifier: {
          endPoints: ['http://192.168.66.240:16020'],
          verifierAddresses: ['3sWGDJhu5XDycTWXGa6r4qicYKbUyy6oZyRbRRDKGTiWTXwU4'],
          id: '7a1063a8efa7f376c11525b30fb0eec37149ad3f39d96af8ad63e8d4f03b5241',
          name: 'Minerva',
          imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/Minerva.png',
        },
        isLoginAccount: true,
      },
      {
        identifierHash: '66751f086f626e9348e5e2e4e818c0b3c45537208947c2830cbdad2c24d26cef',
        salt: '67c3720a2841460cb307b1649680af64',
        guardianAccount: 'yangkexin@portkey.finance',
        guardianType: 0,
        key: 'yangkexin@portkey.finance&d0e2442158b870190362c8daea87a6687a59fef94937a88bd7dcb464e8e21025',
        verifier: {
          endPoints: ['http://192.168.66.240:16010'],
          verifierAddresses: ['2mBnRTqXMb5Afz4CWM2QakLRVDfaq2doJNRNQT1MXoi2uc6Zy3'],
          id: 'd0e2442158b870190362c8daea87a6687a59fef94937a88bd7dcb464e8e21025',
          name: 'Portkey',
          imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/Portkey.png',
        },
        isLoginAccount: false,
      },
    ],
    userGuardianStatus: {
      'yangkexin@portkey.finance&7a1063a8efa7f376c11525b30fb0eec37149ad3f39d96af8ad63e8d4f03b5241': {
        identifierHash: '66751f086f626e9348e5e2e4e818c0b3c45537208947c2830cbdad2c24d26cef',
        salt: '67c3720a2841460cb307b1649680af64',
        guardianAccount: 'yangkexin@portkey.finance',
        guardianType: 0,
        key: 'yangkexin@portkey.finance&7a1063a8efa7f376c11525b30fb0eec37149ad3f39d96af8ad63e8d4f03b5241',
        verifier: {
          endPoints: ['http://192.168.66.240:16020'],
          verifierAddresses: ['3sWGDJhu5XDycTWXGa6r4qicYKbUyy6oZyRbRRDKGTiWTXwU4'],
          id: '7a1063a8efa7f376c11525b30fb0eec37149ad3f39d96af8ad63e8d4f03b5241',
          name: 'Minerva',
          imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/Minerva.png',
        },
        isLoginAccount: true,
      },
      'yangkexin@portkey.finance&d0e2442158b870190362c8daea87a6687a59fef94937a88bd7dcb464e8e21025': {
        identifierHash: '66751f086f626e9348e5e2e4e818c0b3c45537208947c2830cbdad2c24d26cef',
        salt: '67c3720a2841460cb307b1649680af64',
        guardianAccount: 'yangkexin@portkey.finance',
        guardianType: 0,
        key: 'yangkexin@portkey.finance&d0e2442158b870190362c8daea87a6687a59fef94937a88bd7dcb464e8e21025',
        verifier: {
          endPoints: ['http://192.168.66.240:16010'],
          verifierAddresses: ['2mBnRTqXMb5Afz4CWM2QakLRVDfaq2doJNRNQT1MXoi2uc6Zy3'],
          id: 'd0e2442158b870190362c8daea87a6687a59fef94937a88bd7dcb464e8e21025',
          name: 'Portkey',
          imageUrl: 'https://portkey-did.s3.ap-northeast-1.amazonaws.com/img/Portkey.png',
        },
        isLoginAccount: false,
      },
    },
  },
};
