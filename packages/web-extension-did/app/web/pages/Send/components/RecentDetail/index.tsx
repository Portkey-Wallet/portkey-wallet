import CustomSvg from 'components/CustomSvg';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useCommonState, useUserInfo } from 'store/Provider/hooks';
import { useCallback, useMemo, useState } from 'react';
import PromptFrame from 'pages/components/PromptFrame';
import Copy from 'components/Copy';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useCurrentNetworkInfo, useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { addressFormat, getExploreLink } from '@portkey-wallet/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import CommonHeader from 'components/CommonHeader';
import './index.less';
import ActivityList from 'pages/components/ActivityList';
import {
  IActivitiesApiResponse,
  IActivityListWithAddressApiParams,
} from '@portkey-wallet/store/store-ca/activity/type';
import { fetchRecentContactActivities } from '@portkey-wallet/store/store-ca/activity/api';
import { useCaAddressInfoList, useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useEffectOnce } from 'react-use';
import { ChainId } from '@portkey-wallet/types';
import { useGoAddNewContact } from 'hooks/useProfile';
import { ContactHandleActionTypeEnum } from 'types/Profile';
import Avatar from 'pages/components/Avatar';
import { useLocationState } from 'hooks/router';
import { TRecentDetailLocationState } from 'types/router';
import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';

const MAX_RESULT_COUNT = 10;
const SKIP_COUNT = 0;

export default function RecentDetail() {
  const { state } = useLocationState<IContactItemType>();
  const currentWallet = useCurrentWallet();
  const { walletInfo } = currentWallet;

  const goToNewContact = useGoAddNewContact();

  const chainInfo = useCurrentChain(state?.addressInfo?.chainId);
  const currentNetwork = useCurrentNetworkInfo();

  const [activityInfo, setActivityList] = useState<IActivitiesApiResponse>({
    data: [],
    totalRecordCount: 0,
  });
  const { passwordSeed } = useUserInfo();
  const { isPrompt } = useCommonState();
  const isMainnet = useIsMainnet();
  const caAddressInfos = useCaAddressInfoList();

  const [loading, setLoading] = useState<boolean>(false);
  const nav = useNavigate();
  const onClose = useCallback(() => {
    nav(-1);
  }, [nav]);

  const viewOnExplorer = useCallback(() => {
    const openWinder = window.open(
      getExploreLink(chainInfo?.explorerUrl || '', state.addressInfo?.address, 'address'),
      '_blank',
    );
    if (openWinder) {
      openWinder.opener = null;
    }
  }, [chainInfo?.explorerUrl, state.addressInfo?.address]);

  const fetchParams = useMemo(() => {
    return {
      maxResultCount: MAX_RESULT_COUNT,
      skipCount: SKIP_COUNT,
      caAddressInfos,
      targetAddressInfos: [
        {
          caAddress: state?.addressInfo?.address || '',
          chainId: state?.addressInfo?.chainId || 'AELF',
          chainName: chainInfo?.chainName || 'aelf',
        },
      ],
    };
  }, [caAddressInfos, chainInfo?.chainName, state?.addressInfo?.address, state?.addressInfo?.chainId]);

  useEffectOnce(() => {
    if (passwordSeed) {
      fetchRecentContactActivities(fetchParams)
        .then((res) => {
          setActivityList(res);
        })
        .catch((error) => {
          throw Error(JSON.stringify(error));
        });
    }
  });

  const loadMoreActivities = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    const { data, totalRecordCount } = activityInfo;

    if (data.length < totalRecordCount) {
      const params: IActivityListWithAddressApiParams = {
        ...fetchParams,
        skipCount: data.length,
      };
      return fetchRecentContactActivities(params)
        .then((res) => {
          setLoading(false);
          setActivityList({ ...res, data: [...activityInfo.data, ...res.data] });
        })
        .catch((error) => {
          setLoading(false);
          throw Error(JSON.stringify(error));
        });
    }
  }, [activityInfo, fetchParams, loading]);

  const isHasMore = useMemo(() => {
    return !!activityInfo.hasNextPage;
  }, [activityInfo.hasNextPage]);

  const mainContent = () => {
    return (
      <div className={clsx(['recent-detail', isPrompt && 'detail-page-prompt'])}>
        <CommonHeader className="recent-detail-header" title="Details" onLeftBack={onClose} />
        <div className="recent-detail-body">
          <div className="recent-detail-address-wrap">
            <div
              onClick={() => {
                goToNewContact(
                  state.id ? ContactHandleActionTypeEnum.EDIT_CONTACT : ContactHandleActionTypeEnum.ADD_CONTACT,
                  state,
                );
              }}>
              add contact
            </div>
            {state?.name && (
              <div className="recent-detail-contact flex-row-center">
                <Avatar avatarUrl={state?.caHolderInfo?.avatar || ''} nameIndex={state?.index} size="large" />
                <div className="name">{state?.caHolderInfo?.walletName}</div>
              </div>
            )}

            <div className="recent-detail-address-row">
              <span className="address">{state?.addressInfo?.address}</span>
              <span className="network">{state?.addressInfo?.networkName}</span>
            </div>

            <div className="recent-detail-action-row">
              <Copy iconType={'Copy3'} iconClassName="copy-address" toCopy={state?.addressInfo?.address} />
              <CustomSvg type={'Share'} onClick={viewOnExplorer} />
            </div>
          </div>
          {/* TODO : not aelf address no activity */}
          {activityInfo?.data?.length > 0 && (
            <ActivityList
              data={activityInfo.data}
              chainId={state?.addressInfo?.chainId}
              hasMore={isHasMore}
              loadMore={loadMoreActivities}
            />
          )}
        </div>
      </div>
    );
  };

  return <>{isPrompt ? <PromptFrame content={mainContent()} className="transaction-detail" /> : mainContent()}</>;
}
