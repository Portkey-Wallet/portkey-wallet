import { guardiansSlice } from './slice';
import {
  resetGuardiansState,
  setVerifierListAction,
  setGuardiansAction,
  setCurrentGuardianAction,
  setUserGuardianStatus,
  setUserGuardianItemStatus,
  setPreGuardianAction,
  setOpGuardianAction,
  resetUserGuardianStatus,
  setUserGuardianSessionIdAction,
  resetGuardians,
} from './actions';
import { VerifyStatus } from 'packages/types/verifier';
import { describe, test, expect } from '@jest/globals';

const reducer = guardiansSlice.reducer;

const mockUserGuardiansListItem1 = {
  guardianAccount: '1@q.com',
  guardianType: 0,
  isLoginAccount: true,
  key: '1@q.com&Gauss',
  identifierHash: 'identifierHash1@q.com',
  salt: 'salt',
  verifier: {
    id: 'Gauss',
    imageUrl: 'https://x/Gauss.png',
    name: 'Gauss',
  },
  guardianIdentifier: '1@q.com',
  isLoginGuardian: true,
  type: 'Email',
  verifierId: 'Gauss',
  status: undefined,
};
const mockUserGuardiansListItem2 = {
  guardianAccount: '2@q.com',
  guardianType: 0,
  isLoginAccount: true,
  key: '2@q.com&Gauss',
  identifierHash: 'identifierHash2@q.com',
  salt: 'salt',
  verifier: {
    id: 'Gauss',
    imageUrl: 'https://x/Gauss.png',
    name: 'Gauss',
  },
  guardianIdentifier: '2@q.com',
  isLoginGuardian: true,
  type: 'Email',
  verifierId: 'Gauss',
  status: undefined,
};
const mockUserGuardiansListItem3 = {
  guardianAccount: '3@q.com',
  guardianType: 0,
  isLoginAccount: true,
  key: '3@q.com&Gauss',
  identifierHash: 'identifierHash3@q.com',
  salt: 'salt',
  verifier: {
    id: 'Gauss',
    imageUrl: 'https://x/Gauss.png',
    name: 'Gauss',
  },
  guardianIdentifier: '3@q.com',
  isLoginGuardian: true,
  type: 'Email',
  verifierId: 'Gauss',
  status: 'verified' as VerifyStatus,
};
const mockVerifierItem = {
  id: 'Gauss',
  imageUrl: 'https://x/Gauss.png',
  name: 'Gauss',
};
const mockUserGuardianStatus = {
  '1@q.com&Gauss': {
    guardianAccount: '1@q.com',
    guardianType: 0,
    isLoginAccount: true,
    key: '1@q.com&Gauss',
    identifierHash: 'identifierHash',
    salt: 'salt',
    verifier: {
      id: 'Gauss',
      imageUrl: 'https://x/Gauss.png',
      name: 'Gauss',
    },
  },
  '2@q.com&Minerva': {
    guardianAccount: '2@q.com',
    guardianType: 0,
    isLoginAccount: false,
    key: '2@q.com&Minerva',
    identifierHash: 'identifierHash',
    salt: 'salt',
    verifier: {
      id: 'Minerva',
      imageUrl: 'https://x/Minerva.png',
      name: 'Minerva',
    },
  },
};
const mockCurrentGuardian = {
  ...mockUserGuardiansListItem1,
};
const mockVerifierMap = {
  Gauss: { ...mockVerifierItem },
};
const mockGuardianAccounts = [
  {
    guardianIdentifier: '1@q.com',
    identifierHash: 'identifierHash1@q.com',
    isLoginGuardian: true,
    salt: 'salt',
    type: 'Email',
    verifierId: 'Gauss',
  },
  {
    guardianIdentifier: '2@q.com',
    identifierHash: 'identifierHash2@q.com',
    isLoginGuardian: true,
    salt: 'salt',
    type: 'Email',
    verifierId: 'Gauss',
  },
];

describe('resetGuardiansState', () => {
  test('State will be a empty object', () => {
    const state = reducer(
      {
        verifierMap: mockVerifierMap,
      },
      resetGuardiansState(),
    );
    expect(state).toEqual({});
  });
});

describe('resetGuardians', () => {
  test('State only contains the verifierMap property ', () => {
    const state = reducer(
      {
        currentGuardian: mockCurrentGuardian,
        verifierMap: mockVerifierMap,
      },
      resetGuardians(),
    );
    expect(Object.keys(state)).toHaveLength(1);
    expect(state).toHaveProperty('verifierMap');
  });
});

