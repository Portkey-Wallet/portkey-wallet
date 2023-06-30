import React from 'react';
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
  console.log(userGuardiansList, '=====userGuardiansList');

  return (
    <SafeAreaBox>
      <ScrollView>
        <Text>Test Screen</Text>
        <Text>Test Screen</Text>
        <Button title="ActionSheet show" onPress={() => ActionSheet.show([{ title: '123' }, { title: '123' }])} />
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
        />
        <Button
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
        />
        <Button
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
        />
        <Button
          title="Discover"
          onPress={async () => {
            navigationService.navigate('Discover');
          }}
        />

        <CrashTest />
      </ScrollView>
    </SafeAreaBox>
  );
}
