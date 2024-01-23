import { useCallback } from 'react';
import { request } from '@portkey-wallet/api/api-did';
import { GuideTypeEnum } from '@portkey-wallet/constants/constants-ca/guide';

export default function useGuide() {
  const getGuideList = useCallback(async () => {
    const { guildList } = await request.guide.getGuideList();
    return guildList;
  }, []);

  const getGuideItem = useCallback(async (guideTypes: GuideTypeEnum[]) => {
    const { guildList } = await request.guide.getGuideItem({
      params: {
        guideTypes,
      },
    });
    return guildList;
  }, []);

  const finishGuideItem = useCallback(async (guideType: GuideTypeEnum) => {
    await request.guide.finishGuideItem({
      params: {
        guideType,
      },
    });
  }, []);

  return { getGuideList, getGuideItem, finishGuideItem };
}