describe('setVerifierListAction', () => {
  test('Action.payload is null, verifierMap should be an empty object', () => {
    expect(reducer({ verifierMap: mockVerifierMap }, setVerifierListAction(null))).toMatchObject({ verifierMap: {} });
  });
  test('Action.payload exist', () => {
    expect(reducer({ verifierMap: {} }, setVerifierListAction([mockVerifierItem]))).toEqual({
      verifierMap: {
        Gauss: mockVerifierItem,
      },
    });
  });
});

describe('setGuardiansAction', () => {
  test('Action.payload is null, userGuardiansList and userGuardianStatus will be reset', () => {
    expect(
      reducer(
        {
          userGuardiansList: [mockUserGuardiansListItem1],
          userGuardianStatus: mockUserGuardianStatus,
        },
        setGuardiansAction(null),
      ),
    ).toEqual({ userGuardiansList: [], userGuardianStatus: {} });
  });
  test('Action.payload exist, userGuardianStatus exist', () => {
    const mockGuardianAccounts = [
      {
        guardianIdentifier: '',
        identifierHash: '1@q.com',
        isLoginGuardian: true,
        salt: 'salt',
        type: 'Email',
        verifierId: 'Gauss',
      },
      {
        guardianIdentifier: '2@q.com',
        identifierHash: 'identifierHash2@q.com',
        isLoginGuardian: true,
        salt: 'salt',
        type: 'Email',
        verifierId: 'Gauss',
      },
    ];
    const mockUserGuardiansListItem1 = {
      guardianAccount: '1@q.com',
      guardianType: 0,
      isLoginAccount: true,
      key: '&Gauss',
      identifierHash: '1@q.com',
      salt: 'salt',
      verifier: {
        id: 'Gauss',
        imageUrl: 'https://x/Gauss.png',
        name: 'Gauss',
      },
      guardianIdentifier: '',
      isLoginGuardian: true,
      type: 'Email',
      verifierId: 'Gauss',
    };
    expect(
      reducer(
        {
          verifierMap: mockVerifierMap,
          userGuardiansList: [],
          userGuardianStatus: {
            '3@q.com&Gauss': mockUserGuardiansListItem3,
          },
        },
        setGuardiansAction({
          guardianList: {
            guardians: mockGuardianAccounts,
          },
          managerInfos: [
            {
              address: 'address',
              extraData: 'extraData',
            },
          ],
        }),
      ),
    ).toEqual({
      verifierMap: mockVerifierMap,
      userGuardiansList: [mockUserGuardiansListItem1, mockUserGuardiansListItem2],
      userGuardianStatus: {
        '&Gauss': mockUserGuardiansListItem1,
        '2@q.com&Gauss': mockUserGuardiansListItem2,
        '3@q.com&Gauss': mockUserGuardiansListItem3,
      },
      guardianExpiredTime: undefined,
    });
  });
  test('Action.payload exist, userGuardianStatus does not exist', () => {
    expect(
      reducer(
        {
          verifierMap: mockVerifierMap,
          userGuardiansList: [],
        },
        setGuardiansAction({
          guardianList: {
            guardians: mockGuardianAccounts,
          },
          managerInfos: [
            {
              address: 'address',
              extraData: 'extraData',
            },
          ],
        }),
      ),
    ).toEqual({
      verifierMap: mockVerifierMap,
      userGuardiansList: [mockUserGuardiansListItem1, mockUserGuardiansListItem2],
      userGuardianStatus: {
        '1@q.com&Gauss': mockUserGuardiansListItem1,
        '2@q.com&Gauss': mockUserGuardiansListItem2,
        guardianExpiredTime: undefined,
      },
    });
  });
});

describe('setPreGuardianAction', () => {
  test('Action.payload is null, preGuardian will be reset', () => {
    expect(reducer({ preGuardian: mockCurrentGuardian }, setPreGuardianAction())).toEqual({
      preGuardian: undefined,
    });
  });
  test('Action.payload exist, userGuardianStatus exist', () => {
    expect(
      reducer(
        {
          preGuardian: undefined,
          userGuardianStatus: {
            '1@q.com&Gauss': {
              ...mockUserGuardiansListItem1,
              status: undefined,
            },
          },
        },
        setPreGuardianAction(mockCurrentGuardian),
      ),
    ).toEqual({
      userGuardianStatus: {
        '1@q.com&Gauss': {
          ...mockUserGuardiansListItem1,
          status: undefined,
        },
      },
      preGuardian: { ...mockCurrentGuardian, status: undefined },
    });
  });
  test('Action.payload exist, userGuardianStatus does not exist', () => {
    expect(
      reducer(
        {
          preGuardian: undefined,
        },
        setPreGuardianAction(mockCurrentGuardian),
      ),
    ).toEqual({
      preGuardian: { ...mockCurrentGuardian, status: undefined },
    });
  });
});

