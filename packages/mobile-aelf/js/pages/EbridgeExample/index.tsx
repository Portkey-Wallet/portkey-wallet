import React, { useCallback } from 'react';
import PageContainer from 'components/PageContainer';
import CommonButton from 'components/CommonButton';
import { EBridge } from '@portkey-wallet/utils/eBridge';
import { IEBridgeChainInfo } from '@portkey-wallet/utils/eBridge/types';
import { useGetCAContract, useGetTokenContract } from 'hooks/contract';
import { ChainId } from '@portkey-wallet/types';
import { useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';

const tokenInfoELF = {
  AELF: {
    name: 'Native Token',
    decimals: 8,
    symbol: 'ELF',
    address: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    issueChainId: 9992731,
  },
  tDVW: {
    name: 'Native Token',
    decimals: 8,
    symbol: 'ELF',
    address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
    issueChainId: 9992731,
  },
  '1': {
    name: 'ELF Token',
    decimals: 18,
    symbol: 'ELF',
    address: '0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e',
  },
  '97': {
    name: 'ELF Token',
    decimals: 18,
    symbol: 'ELF',
    address: '0xd1CD51a8d28ab58464839ba840E16950A6a635ad',
  },
};
const fromChainInfo: IEBridgeChainInfo = {
  chainType: 'aelf',
  chainId: 'tDVW',
  rpcUrl: 'https://tdvw-test-node.aelf.io',
  bridgeContract: 'JKjoabe2wyrdP1P8TvNyD4GZP6z1PuMvU2y5yJ4JTeBjTMAoX',
};
const toChainInfo: IEBridgeChainInfo = {
  chainType: 'evm',
  chainId: 97,
  rpcUrl: 'https://data-seed-prebsc-1-s2.binance.org:8545',
  limitContract: '0x37cf44B567bA9e2a26E38B777Cc1001b7289324B',
  bridgeContract: '0xD032D743A87586039056E3d35894D9F0560E26Be',
};

export default function EbridgeExample() {
  const getTokenContract = useGetTokenContract();
  const getCAContract = useGetCAContract();
  const currentWallet = useCurrentWalletInfo();

  const onPress = useCallback(async () => {
    console.log('onPress==');
    try {
      const bridge = new EBridge({
        fromChainInfo,
        toChainInfo,
        tokenInfo: tokenInfoELF,
      });

      const fee = await bridge.getELFFee();
      console.log(fee, 'fee===EBridge');
      const limit = await bridge.getLimit();
      console.log(limit, 'limit===EBridge');
      const tokenContract: any = await getTokenContract(fromChainInfo.chainId as ChainId);
      const portkeyContract: any = await getCAContract(fromChainInfo.chainId as ChainId);
      if (!currentWallet.caAddress || !currentWallet.caHash) {
        throw 'currentWallet is null';
      }
      const createReceiptResult = await bridge.createReceipt({
        tokenContract,
        portkeyContract,
        // bridgeContract: ContractBasic;
        targetAddress: '0x76a7e856E90d1eeA61A74Dbfc1311A966e743929',
        amount: '3',
        owner: currentWallet.caAddress,
        caHash: currentWallet.caHash,
      });
      console.log(createReceiptResult, 'createReceiptResult===EBridge');
    } catch (error) {
      console.log(error, 'error===EBridge');
    }
  }, [currentWallet.caAddress, currentWallet.caHash, getCAContract, getTokenContract]);

  const onTransferUSDT = useCallback(async () => {
    console.log('onPress==');
    try {
      const tokenInfoUSDT = {
        tDVW: {
          name: 'USDT',
          decimals: 6,
          symbol: 'USDT',
          address: 'ASh2Wt7nSEmYqnGxPPzp4pnVDU4uhj1XW9Se5VeZcX2UDdyjx',
          issueChainId: 9992731,
        },
        '97': {
          name: 'USDT Token',
          decimals: 18,
          symbol: 'USDT',
          address: '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee',
        },
      };

      const bridge = new EBridge({
        fromChainInfo,
        toChainInfo,
        tokenInfo: tokenInfoUSDT,
      });

      const fee = await bridge.getELFFee();
      console.log(fee, 'fee===EBridge');
      const limit = await bridge.getLimit();
      console.log(limit, 'limit===EBridge');
      const tokenContract: any = await getTokenContract(fromChainInfo.chainId as ChainId);
      const portkeyContract: any = await getCAContract(fromChainInfo.chainId as ChainId);
      if (!currentWallet.caAddress || !currentWallet.caHash) {
        throw 'currentWallet is null';
      }
      const createReceiptResult = await bridge.createReceipt({
        tokenContract,
        portkeyContract,
        // bridgeContract: ContractBasic;
        targetAddress: '0x76a7e856E90d1eeA61A74Dbfc1311A966e743929',
        amount: '3',
        owner: currentWallet.caAddress,
        caHash: currentWallet.caHash,
      });
      console.log(createReceiptResult, 'createReceiptResult===EBridge');
    } catch (error) {
      console.log(error, 'error===EBridge');
    }
  }, [currentWallet.caAddress, currentWallet.caHash, getCAContract, getTokenContract]);

  return (
    <PageContainer noCenterDom safeAreaColor={['white']} scrollViewProps={{ disabled: false }}>
      <CommonButton type="primary" disabled={false} onPress={onPress}>
        onEbridge transfer(ELF) to evm
      </CommonButton>
      <CommonButton type="primary" disabled={false} onPress={onTransferUSDT}>
        onEbridge transfer(USDT) to evm
      </CommonButton>
    </PageContainer>
  );
}
