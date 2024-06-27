import { request } from '@portkey-wallet/api/api-did';
import { FreeMintStatus, ICollectionData, ITokenDetails } from '@portkey-wallet/types/types-ca/freeMint';
import { useCallback, useEffect, useState } from 'react';
import { useEffectOnce } from '../..';
import { handleLoopFetch } from '@portkey-wallet/utils';

export const useRecentStatus = () => {
  const [recentStatus, setRecentStatus] = useState<FreeMintStatus>(FreeMintStatus.NONE);
  const [itemId, setItemId] = useState<string>();
  useEffect(() => {
    (async () => {
      const result = await request.freeMintApi.getRecentStatus();
      setRecentStatus(result.status);
      setItemId(result.itemId);
    })();
  }, [recentStatus]);
  return { recentStatus, itemId };
};
export const useFreeMinInput = () => {
  const [inputName, setInputName] = useState<string>();
  const [inputDescription, setInputDescription] = useState<string>();
  const [imgPath, setImgPath] = useState<string>();
  const [enableNext, setEnableNext] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<ICollectionData>();
  useEffect(() => {
    if ((inputName && inputDescription) || imgPath) {
      setEnableNext(true);
    } else {
      setEnableNext(false);
    }
  }, [imgPath, inputDescription, inputName]);

  const reset = useCallback(() => {
    setInputName('');
    setInputDescription('');
    setImgPath('');
  }, []);
  const nextClick = useCallback(async () => {
    if (enableNext) {
      const result = await request.freeMintApi.getMintInfo();
      setCollectionData(result);
      return {
        name: inputName,
        description: inputDescription,
        collectionData: result,
        // tokenId: result.tokenId,
        // imageUrl: result.collectionInfo.imageUrl,
      };
    }
  }, [enableNext, inputDescription, inputName]);
  return {
    setInputName,
    setInputDescription,
    setImgPath,
    reset,
    nextClick,
    enableNext,
    collectionData,
  };
};

export const useConfirmMint = () => {
  const confirm = useCallback(
    async (name: string, description: string, tokenId: string, imageUrl: string): Promise<string> => {
      const result = await request.freeMintApi.confirmMint({
        params: { imageUrl, name, tokenId, description },
      });
      console.log('useConfirmMint result===', result);
      return result.itemId;
    },
    [],
  );
  return { confirm };
};

export const useMintStatus = (itemId: string) => {
  const [mintStatus, setMintStatus] = useState<FreeMintStatus>(FreeMintStatus.NONE);
  const [mintDetail, setMintDetail] = useState<ITokenDetails>();
  const loopMintStatus = useLoopMintStatus();
  useEffectOnce(() => {
    (async () => {
      const mintStatus = await request.freeMintApi.getMintStatus({ params: { itemId } });
      setMintStatus(mintStatus.status);
      if (mintStatus === FreeMintStatus.PENDING) {
        const updateStatus = await loopMintStatus(itemId);
        setMintStatus(updateStatus);
      }
      const mintDetail = await request.freeMintApi.getMintDetail({ params: { itemId } });
      setMintDetail(mintDetail);
    })();
  });
  const mintAgain = useCallback(() => {
    (async () => {
      if (mintStatus === FreeMintStatus.FAIL) {
        await request.freeMintApi.confirmAgain({ params: { itemId } });
      }
    })();
  }, [itemId]);
  return { mintStatus, mintDetail, mintAgain };
};
export const useLoopMintStatus = () => {
  return useCallback(async (itemId: string) => {
    const creationStatus = await handleLoopFetch({
      fetch: () => {
        return request.freeMintApi.getMintStatus({
          params: { itemId },
        });
      },
      times: 10,
      interval: 2000,
      checkIsContinue: _creationStatusResult => {
        return _creationStatusResult?.status === FreeMintStatus.PENDING;
      },
    });
    return creationStatus.state;
  }, []);
};
