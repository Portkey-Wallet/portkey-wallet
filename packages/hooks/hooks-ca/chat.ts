import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type selectedItemsMapType<T> = Map<string, T>;

function useSelectedItemsMap<T>(): {
  selectedItemsMap: selectedItemsMapType<T>;
  setSelectedItemsMap: Dispatch<SetStateAction<selectedItemsMapType<T>>>;
  onPressItem: (id: string, item: T) => void;
} {
  const [selectedItemsMap, setSelectedItemsMap] = useState<Map<string, T>>(new Map());

  const onPressItem = useCallback((id: string, item: T) => {
    setSelectedItemsMap(pre => {
      const newMap = new Map(pre);
      pre.has(id) ? newMap.delete(id) : newMap.set(id, item);
      return newMap;
    });
  }, []);

  return { selectedItemsMap, setSelectedItemsMap, onPressItem };
}

export { useSelectedItemsMap };
