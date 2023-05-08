import CommonSlice, { setIsNotLessThan768, setIsPopupInit, setIsPrompt } from './slice';

const reducer = CommonSlice.reducer;
const initialState = {
  isPrompt: false,
  isPopupInit: true,
  isNotLessThan768: false,
};
describe('setIsPrompt', () => {
  test('Prev isPrompt false, set isPrompt true', () => {
    expect(reducer(initialState, setIsPrompt(true))).toHaveProperty('isPrompt', true);
  });
  test('Prev isPrompt false, set isPrompt false', () => {
    expect(reducer(initialState, setIsPrompt(false))).toHaveProperty('isPrompt', false);
  });
});

describe('setIsPopupInit', () => {
  test('Prev isPopupInit true, set isPopupInit true', () => {
    expect(reducer(initialState, setIsPopupInit(true))).toHaveProperty('isPopupInit', true);
  });
  test('Prev isPopupInit true, set isPopupInit false', () => {
    expect(reducer(initialState, setIsPopupInit(false))).toHaveProperty('isPopupInit', false);
  });
});

describe('setIsNotLessThan768', () => {
  test('Prev isNotLessThan768 false, set isNotLessThan768 true', () => {
    expect(reducer(initialState, setIsNotLessThan768(true))).toHaveProperty('isNotLessThan768', true);
  });
  test('Prev isNotLessThan768 false, set isNotLessThan768 false', () => {
    expect(reducer(initialState, setIsNotLessThan768(false))).toHaveProperty('isNotLessThan768', false);
  });
});
