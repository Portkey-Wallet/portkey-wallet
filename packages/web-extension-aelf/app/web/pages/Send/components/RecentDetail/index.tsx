import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useCommonState, useUserInfo } from 'store/Provider/hooks';
import { useCallback, useMemo, useState } from 'react';
import Copy from 'components/Copy';
import { addressFormat, chainShowText, getExploreLink } from '@portkey-wallet/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-eoa/chainList';
import CommonHeader from 'components/CommonHeader';
import './index.less';
import ActivityList from 'pages/components/ActivityList';
import {
  IActivitiesApiResponse,
  IActivityListWithAddressApiParams,
} from '@portkey-wallet/store/store-eoa/activity/type';
import { fetchRecentContactActivities } from '@portkey-wallet/store/store-eoa/activity/api';
import { useEffectOnce } from 'react-use';
import { useGoAddNewContact } from 'hooks/useProfile';
import { ContactHandleActionTypeEnum } from 'types/Profile';
import Avatar from 'pages/components/Avatar';
import { useLocationState } from 'hooks/router';
import { IAddressInfo, IContactItemType } from '@portkey-wallet/types/types-eoa/contact';
import { getShowAddress } from 'pages/Contacts/components/ContactItem';
import { ChainType } from '@portkey/provider-types';
import { singleMessage } from '@portkey/did-ui-react';
import { useChainList } from '@portkey-wallet/hooks/hooks-eoa/network/chain';
import { ChainId } from '@portkey-wallet/types';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { NFT_MIDDLE_SIZE } from '@portkey-wallet/constants/constants-eoa/assets';

const MAX_RESULT_COUNT = 10;
const SKIP_COUNT = 0;

export default function RecentDetail() {
  const { state } = useLocationState<IContactItemType & { isFromSend: boolean; addressInfo: IAddressInfo }>();
  console.log(state, '======state');
  const account = useCurrentAccount();

  const chainId = useMemo(() => state?.addressInfo?.chainId as ChainId, [state?.addressInfo?.chainId]);
  const address = useMemo(() => state?.addressInfo?.address, [state?.addressInfo?.address]);
  const isMyContact = useMemo(() => !!state?.name, [state?.name]);

  const goToNewContact = useGoAddNewContact();
  const chainList = useChainList();

  const chainInfo = useCurrentChain(chainId);

  const [activityInfo, setActivityList] = useState<IActivitiesApiResponse>({
    data: [],
    totalRecordCount: 0,
  });
  const { passwordSeed } = useUserInfo();
  const { isPrompt } = useCommonState();
  // const caAddressInfos = useCaAddressInfoList();

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
      addressInfos: (chainList || [])
        .filter((item) => item.chainId === chainId)
        .map((item) => ({
          chainId: item.chainId,
          address: `AELF_${account}_${item.chainId}`,
          chainName: '',
        })),
      targetAddressInfos: [
        {
          address: address,
          chainId: chainId,
          chainName: '',
        },
      ],
      width: NFT_MIDDLE_SIZE,
      height: -1,
    };
  }, [account, address, chainId, chainList]);

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
    return !!activityInfo?.hasNextPage;
  }, [activityInfo?.hasNextPage]);

  const [popVisible, setPopVisible] = useState(false);

  const PopoverMenuList = () => {
    return (
      <div className="action-list">
        {isMyContact ? (
          <>
            <div
              className="list"
              onClick={() => {
                goToNewContact(
                  state.id ? ContactHandleActionTypeEnum.EDIT_CONTACT : ContactHandleActionTypeEnum.ADD_CONTACT,
                  state as any,
                );
              }}>
              <CustomSvgV3 type={'edit'} />
              <span>Edit Address</span>
            </div>
            {state?.addressInfo?.network === 'aelf' && (
              <div className="list" onClick={viewOnExplorer}>
                <CustomSvgV3 type={'external'} />
                <span>View On Explorer</span>
              </div>
            )}
          </>
        ) : (
          <div
            className="list"
            onClick={async () => {
              await navigator.clipboard.writeText(
                addressFormat(
                  state?.addressInfo?.address,
                  state?.addressInfo?.chainId,
                  state?.addressInfo?.network as ChainType,
                ),
              );
              singleMessage.success('Copy success');
            }}>
            <CustomSvgV3 type={'copyAddress'} />
            <span>Copy Address</span>
          </div>
        )}
      </div>
    );
  };

  const formatAddress = useMemo(
    () =>
      state?.addressInfo?.isExchange
        ? state?.addressInfo?.address
        : addressFormat(
            state?.addressInfo?.address,
            state?.addressInfo?.chainId,
            state?.addressInfo?.network as ChainType,
          ),
    [
      state?.addressInfo?.address,
      state?.addressInfo?.chainId,
      state?.addressInfo?.isExchange,
      state?.addressInfo?.network,
    ],
  );

  return (
    <div className={clsx(['recent-detail', isPrompt && 'recent-detail-prompt'])}>
      <CommonHeader
        className="recent-detail-header"
        title="Address Details"
        onLeftBack={onClose}
        rightElementList={[
          {
            customSvgWrapClassName: 'recent-detail-more',
            customSvgType: 'more_verti',
            popoverProps: {
              overlayClassName: `recent-detail-popover`,
              open: popVisible,
              trigger: 'click',
              showArrow: false,
              placement: 'bottomLeft',
              getPopupContainer: (triggerNode: any) => triggerNode.parentNode,
              content: <PopoverMenuList />,
              onOpenChange: () => setPopVisible(!popVisible),
            },
            onClick: () => setPopVisible(!popVisible),
          },
        ]}
      />
      <div className="recent-detail-body">
        <div className="recent-detail-address-wrap">
          {state?.name && (
            <div className="recent-detail-contact">
              <Avatar avatarUrl={undefined} nameIndex={state?.index} size="large" />
              <div className="name">{state?.name}</div>
            </div>
          )}
          <div className="address-title">{'Address'}</div>

          <div className="recent-detail-address-row">
            <div className="info-left">
              <img src={state?.addressInfo?.networkImage} width={24} height={24} />
              <div className="info-left-top">
                <div className="network">
                  {state.addressInfo?.network === 'aelf'
                    ? `aelf ${chainShowText(state.addressInfo?.chainId || 'AELF')}`
                    : state?.addressInfo?.networkName}
                </div>
                <div className="address">{getShowAddress(state)}</div>
              </div>
            </div>
            {state.name ? (
              <Copy iconType={'copy'} toCopy={formatAddress} fillColor="#FFFFFF66" />
            ) : (
              <div onClick={() => goToNewContact(ContactHandleActionTypeEnum.ADD_CONTACT, state as any)}>
                <CustomSvgV3 type={'add-person'} className="add-icon" />
              </div>
            )}
          </div>
        </div>
        {/* TODO : not aelf address no activity */}
        {activityInfo?.data?.length > 0 ? (
          <>
            <div className="recent-title">Recent interactions</div>
            <ActivityList
              data={activityInfo.data}
              chainId={state?.addressInfo?.chainId}
              hasMore={isHasMore}
              loadMore={loadMoreActivities}
            />
          </>
        ) : (
          <div className="no-data">{'No recent interactions'}</div>
        )}
      </div>
    </div>
  );
}
