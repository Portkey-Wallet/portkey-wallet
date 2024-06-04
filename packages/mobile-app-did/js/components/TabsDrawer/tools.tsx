import { createContext } from 'react';

export interface ITabContext {
  currentTabLength: number;
  showAllTabs: () => void;
}
export const tabContextDefaultValue = {
  currentTabLength: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showAllTabs: () => {},
};

export const TabContext = createContext<ITabContext>(tabContextDefaultValue);

export type IDrawerContentRef = ITabContext;
