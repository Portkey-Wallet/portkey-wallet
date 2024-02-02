import { getContractBasic } from '@portkey-wallet/contracts/utils';
import { getCurrentChainList, getOriginChainId, getPin, getManagerAccount } from './redux';
import { addManager } from './wallet';

export async function managerSpeed({
  address,
  caHash,
  managerAddress,
  extraData,
}: {
  address: string;
  caHash: string;
  managerAddress?: string;
  extraData?: string;
}) {
  try {
    const chainList = getCurrentChainList();
    const originChainId = getOriginChainId();
    const speedChainList = chainList?.filter(i => i.chainId !== originChainId);
    const pin = getPin();
    if (!pin) return;
    const managerAccount = getManagerAccount(pin);
    if (!managerAccount || !speedChainList?.length) return;
    await Promise.all(
      speedChainList.map(async chain => {
        const contract = await getContractBasic({
          contractAddress: chain?.caContractAddress || '',
          rpcUrl: chain?.endPoint,
          account: managerAccount,
        });
        return addManager({
          contract,
          address,
          caHash,
          managerAddress,
          extraData,
          sendOptions: { onMethod: 'transactionHash' },
        });
      }),
    );
  } catch (error) {
    console.log(error, '======error');
  }
}
