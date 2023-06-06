import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

test('mockAsyncStorage', () => {
  expect(true).toBeTruthy();
});
