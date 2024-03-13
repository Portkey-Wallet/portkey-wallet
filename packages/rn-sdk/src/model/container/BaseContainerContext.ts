import { createContext } from 'react';

const BaseContainerContext = createContext<{ entryName: string }>({
  entryName: '',
});

export default BaseContainerContext;
