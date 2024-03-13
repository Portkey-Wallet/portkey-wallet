import { contactSlice } from './slice';
import * as utils from './utils';
import { configureStore } from '@reduxjs/toolkit';
import {
  addContactAction,
  deleteContactAction,
  editContactAction,
  fetchContactListAsync,
  resetContact,
} from './actions';
import {
  getContactList as getContactListEs,
  getContactEventList as getContactEventListEs,
} from 'packages/api/api-did/es/utils';
import { ChainId } from 'packages/types';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const reducer = contactSlice.reducer;
jest.mock('packages/api/api-did/es/utils');
beforeEach(() => {
  jest.restoreAllMocks();
});
describe('fetchContactListAsync', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  const mockInitState = {
    wallet: {
      currentNetwork: 'TESTNET',
    },
    contact: {
      lastModified: 0,
      contactIndexList: utils.getInitContactIndexList(),
      contactMap: {},
    },
  };
  const mockStore = configureStore({
    reducer: {
      contact: reducer,
      wallet: reducer,
    },
    preloadedState: mockInitState as any,
  });
  test('At the first time, to get contactList successful', async () => {
    const mockFetchedContacts = {
      totalCount: 1,
      items: [
        {
          id: 'A',
          index: 'A',
          name: 'Aa',
          addresses: [
            {
              chainId: 'AELF' as ChainId,
              address: 'addressA',
            },
          ],
          modificationTime: 123,
          isDeleted: false,
          userId: 'A',
        },
      ],
    };
    jest.mocked(getContactListEs).mockResolvedValue(mockFetchedContacts);
    await mockStore.dispatch(fetchContactListAsync(true));
    const newState = mockStore.getState();
    expect(newState.contact.contactIndexList[0].contacts).toEqual(mockFetchedContacts.items);
  });
  test('To get contactList, return empty array, will throw Error', async () => {
    const mockFetchedContacts = {
      totalCount: 0,
      items: [],
    };
    jest.mocked(getContactListEs).mockResolvedValue(mockFetchedContacts);
    const res = await mockStore.dispatch(fetchContactListAsync(true));
    expect(res.type).toBe('contact/fetchContactListAsync/rejected');
  });
  test('Multiply get contactList, will update contactIndexList', async () => {
    const mockFetchedContacts = {
      totalCount: 1,
      items: [
        {
          id: 'B',
          index: 'B',
          name: 'Bb',
          addresses: [
            {
              chainId: 'AELF' as ChainId,
              address: 'addressB',
            },
          ],
          modificationTime: 123,
          isDeleted: false,
          userId: 'B',
        },
      ],
    };
    jest.mocked(getContactEventListEs).mockResolvedValue(mockFetchedContacts);
    await mockStore.dispatch(fetchContactListAsync());
    const newState = mockStore.getState();
    expect(newState.contact.contactIndexList[1].contacts).toEqual(mockFetchedContacts.items);
  });
  test('Get contactList, sortContactIndexList return empty array', async () => {
    const mockFetchedContacts = {
      totalCount: 0,
      items: [
        {
          id: 'A',
          index: 'A',
          name: 'Aa',
          addresses: [
            {
              chainId: 'AELF' as ChainId,
              address: 'addressA',
            },
          ],
          modificationTime: 123,
          isDeleted: false,
          userId: 'A',
        },
      ],
    };
    jest.spyOn(utils, 'sortContactIndexList').mockReturnValue([]);
    jest.mocked(getContactListEs).mockResolvedValue(mockFetchedContacts);
    await mockStore.dispatch(fetchContactListAsync(true));
    const newState = mockStore.getState();
    expect(newState.contact.contactIndexList).toEqual(utils.getInitContactIndexList());
  });
});

describe('addContactAction', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  const mockContact = {
    id: 'A',
    index: 'A',
    name: 'Aa',
    addresses: [
      {
        chainId: 'AELF' as ChainId,
        address: 'addressA',
      },
    ],
    modificationTime: 123,
    isDeleted: false,
    userId: 'A',
  };
  test('The state is empty, will add a new contact', () => {
    const res = reducer(
      {
        contactIndexList: utils.getInitContactIndexList(),
        contactMap: {},
        lastModified: 0,
      },
      addContactAction(mockContact),
    );
    expect(res.contactIndexList[0].contacts).toEqual([mockContact]);
  });
});

describe('editContactAction', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  const mockContact = {
    id: 'A',
    index: 'A',
    name: 'Aa',
    addresses: [
      {
        chainId: 'AELF' as ChainId,
        address: 'addressA',
      },
    ],
    modificationTime: 123,
    isDeleted: false,
    userId: 'A',
  };
  test('The contact is exist, will edit it', () => {
    const initContact = utils.getInitContactIndexList();
    initContact.shift();
    const res = reducer(
      {
        contactIndexList: [{ index: 'A', contacts: [mockContact] }, ...initContact],
        contactMap: {},
        lastModified: 0,
      },
      editContactAction({ ...mockContact, name: 'AA' }),
    );
    expect(res.contactIndexList[0].contacts).toEqual([{ ...mockContact, name: 'AA' }]);
  });
  test('The contact is exist, modificationTime is lasted, will don not edit it', () => {
    const initContact = utils.getInitContactIndexList();
    initContact.shift();
    const res = reducer(
      {
        contactIndexList: [{ index: 'A', contacts: [mockContact] }, ...initContact],
        contactMap: {},
        lastModified: 0,
      },
      editContactAction({ ...mockContact, name: 'AA', modificationTime: 1 }),
    );
    expect(res.contactIndexList[0].contacts).toEqual([mockContact]);
  });

  test('The contact is exist, but index not match, will add new a contact', () => {
    const initContact = utils.getInitContactIndexList();
    initContact.shift();
    const res = reducer(
      {
        contactIndexList: [{ index: 'A', contacts: [mockContact] }, ...initContact],
        contactMap: {},
        lastModified: 0,
      },
      editContactAction({ ...mockContact, name: 'AA', index: 'B' }),
    );
    expect(res.contactIndexList[1].contacts).toEqual([{ ...mockContact, name: 'AA', index: 'B' }]);
  });
});

describe('deleteContactAction', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  const mockContact = {
    id: 'A',
    index: 'A',
    name: 'Aa',
    addresses: [
      {
        chainId: 'AELF' as ChainId,
        address: 'addressA',
      },
    ],
    modificationTime: 123,
    isDeleted: true,
    userId: 'A',
  };
  test('The contact is exist, will edit it', () => {
    const initContact = utils.getInitContactIndexList();
    initContact.shift();
    const res = reducer(
      {
        contactIndexList: [{ index: 'A', contacts: [mockContact] }, ...initContact],
        contactMap: {},
        lastModified: 0,
      },
      deleteContactAction(mockContact),
    );
    expect(res.contactIndexList[0].contacts).toEqual([]);
  });
});
describe('resetContact', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test('reset contact', () => {
    const mockInitState = {
      lastModified: 0,
      contactIndexList: utils.getInitContactIndexList(),
      contactMap: {},
    };
    const res = reducer(mockInitState, resetContact());
    expect(res.contactMap).toEqual({});
    expect(res.lastModified).toBe(0);
  });
});
