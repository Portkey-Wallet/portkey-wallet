import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import clsx from 'clsx';
import { useCommonState, useUserInfo } from 'store/Provider/hooks';
import { useCallback, useMemo, useState } from 'react';
import PromptFrame from 'pages/components/PromptFrame';
import Copy from 'components/Copy';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useCurrentNetworkInfo, useIsTestnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { addressFormat, getExploreLink } from '@portkey-wallet/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import TitleWrapper from 'components/TitleWrapper';
import './index.less';
import ActivityList from 'pages/components/ActivityList';
import { IActivitiesApiResponse } from '@portkey-wallet/store/store-ca/activity/type';
import { fetchRecentContactActivities } from '@portkey-wallet/store/store-ca/activity/api';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useEffectOnce } from 'react-use';
import { ChainId } from '@portkey-wallet/types';

const MAX_RESULT_COUNT = 10;
const SKIP_COUNT = 0;

export default function RecentDetail() {
  const { state } = useLocation();
  const targetAddress = state?.targetAddress; // get contact address from url state
  const targetChainId = state?.targetChainId; // get contact chainId from url state
  const myChainId = state?.chainId; // get my chainId from url state
  const currentWallet = useCurrentWallet();
  const { walletInfo } = currentWallet;
  const myAddress = myChainId ? walletInfo?.[myChainId as ChainId]?.caAddress || '' : ''; // get my address from url state

  const chainInfo = useCurrentChain(targetChainId);
  const currentNetwork = useCurrentNetworkInfo();
  const transTargetAddress = addressFormat(targetAddress, targetChainId, currentNetwork.walletType);
  const [activityInfo, setActivityList] = useState<IActivitiesApiResponse>({
    data: [],
    totalRecordCount: 0,
  });
  const [lastPageSize, setLastPageSize] = useState<number>(0);
  const { passwordSeed } = useUserInfo();
  const { isPrompt } = useCommonState();
  const isTestNet = useIsTestnet();
  const [loading, setLoading] = useState<boolean>(false);
  const nav = useNavigate();
  const onClose = useCallback(() => {
    nav(-1);
  }, [nav]);

  const goAddContact = useCallback(() => {
    const initContactItem: Partial<ContactItemType> = {
      id: '-1',
      name: '',
      addresses: [{ chainId: targetChainId || 'AELF', address: targetAddress || '' }],
    };
    nav('/setting/contacts/add', { state: initContactItem });
  }, [targetChainId, targetAddress, nav]);

  const viewOnExplorer = useCallback(() => {
    const openWinder = window.open(
      getExploreLink(chainInfo?.explorerUrl || '', transTargetAddress, 'address'),
      '_blank',
    );
    if (openWinder) {
      openWinder.opener = null;
    }
  }, [chainInfo?.explorerUrl, transTargetAddress]);

  const fetchParams = useMemo(() => {
    return {
      maxResultCount: MAX_RESULT_COUNT,
      skipCount: SKIP_COUNT,
      caAddressInfos: [
        {
          caAddress: myAddress,
          chainId: myChainId,
        },
      ],
      targetAddressInfos: [
        {
          caAddress: targetAddress,
          chainId: targetChainId,
        },
      ],
    };
  }, [myAddress, myChainId, targetAddress, targetChainId]);

  useEffectOnce(() => {
    if (passwordSeed) {
      fetchRecentContactActivities(fetchParams)
        .then((res) => {
          setActivityList(res);
          setLastPageSize(res?.data?.length || 0);
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
      const params = {
        ...fetchParams,
        skipCount: data.length,
      };
      return fetchRecentContactActivities(params)
        .then((res) => {
          setLoading(false);
          setActivityList({ ...res, data: [...activityInfo.data, ...res.data] });
          setLastPageSize(res?.data?.length || 0);
        })
        .catch((error) => {
          setLoading(false);
          throw Error(JSON.stringify(error));
        });
    }
  }, [activityInfo, fetchParams, loading]);

  const isHasMore = useMemo(() => {
    return activityInfo.data.length < activityInfo.totalRecordCount && lastPageSize !== 0;
  }, [activityInfo.data.length, activityInfo.totalRecordCount, lastPageSize]);

  const mainContent = () => {
    return (
      <div className={clsx(['recent-detail', isPrompt ? 'detail-page-prompt' : null])}>
        <TitleWrapper
          className="recent-detail-header"
          title="Details"
          leftCallBack={onClose}
          rightElement={<CustomSvg type="Close2" onClick={onClose} />}
        />
        <div className="recent-detail-body">
          <div className="recent-detail-address-wrap">
            {state?.name && (
              <div className="recent-detail-contact flex-row-center">
                <div className="flex-center avatar">{state?.index}</div>
                <div className="name">{state?.name}</div>
              </div>
            )}

            <div className="recent-detail-address-row">
              <span className="address">{transTargetAddress}</span>
              <span className="network">{transNetworkText(targetChainId, isTestNet)}</span>
            </div>

            <div className="recent-detail-action-row">
              {!state?.name && <CustomSvg type={'AddContact'} onClick={goAddContact} />}
              <Copy iconType={'Copy3'} iconClassName="copy-address" toCopy={transTargetAddress} />
              <CustomSvg type={'Share'} onClick={viewOnExplorer} />
            </div>
          </div>
          {activityInfo?.data?.length > 0 && (
            <ActivityList
              data={activityInfo.data}
              chainId={targetChainId}
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
