import { useEffect, useCallback } from 'react';
import qs from 'query-string';
import { message } from 'antd';

export default function AppleAuth() {
  const handler = useCallback(() => {
    const { id_token } = qs.parse(location.search);
    const response = {
      access_token: id_token,
    };
    window.portkey_did?.request({
      method: 'portkey_socialLogin',
      params: {
        response,
      },
    });
  }, []);

  useEffect(() => {
    if (!window.portkey_did) {
      const ids = setTimeout(() => {
        clearTimeout(ids);
        if (!window.portkey_did) message.error('Timeout, please download and install the Portkey did extension');
        handler();
      }, 500);
      return;
    }
    handler();
  }, [handler]);

  return <div></div>;
}
