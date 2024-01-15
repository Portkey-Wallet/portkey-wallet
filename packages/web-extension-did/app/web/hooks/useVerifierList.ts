import { useEffect } from 'react';
import { useAppDispatch } from 'store/Provider/hooks';
import { setVerifierListAction } from '@portkey-wallet/store/store-ca/guardians/actions';
import { getVerifierList } from 'utils/sandboxUtil/getVerifierList';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';

const useVerifierList = () => {
  const dispatch = useAppDispatch();

  const originChainId = useOriginChainId();
  const currentChain = useCurrentChain(originChainId);
  const currentNetwork = useCurrentNetworkInfo();
  useEffect(() => {
    console.log(currentChain, 'currentChain===');
    // singleMessage.error('Could not find chain information')
    if (!currentChain) return;
    getVerifierList({
      rpcUrl: currentChain.endPoint,
      address: currentChain.caContractAddress,
      chainType: currentNetwork.walletType,
    })
      .then((res) => {
        console.log(res, 'getVerifierList===');
        res.result.verifierList && dispatch(setVerifierListAction(res.result.verifierList));
      })
      .catch((err) => {
        console.error(err, 'useVerifierList===error');
      });
  }, [currentChain, currentNetwork, dispatch]);
};

export default useVerifierList;
