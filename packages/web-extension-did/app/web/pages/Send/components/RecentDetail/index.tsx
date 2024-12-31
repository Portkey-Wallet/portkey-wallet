import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useCommonState, useUserInfo } from 'store/Provider/hooks';
import { useCallback, useMemo, useState } from 'react';
import PromptFrame from 'pages/components/PromptFrame';
import Copy from 'components/Copy';
import { getExploreLink } from '@portkey-wallet/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import CommonHeader from 'components/CommonHeader';
import './index.less';
import ActivityList from 'pages/components/ActivityList';
import {
  IActivitiesApiResponse,
  IActivityListWithAddressApiParams,
} from '@portkey-wallet/store/store-ca/activity/type';
import { fetchRecentContactActivities } from '@portkey-wallet/store/store-ca/activity/api';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useEffectOnce } from 'react-use';
import { useGoAddNewContact } from 'hooks/useProfile';
import { ContactHandleActionTypeEnum } from 'types/Profile';
import Avatar from 'pages/components/Avatar';
import { useLocationState } from 'hooks/router';
import { IContactItemType } from '@portkey-wallet/types/types-ca/contactNew';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { getShowAddress } from 'pages/Contacts/components/ContactItem';

const MAX_RESULT_COUNT = 10;
const SKIP_COUNT = 0;

export default function RecentDetail() {
  const { state } = useLocationState<IContactItemType>();

  const goToNewContact = useGoAddNewContact();

  const chainInfo = useCurrentChain(state?.addressInfo?.chainId);

  const [activityInfo, setActivityList] = useState<IActivitiesApiResponse>({
    data: [],
    totalRecordCount: 0,
  });
  const { passwordSeed } = useUserInfo();
  const { isPrompt } = useCommonState();
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

  const [popVisible, setPopVisible] = useState(false);

  const PopoverMenuList = () => {
    return (
      <div className="action-list">
        <div
          className="list"
          onClick={() => {
            goToNewContact(
              state.id ? ContactHandleActionTypeEnum.EDIT_CONTACT : ContactHandleActionTypeEnum.ADD_CONTACT,
              state,
            );
          }}>
          <CustomSvgV3 type={'edit'} />
          <span>Edit address</span>
        </div>
        {state?.addressInfo?.network === 'aelf' && (
          <div className="list" onClick={viewOnExplorer}>
            <CustomSvgV3 type={'external'} />
            <span>View On Explorer</span>
          </div>
        )}
      </div>
    );
  };

  console.log('state', state);

  const mainContent = () => {
    return (
      <div className={clsx(['recent-detail', isPrompt && 'recent-detail-prompt'])}>
        <CommonHeader
          className="recent-detail-header"
          title="Address Details"
          onLeftBack={onClose}
          rightElementList={[
            {
              customSvgWrapClassName: 'nft-detail-more',
              customSvgType: 'moreHome',
              popoverProps: {
                overlayClassName: `nft-detail-popover ${isPrompt ? '' : 'nft-detail-popover-popup'}`,
                open: popVisible,
                trigger: 'click',
                showArrow: false,
                placement: 'bottomLeft',
                getPopupContainer: (triggerNode: any) => triggerNode.parentNode,
                content: <PopoverMenuList />,
              },
              onClick: () => setPopVisible(!popVisible),
            },
          ]}
        />
        <div className="recent-detail-body">
          <div className="recent-detail-address-wrap">
            {state?.name && (
              <div className="recent-detail-contact">
                <Avatar avatarUrl={state?.caHolderInfo?.avatar || ''} nameIndex={state?.index} size="large" />
                <div className="name">{state?.name}</div>
              </div>
            )}
            <div className="address-title">{'Address'}</div>

            <div className="recent-detail-address-row">
              <div className="info-left">
                <img src={state?.addressInfo?.networkImage} width={24} height={24} />
                <div className="info-left-top">
                  <div className="network">{state?.addressInfo?.networkName}</div>

                  <div className="address">{getShowAddress(state)}</div>
                </div>
              </div>
              <Copy
                iconType={'copy'}
                toCopy={`ELF_${state?.addressInfo?.address}_${state?.addressInfo?.chainId}`}
                fillColor="#FFFFFF66"
              />
            </div>
          </div>
          {/* TODO : not aelf address no activity */}
          {activityInfo?.data?.length > 0 ? (
            <ActivityList
              data={activityInfo.data}
              chainId={state?.addressInfo?.chainId}
              hasMore={isHasMore}
              loadMore={loadMoreActivities}
            />
          ) : (
            <div className="no-data">{'No recent interactions'}</div>
          )}
        </div>
      </div>
    );
  };

  return <>{isPrompt ? <PromptFrame content={mainContent()} className="transaction-detail" /> : mainContent()}</>;
}
