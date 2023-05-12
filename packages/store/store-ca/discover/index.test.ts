import { addRecordsItem, clearRecordsList, discoverSlice, resetDiscover, upDateRecordsItem } from './slice';

const reducer = discoverSlice.reducer;
const initialState = {
  recordsList: [],
  tabs: [],
};

describe('addRecordsItem', () => {
  test('recordsList will add a new record item', () => {
    const payload = {
      url: 'https://www.google.com',
      title: 'Google',
    };
    const res = reducer(initialState, addRecordsItem(payload));
    expect(res.recordsList).toHaveLength(1);
  });
  test('recordsList will be adjust the order', () => {
    const state = {
      ...initialState,
      recordsList: [
        {
          url: 'https://www.google.com',
          title: 'Google',
        },
        {
          url: 'https://www.apple.com',
          title: 'Apple',
        },
      ],
    };
    const payload = {
      url: 'https://www.google.com',
      title: 'Google',
    };
    const res = reducer(state, addRecordsItem(payload));
    expect(res.recordsList).toHaveLength(2);
    expect(res.recordsList[0].title).toBe('Apple');
  });
});

describe('upDateRecordsItem', () => {
  const state = {
    ...initialState,
    recordsList: [
      {
        url: 'https://www.google.com',
        title: 'Google',
      },
      {
        url: 'https://www.apple.com',
        title: 'Apple',
      },
    ],
  };
  test('the record item exist, recordsList will update the record item', () => {
    const payload = {
      url: 'https://www.google.com',
      title: 'newGoogleName',
    };
    const res = reducer(state, upDateRecordsItem(payload));
    expect(res.recordsList).toHaveLength(2);
    expect(res.recordsList[0].title).toBe('newGoogleName');
  });
  test('the record item does not exist, recordsList will update the record item', () => {
    const payload = {
      url: 'https://www.google1.com',
      title: 'Google',
    };
    const res = reducer(state, upDateRecordsItem(payload));
    expect(res.recordsList).toHaveLength(2);
    expect(res.recordsList[0].title).toBe('Google');
  });
});

describe('clearRecordsList', () => {
  test('recordsList will be empty array', () => {
    const state = {
      ...initialState,
      recordsList: [
        {
          url: 'https://www.google.com',
          title: 'Google',
        },
        {
          url: 'https://www.apple.com',
          title: 'Apple',
        },
      ],
      tabs: [
        {
          tab: 'tab1',
        },
      ],
    };
    const res = reducer(state, clearRecordsList());
    expect(res.recordsList).toHaveLength(0);
    expect(res.tabs).toHaveLength(1);
  });
});

describe('resetDiscover', () => {
  test('state will be initialState', () => {
    const state = {
      ...initialState,
      recordsList: [
        {
          url: 'https://www.google.com',
          title: 'Google',
        },
        {
          url: 'https://www.apple.com',
          title: 'Apple',
        },
      ],
    };
    const res = reducer(state, resetDiscover());
    expect(res).toEqual(initialState);
  });
});
