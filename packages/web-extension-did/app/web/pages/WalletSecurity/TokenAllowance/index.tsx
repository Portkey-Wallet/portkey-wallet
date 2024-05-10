import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import TokenAllowancePopup from './Popup';
import TokenAllowancePrompt from './Prompt';
import { useCommonState } from 'store/Provider/hooks';
import { MenuItemInfo } from 'pages/components/MenuList';
import ImageDisplay from 'pages/components/ImageDisplay';
import CustomSvg from 'components/CustomSvg';
import { useNavigateState } from 'hooks/router';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import { useFetchTokenAllowanceList } from '@portkey-wallet/hooks/hooks-ca/assets';
import singleMessage from 'utils/singleMessage';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { PAGE_SIZE_DEFAULT } from '@portkey-wallet/constants/constants-ca/assets';
import { useEffectOnce } from '@portkey-wallet/hooks';
import './index.less';

export interface ITokenAllowanceProps {
  fetching: boolean;
  hasMore: boolean;
  fetchMoreList: () => Promise<void>;
}

export default function TokenAllowance() {
  const { t } = useTranslation();
  const navigate = useNavigateState<ITokenAllowance>();
  const { isNotLessThan768 } = useCommonState();
  const fetchTokenAllowanceList = useFetchTokenAllowanceList();
  const [fetching, setFetching] = useState<boolean>(true);
  const [list, setList] = useState<ITokenAllowance[]>([]);
  const [totalLength, setTotalLength] = useState(0);
  const hasMore = useMemo(() => list.length < totalLength, [list.length, totalLength]);

  const fetchList = useCallback(async () => {
    if (!list.length) setFetching(true);
    try {
      const res = await fetchTokenAllowanceList({ skipCount: list.length, maxResultCount: PAGE_SIZE_DEFAULT });
      setTotalLength(res.totalRecordCount);
      if (list.length) {
        setList((pre) => [...pre, ...res.data]);
      } else {
        setList(res.data);
      }
    } catch (error) {
      console.log('===fetchTokenAllowanceList error', error);
      singleMessage.error(handleErrorMessage(error || 'fetch error'));
    } finally {
      setFetching(false);
    }
  }, [fetchTokenAllowanceList, list.length]);

  useEffectOnce(() => {
    fetchList();
  });

  const showDataList: MenuItemInfo[] = useMemo(
    () =>
      list.map((temp) => ({
        key: temp.contractAddress,
        element: (
          <div className="content flex">
            <ImageDisplay defaultHeight={32} className="icon" name={temp.name || 'Unknown'} src={temp.icon} />
            <div className="desc flex-column">
              <div className="text name">
                <span className="dapp-name">{temp.name ?? 'Unknown'}</span>
                <CustomSvg type={temp.url ? 'DappLock' : 'DappWarn'} />
              </div>
              <div className="text contract-address">{`Contract Address: ${temp.contractAddress}`}</div>
            </div>
          </div>
        ),
        click: () => {
          navigate(`/setting/wallet-security/token-allowance-detail`, { state: temp });
        },
      })),
    [list, navigate],
  );

  const title = t('Token Allowance');
  const handleBack = useCallback(() => {
    navigate('/setting/wallet-security');
  }, [navigate]);

  return isNotLessThan768 ? (
    <TokenAllowancePrompt
      headerTitle={title}
      goBack={handleBack}
      list={showDataList}
      fetching={fetching}
      hasMore={hasMore}
      fetchMoreList={fetchList}
    />
  ) : (
    <TokenAllowancePopup
      headerTitle={title}
      goBack={handleBack}
      list={showDataList}
      fetching={fetching}
      hasMore={hasMore}
      fetchMoreList={fetchList}
    />
  );
}
