import { request } from '@portkey-wallet/api/api-did';
import {
  FreeMintStatus,
  ICollectionData,
  IConfirmMintRes,
  ITokenDetails,
} from '@portkey-wallet/types/types-ca/freeMint';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useEffectOnce } from '../..';
import { handleLoopFetch } from '@portkey-wallet/utils';
import { REFRESH_TIME } from '@portkey-wallet/constants/constants-ca/assets';

export const useRecentStatus = () => {
  const [recentStatus, setRecentStatus] = useState<FreeMintStatus>(FreeMintStatus.NONE);
  const [itemId, setItemId] = useState<string>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    (async () => {
      const result = await request.freeMintApi.getRecentStatus();
      setRecentStatus(result.status);
      setItemId(result.itemId);
    })();
  }, [recentStatus]);
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(async () => {
      const result = await request.freeMintApi.getRecentStatus();
      setRecentStatus(result.status);
      setItemId(result.itemId);
    }, REFRESH_TIME);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [setRecentStatus, setItemId, timerRef]);
  return { recentStatus, itemId, setRecentStatus, setItemId };
};
export const useFreeMinInput = () => {
  const [inputName, setInputName] = useState<string>();
  const [inputDescription, setInputDescription] = useState<string>();
  const [imgPath, setImgPath] = useState<string>();
  const [enableNext, setEnableNext] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<ICollectionData>();
  useEffect(() => {
    if (inputName && imgPath) {
      setEnableNext(true);
    } else {
      setEnableNext(false);
    }
  }, [imgPath, inputName]);

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
    return {};
  }, [enableNext, inputDescription, inputName]);
  return {
    setInputName,
    setInputDescription,
    setImgPath,
    reset,
    nextClick,
    enableNext,
    collectionData,
    inputName,
    inputDescription,
  };
};

export const useFreeMintInfo = () => {
  return useCallback(async () => {
    try {
      const result = await request.freeMintApi.getMintInfo();
      return result;
    } catch (error) {
      return null;
    }
  }, []);
};

export const useConfirmMint = () => {
  const confirm = useCallback(
    async ({
      name,
      description,
      imageUrl,
      itemId,
    }: {
      name: string;
      description: string;
      imageUrl: string;
      itemId?: string;
    }): Promise<IConfirmMintRes> => {
      const result = await request.freeMintApi.confirmMint({
        params: { imageUrl, name, description, itemId },
      });
      console.log('useConfirmMint result===', result);
      return result;
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
  }, [itemId, mintStatus]);
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
      checkIsContinue: (_creationStatusResult: any) => {
        return _creationStatusResult?.status === FreeMintStatus.PENDING;
      },
    });
    return creationStatus.status;
  }, []);
};

export const useGetMintItemInfo = () => {
  return useCallback(async (itemId: string) => {
    try {
      const res = await request.freeMintApi.getMintItemInfo({ params: { itemId } });
      return res;
    } catch (error) {
      return null;
    }
  }, []);
};
export const useGetRecentStatus = () => {
  return useCallback(async () => {
    try {
      const res = await request.freeMintApi.getRecentStatus();
      return res;
    } catch (error) {
      return null;
    }
  }, []);
};
