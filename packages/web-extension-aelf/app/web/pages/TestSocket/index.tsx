// import React from 'react';

import Socket from '@portkey-wallet/socket/socket-did';
import { SocketUrl } from '@portkey-wallet/constants/constants-ca/socket';
// import { randomId } from '@portkey-wallet/utils';
// import AElf from 'aelf-sdk';
import { Button, Divider } from 'antd';
import { request } from '@portkey-wallet/api/api-did';

// const wallet = AElf.wallet.createNewWallet();
const clientId = 'aelf1';
// const requestId = 'aelf2';

// Socket.doOpen({
//   url: SocketUrl,
//   clientId: clientId,
// });

// Socket.onCaAccountRegister(
//   {
//     clientId,
//     requestId: requestId,
//   },
//   (data) => {
//     console.log(data, 'Socket ===Sin');
//   },
// );

// Socket.onCaAccountRecover(
//   {
//     clientId,
//     requestId: requestId,
//   },
//   (data) => {
//     console.log(data, 'Socket ===Sin');
//   },
// );

export default function TestSocket() {
  return (
    <div>
      <Button
        onClick={async () => {
          const result = await request.wallet.hubPing({
            method: 'post',
            params: {
              context: {
                clientId,
                requestId: clientId,
              },
            },
          });
          console.log(result, clientId, 'result===');
        }}>
        hubPing
      </Button>
      <Divider />
      <Button
        onClick={() => {
          try {
            Socket.stop();
          } catch (error) {
            console.log(error, 'Socket stop error ==');
          }
        }}>
        Stop
      </Button>
      <Divider />
      <Button
        onClick={async () => {
          const res = await Socket.doOpen({
            url: SocketUrl,
            clientId: clientId,
          });
          console.log(res, 'Socket===reStart');
        }}>
        reStart
      </Button>
      <Divider />
      <Button
        onClick={async () => {
          try {
            // const result = await request.wallet.getResponse({
            //   method: 'post',
            // });
            // console.log(result, clientId, 'result===');
          } catch (error) {
            console.log('Socket = getResponse = error', error);
          }
        }}>
        getResponse
      </Button>

      <Divider />
    </div>
  );
}