describe('setOpGuardianAction', () => {
  test('Action.payload is null, opGuardian will be reset', () => {
    expect(reducer({ opGuardian: mockCurrentGuardian }, setOpGuardianAction())).toEqual({
      opGuardian: undefined,
    });
  });
  test('Action.payload exist, userGuardianStatus exist', () => {
    expect(
      reducer(
        {
          opGuardian: undefined,
          userGuardianStatus: {
            '1@q.com&Gauss': {
              ...mockUserGuardiansListItem1,
              status: undefined,
            },
          },
        },
        setOpGuardianAction(mockCurrentGuardian),
      ),
    ).toEqual({
      userGuardianStatus: {
        '1@q.com&Gauss': {
          ...mockUserGuardiansListItem1,
          status: undefined,
        },
      },
      opGuardian: { ...mockCurrentGuardian, status: undefined },
    });
  });
  test('Action.payload exist, userGuardianStatus does not exist', () => {
    expect(
      reducer(
        {
          opGuardian: undefined,
        },
        setOpGuardianAction(mockCurrentGuardian),
      ),
    ).toEqual({
      opGuardian: { ...mockCurrentGuardian, status: undefined },
    });
  });
});

describe('setCurrentGuardianAction', () => {
  test('This action will update currentGuardian and userGuardianStatus', () => {
    const guardianItem = {
      key: '1@q.com&Gauss',
      guardianType: 0,
      identifierHash: 'identifierHash1@q.com',
      guardianAccount: '1@q.com',
      isLoginAccount: false,
      salt: 'salt',
    };
    const payload = {
      ...guardianItem,
      key: '1@q.com&Gauss',
      status: 'Verified',
    };
    expect(
      reducer(
        {
          currentGuardian: guardianItem,
          userGuardianStatus: {
            '1@q.com&Gauss': guardianItem,
          },
        },
        setCurrentGuardianAction(payload),
      ),
    ).toEqual({
      currentGuardian: { ...guardianItem, status: 'Verified' },
      userGuardianStatus: {
        '1@q.com&Gauss': {
          ...guardianItem,
          status: 'Verified',
        },
      },
    });
    expect(
      reducer(
        {
          currentGuardian: guardianItem,
        },
        setCurrentGuardianAction(payload),
      ),
    ).toEqual({
      currentGuardian: { ...guardianItem, status: 'Verified' },
      userGuardianStatus: {
        '1@q.com&Gauss': {
          ...guardianItem,
          status: 'Verified',
        },
      },
    });
  });
});

describe('setUserGuardianStatus', () => {
  test('this action will update userGuardianStatus', () => {
    const payload = {
      '1@q.com&Gauss': {
        key: '1@q.com&Gauss',
        isLoginAccount: false,
        guardianAccount: '1@q.com',
        guardianType: 0,
        identifierHash: 'identifierHash1@q.com',
        salt: 'salt',
      },
    };
    expect(reducer({ userGuardianStatus: {} }, setUserGuardianStatus(payload))).toEqual({
      userGuardianStatus: payload,
    });
  });
});

