import { useCallback } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { GuideTypeEnum } from '@portkey-wallet/constants/constants-ca/guide';

export type TGuideInfoRes = {
  status: 1 | 0;
  guideType: GuideTypeEnum;
  externalMap: Record<string, any>;
};

export const useGuide = () => {
  const getGuideList = useCallback(async () => {
    const { userGuideInfos }: { userGuideInfos: TGuideInfoRes[] } = await request.guide.getGuideList();
    return userGuideInfos;
  }, []);

  const getGuideItem = useCallback(async (guideTypes: GuideTypeEnum[]) => {
    const { userGuideInfos }: { userGuideInfos: TGuideInfoRes[] } = await request.guide.getGuideItem({
      params: {
        guideTypes,
      },
    });
    return userGuideInfos;
  }, []);

  const finishGuideItem = useCallback(async (guideType: GuideTypeEnum) => {
    await request.guide.finishGuideItem({
      params: {
        guideType,
      },
    });
  }, []);

  return { getGuideList, getGuideItem, finishGuideItem };
};

export default useGuide;
