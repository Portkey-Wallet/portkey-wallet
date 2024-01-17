import React, { useCallback, useEffect } from 'react';
import { Button, Text } from '@rneui/base';
import { ScrollView } from 'react-native-gesture-handler';
import navigationService from '../../utils/navigationService';
import SafeAreaBox from 'components/SafeAreaBox';
import ActionSheet from 'components/ActionSheet';
import { useCurrentWalletInfo, useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { CrashTest } from 'Test/CrashTest';
import Loading from 'components/Loading';
import { contractQueries } from '@portkey-wallet/graphql/index';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { getManagerAccount } from 'utils/redux';
import { useGuardiansInfo, usePin } from 'hooks/store';
import { getContractBasic } from '@portkey-wallet/contracts/utils';
import AElf from 'aelf-sdk';
import { customFetch } from '@portkey-wallet/utils/fetch';
import { useGetCurrentCAContract } from 'hooks/contract';
import { addManager } from 'utils/wallet';
import { request } from '@portkey-wallet/api/api-did';
import { useGetHolderInfo } from 'hooks/guardian';
import { useAppCommonDispatch } from '@portkey-wallet/hooks';
import { useAppCASelector } from '@portkey-wallet/hooks/hooks-ca';
import { fetchTokensPriceAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { extraDataEncode } from '@portkey-wallet/utils/device';
import { useGetDeviceInfo } from 'hooks/device';
import * as Network from 'expo-network';

import im, { RedPackageTypeEnum } from '@portkey-wallet/im';
import useEffectOnce from 'hooks/useEffectOnce';
import {
  useChannel,
  useChannelList,
  useCreateP2pChannel,
  useHideChannel,
  useMuteChannel,
  usePinChannel,
  useSendChannelMessage,
  useUnreadCount,
  useSendRedPackage,
  ICreateRedPacketParams,
} from '@portkey-wallet/hooks/hooks-ca/im';
import dayjs from 'dayjs';
import { timesDecimals } from '@portkey-wallet/utils/converter';

export default function HomeScreen() {
  const wallet = useCurrentWalletInfo();
  const getCurrentCAContract = useGetCurrentCAContract();
  const dispatch = useAppCommonDispatch();
  const activity = useAppCASelector(state => state.activity);

  const pin = usePin();
  const getDeviceInfo = useGetDeviceInfo();
  const originChainId = useOriginChainId();
  const chainInfo = useCurrentChain(originChainId);
  const getHolderInfo = useGetHolderInfo();
  const { userGuardiansList } = useGuardiansInfo();
  const createChannel = useCreateP2pChannel();
  const unreadCount = useUnreadCount();
  const { sendChannelMessage } = useSendChannelMessage();

  const { list, sendMessage, sendImage, init, next, hasNext, info } = useChannel('ef4c6a65e4774171b973503c7373b563');
  // const { list, sendMessage, sendImage, init, next, hasNext, info } = useChannel('cb911c8a381a442ba672feb70d43dd93');

  const {
    list: channelList,
    init: initChannelList,
    next: nextChannelList,
    hasNext: hasNextChannelList,
  } = useChannelList();

  const pinChannel = usePinChannel();
  const muteChannel = useMuteChannel();
  const hideChannel = useHideChannel();

  useEffect(() => {
    console.log('channelList', channelList);
  }, [channelList]);
  useEffect(() => {
    console.log('msg list', list);
  }, [list]);
  useEffect(() => {
    console.log('unreadCount', unreadCount);
  }, [unreadCount]);

  useEffectOnce(() => {
    (async () => {
      if (!pin) return;
      const account = getManagerAccount(pin);
      if (!account || !wallet.caHash) return;

      try {
        // await im.init(account, wallet.caHash);
      } catch (error) {
        console.log('im init error', error);
      }
    })();
  });

  const sendRedPackage = useSendRedPackage();
  const sendRedPackageTest = useCallback(async () => {
    // const params = {
    //   channelId: 'eff010f5d9dd4df986a20251ae634e86',
    //   type: RedPackageTypeEnum.FIXED,
    //   count: 1,
    // };

    const params = {
      // channelId: '54aadf08ab98499ea0313664dc8def96',
      // channelId: '5ff0dba5e16845b89923c2a3118c0e6f',
      // channelId: '31e10db9361f49cd923b74548c9acf2a',
      channelId: '0f1f398a16b84ca2b6e2d70691f6e8ad',
      type: RedPackageTypeEnum.P2P,
      count: 1,
    };

    try {
      const caContract = await getCurrentCAContract();
      const result = await sendRedPackage({
        chainId: 'AELF',
        symbol: 'ELF',
        totalAmount: '10000000',
        decimal: '8',
        memo: `test ${Date.now()}`,
        caContract: caContract,
        ...params,
      });
      console.log('result', result);
    } catch (error) {
      console.log('error', error);
    }
  }, [getCurrentCAContract, sendRedPackage]);

  return (
    <SafeAreaBox>
      <ScrollView>
        <Button
          title="send redPackage"
          onPress={async () => {
            for (let i = 0; i < 1; i++) {
              (async () => {
                console.log(i);
                const startTime = Date.now();
                await sendRedPackageTest();
                const EndTime = Date.now();
                console.log(i, '====time', EndTime - startTime);
              })();
            }
          }}
        />

        {/* <Button title="ActionSheet show" onPress={() => ActionSheet.show([{ title: '123' }, { title: '123' }])} />
        <Button
          title="loading show"
          onPress={() => {
            Loading.show();
            setTimeout(() => {
              Loading.hide();
            }, 5000);
          }}
        />
        <Button title="Account Settings" onPress={() => navigationService.navigate('AccountSettings')} />
        <Button
          title="getCAHolderByManager"
          onPress={async () => {
            try {
              const { caHolderManagerInfo } = await contractQueries.getCAHolderByManager('TESTNET', {
                manager: wallet.address,
              });
              console.log(caHolderManagerInfo, '=====caHolderManagerInfo');
            } catch (error) {
              console.log(error, '=====error');
            }
          }}
        />
        <Button
          title="ManagerForwardCall Transfer"
          onPress={async () => {
            if (!chainInfo || !pin) return;
            const account = getManagerAccount(pin);
            if (!account) return;
            const contract = await getContractBasic({
              contractAddress: chainInfo.caContractAddress,
              rpcUrl: chainInfo.endPoint,
              account,
            });
            const req = await contract?.callSendMethod('ManagerForwardCall', '', {
              caHash: wallet[originChainId]?.caHash,
              contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
              methodName: 'Transfer',
              args: {
                symbol: 'ELF',
                // to: '2PfWcs9yhY5xVcJPskxjtAHiKyNUbX7wyWv2NcwFJEg9iNfnPj',
                to: '2b8294NW2u7wiHg6pePWxab1He2AoMMdSE1mdbNiv7k6nXubLy',
                amount: 1 * 10 ** 8,
                memo: 'transfer address1 to address2',
              },
            });
            console.log(req, '======req');
          }}
        />
        <Button
          title="ManagerForwardCall Transfer transactionHash"
          onPress={async () => {
            if (!chainInfo || !pin) return;
            const account = getManagerAccount(pin);
            if (!account) return;
            const contract = await getContractBasic({
              contractAddress: chainInfo.caContractAddress,
              rpcUrl: chainInfo.endPoint,
              account,
            });
            const req = await contract?.callSendMethod(
              'ManagerForwardCall',
              '',
              {
                caHash: wallet[originChainId]?.caHash,
                contractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
                methodName: 'Transfer',
                args: {
                  symbol: 'ELF',
                  to: '2PfWcs9yhY5xVcJPskxjtAHiKyNUbX7wyWv2NcwFJEg9iNfnPj',
                  amount: 1 * 10 ** 8,
                  memo: 'transfer address1 to address2',
                },
              },
              { onMethod: 'transactionHash' },
            );
            console.log(req, '======req');
          }}
        />
        <Button
          title="addManager"
          onPress={async () => {
            if (!chainInfo || !pin || !wallet.caHash) return;

            const extraData = await extraDataEncode(getDeviceInfo());
            try {
              const tmpWalletInfo = AElf.wallet.createNewWallet();
              const contract = await getCurrentCAContract();
              const req = await addManager({
                contract,
                caHash: wallet.caHash,
                address: wallet.address,
                managerAddress: tmpWalletInfo.address,
                extraData,
              });
              console.log(req, '===req');
            } catch (error) {
              console.log(error, '====error');
            }
          }}
        /> */}
        {/* <Button
          title="add contact"
          onPress={async () => {
            try {
              console.log(wallet, '====wallet');
              const holderInfo = await getHolderInfo({
                caHash: 'f8e66f2ba4a17dce896b444b1ce0ac83c063481cceef81fc5460a7a0674852f4',
              });
              console.log(holderInfo, '===holderInfo');

              if (!chainInfo || !pin || !wallet[originChainId]?.caHash) return;
              const req = await request.contact.addContact({
                params: {
                  name: 'xxx',
                  addresses: [
                    {
                      chainId: 'string',
                      address: 'string',
                    },
                  ],
                },
              });
              console.log(req, '====req');
            } catch (error) {
              console.log(error, '====error-1');
            }
          }}
        /> */}
        {/* <Button
          title="add failedActivity"
          onPress={() => {
            // dispatch(addFailedActivity({ transactionId: String(Math.random()) }));
            console.log(activity);
          }}
        />
        <Button
          title="fetch token Price"
          onPress={() => {
            dispatch(fetchTokensPriceAsync({}));
          }}
        />
        <Button
          title="SelectCountry"
          onPress={() => {
            navigationService.navigate('SelectCountry');
          }}
        />
        <Button
          title="getIpAddressAsync"
          onPress={async () => {
            const ipAddress = await Network.getIpAddressAsync();
            const ipAddress2 = await customFetch('https://api.ipify.org/?format=json');
            console.log(ipAddress, ipAddress2, '======ipAddress');
          }}
        /> */}

        <Button
          title="sendMessage"
          onPress={async () => {
            // sendMessage('test message');
            const result = await im.service.sendMessage({
              toRelationId: 'eegeb-baaaa-aaaaj-35xda-cai',
              sendUuid: `${Date.now()}`,
              type: 'TEXT',
              content: `im thomas ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`,
            });
            console.log('result', result);
          }}
        />

        <Button
          title="init Message List"
          onPress={() => {
            init();
          }}
        />

        <Button
          title="next Message List"
          onPress={() => {
            console.log('hasNext', hasNext);
            next();
          }}
        />

        <Button
          title="operate true"
          onPress={async () => {
            try {
              const { channelUuid } = await createChannel('e7i7y-giaaa-aaaaj-2ooma-cai');
              const result2 = await sendChannelMessage({
                channelId: channelUuid,
                content: 'test message',
              });
              console.log('result2', result2);
              // const result = await muteChannel('0a88cea1efde493a805a0afdbf471d08', true);
              // console.log('test', result);
            } catch (error) {
              console.log('createChannel: error', error);
            }
          }}
        />

        <Button
          title="operate false"
          onPress={async () => {
            try {
              const result = await muteChannel('0a88cea1efde493a805a0afdbf471d08', false);
              console.log('test', result);
            } catch (error) {
              console.log('createChannel: error', error);
            }
          }}
        />

        <Button
          title="init Channel List"
          onPress={() => {
            initChannelList();
          }}
        />

        <Button
          title="next Channel List"
          onPress={() => {
            console.log('hasNext', hasNextChannelList);
            nextChannelList();
          }}
        />

        <CrashTest />
      </ScrollView>
    </SafeAreaBox>
  );
}