describe('setUserGuardianItemStatus', () => {
  const userGuardianStatus = {
    '1@q.com&Gauss': {
      key: '1@q.com&Gauss',
      isLoginAccount: false,
      guardianAccount: '1@q.com',
      guardianType: 0,
      salt: 'salt',
      identifierHash: 'identifierHash1@q.com',
    },
  };
  const payload = {
    key: '1@q.com&Gauss',
    signature: 'signature',
    identifierHash: 'identifierHash1@q.com',
    verificationDoc: 'verificationDoc',
  };
  test('The key does not match, then there will throw an error', () => {
    expect(() =>
      reducer(
        { userGuardianStatus },
        setUserGuardianItemStatus({
          ...payload,
          key: '2@q.com&Gauss',
          status: 'Verifying' as VerifyStatus,
        }),
      ),
    ).toThrow("Can't find this item");
  });
  test('The key does not match, userGuardianStatus does not exist', () => {
    expect(() =>
      reducer(
        { userGuardianStatus: undefined },
        setUserGuardianItemStatus({
          ...payload,
          key: '2@q.com&Gauss',
          status: 'Verifying' as VerifyStatus,
        }),
      ),
    ).toThrow;
  });
  test('The key exists, then there will be updated guardianItemStatus', () => {
    const payload = {
      key: '1@q.com&Gauss',
      signature: 'signature',
      verificationDoc: 'verificationDoc',
    };
    expect(
      reducer(
        { userGuardianStatus, guardianExpiredTime: 1111 },
        setUserGuardianItemStatus({
          ...payload,
          key: '1@q.com&Gauss',
          status: 'Verifying' as VerifyStatus,
        }),
      ),
    ).toEqual({
      userGuardianStatus: {
        '1@q.com&Gauss': {
          isLoginAccount: false,
          guardianAccount: '1@q.com',
          guardianType: 0,
          key: '1@q.com&Gauss',
          salt: 'salt',
          status: 'Verifying',
          signature: 'signature',
          verificationDoc: 'verificationDoc',
          identifierHash: '',
        },
      },
      guardianExpiredTime: 1111,
    });
  });
  test('The key exists, then generate guardianExpiredTime', () => {
    const state = reducer(
      { userGuardianStatus, guardianExpiredTime: undefined },
      setUserGuardianItemStatus({
        ...payload,
        status: 'Verified' as VerifyStatus,
      }),
    );
    expect(state).toMatchObject({
      userGuardianStatus,
      guardianExpiredTime: expect.any(Number),
    });
  });
});

describe('resetUserGuardianStatus', () => {
  test('this action will reset userGuardianStatus', () => {
    expect(reducer({ userGuardianStatus: mockUserGuardianStatus }, resetUserGuardianStatus())).toEqual({
      userGuardianStatus: {},
    });
  });
});

describe('setUserGuardianSessionIdAction', () => {
  const payload = {
    key: '1@q.com&Gauss',
    verifierInfo: {
      sessionId: 'sessionId',
      endPoint: 'endPoint',
    },
  };
  const userGuardianStatus = {
    '1@q.com&Gauss': {
      isLoginAccount: false,
      guardianAccount: '1@q.com',
      guardianType: 0,
      key: '1@q.com&Gauss',
      identifierHash: 'identifierHash1@q.com',
      salt: 'salt',
    },
  };
  const guardian2 = {
    isLoginAccount: false,
    guardianAccount: '2@q.com',
    guardianType: 0,
    key: '2@q.com&Gauss',
    identifierHash: 'identifierHash2@q.com',
    salt: 'salt',
  };
  const newUserGuardianStatus = {
    '1@q.com&Gauss': {
      isLoginAccount: false,
      guardianAccount: '1@q.com',
      guardianType: 0,
      key: '1@q.com&Gauss',
      identifierHash: 'identifierHash1@q.com',
      salt: 'salt',
      verifierInfo: {
        sessionId: 'sessionId',
        endPoint: 'endPoint',
      },
    },
  };
  test('The key does not exist', () => {
    const currentGuardian = guardian2;
    expect(() => reducer({ currentGuardian }, setUserGuardianSessionIdAction(payload))).toThrow("Can't find this item");
    expect(() => reducer({ userGuardianStatus, currentGuardian }, setUserGuardianSessionIdAction(payload))).toThrow;
  });
  test('The key exists, currentGuardian`key is equal to key', () => {
    const currentGuardian = {
      isLoginAccount: false,
      guardianAccount: '1@q.com',
      guardianType: 0,
      key: '1@q.com&Gauss',
      identifierHash: 'identifierHash1@q.com',
      salt: 'salt',
    };
    expect(reducer({ userGuardianStatus, currentGuardian }, setUserGuardianSessionIdAction(payload))).toEqual({
      userGuardianStatus: newUserGuardianStatus,
      currentGuardian: {
        ...currentGuardian,
        verifierInfo: {
          sessionId: 'sessionId',
          endPoint: 'endPoint',
        },
      },
    });
  });
  test('The key exists, currentGuardian`key is not equal to key', () => {
    const currentGuardian = guardian2;
    expect(reducer({ userGuardianStatus, currentGuardian }, setUserGuardianSessionIdAction(payload))).toEqual({
      userGuardianStatus: newUserGuardianStatus,
      currentGuardian,
    });
    expect(reducer({ userGuardianStatus }, setUserGuardianSessionIdAction(payload))).toEqual({
      userGuardianStatus: newUserGuardianStatus,
    });
  });
});
