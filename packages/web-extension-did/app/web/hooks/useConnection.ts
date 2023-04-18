import { useCallback, useEffect, useState } from 'react';
import { ConnectionsType } from 'types/storage';
import { apis } from 'utils/BrowserApis';
import { getLocalStorage } from 'utils/storage/chromeStorage';
import storage from 'utils/storage/storage';

const useConnection = () => {
  const [connections, setConnections] = useState<ConnectionsType>();

  const getConnections = useCallback(async () => {
    const connections = (await getLocalStorage('connections')) ?? {};
    setConnections(connections);
  }, []);

  useEffect(() => {
    getConnections();
    apis.storage.onChanged.addListener((changes) => {
      if (storage.connections in changes) {
        const connections = changes[storage.connections].newValue;
        setConnections(connections);
      }
    });
  }, [getConnections]);
  return connections;

  // return useMemo(() => {
  //   if (!url) return;
  //   const origin = new URL(url).origin;
  //   return origin ? connections?.[origin]?.permission : undefined;
  // }, [connections, url]);
};
export default useConnection;
