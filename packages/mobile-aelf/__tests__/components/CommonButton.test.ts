jest.mock('react-native', () => ({
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
}));

jest.mock(
  'assets/theme/index',
  () => ({
    darkColors: {
      bgBase1: '#000000',
      bgBase2: '#111111',
      bgBrandDefault: '#2d6cdf',
      bgBrandHover: '#1f5cc6',
      bgDangerDefault: '#d42f2f',
      bgDangerHover: '#b82828',
      borderNeutral2: '#333333',
      textBase1: '#ffffff',
      textDanger1: '#ff4d4f',
      textDisabled1: '#888888',
      textDisabled2: '#777777',
    },
    defaultColors: {
      bg5: '#f2f2f2',
      bg6: '#ffffff',
      font2: '#222222',
      font3: '#999999',
    },
  }),
  { virtual: true },
);

jest.mock(
  'assets/theme/fonts',
  () => ({
    mediumFont: {},
  }),
  { virtual: true },
);

jest.mock('utils/unit', () => ({
  pTd: (value: number) => value,
}));

import { styles } from '../../js/components/CommonButton/style';

describe('CommonButton', () => {
  test('keeps the loading icon visible with stable dimensions', () => {
    expect(styles.loadingIcon).toEqual(
      expect.objectContaining({
        width: 16,
        height: 16,
      }),
    );
  });
});
