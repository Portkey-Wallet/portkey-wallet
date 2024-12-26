import { useTranslation } from 'react-i18next';
import { useCallback, useMemo, useState } from 'react';
import TokenAllowancePopup from './Popup';
import { MenuItemInfo } from 'pages/components/MenuList';
import ImageDisplay from 'pages/components/ImageDisplay';
import { useNavigateState } from 'hooks/router';
import { ITokenAllowance } from '@portkey-wallet/types/types-ca/allowance';
import { useFetchTokenAllowanceList } from '@portkey-wallet/hooks/hooks-ca/assets';
import singleMessage from 'utils/singleMessage';
import { addressFormat, formatStr2EllipsisStr, handleErrorMessage } from '@portkey-wallet/utils';
import { PAGE_SIZE_DEFAULT } from '@portkey-wallet/constants/constants-ca/assets';
import { useEffectOnce } from '@portkey-wallet/hooks';
import './index.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';

export interface ITokenAllowanceProps {
  fetching: boolean;
  hasMore: boolean;
  fetchMoreList: () => Promise<void>;
}

export default function TokenAllowance() {
  const { t } = useTranslation();
  const navigate = useNavigateState<ITokenAllowance>();
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
      list.map((temp) => {
        const formatAddressShow = addressFormat(temp?.contractAddress, temp?.chainId, 'aelf');
        const ellipsisAddress = formatStr2EllipsisStr(formatAddressShow);
        return {
          key: temp.contractAddress,
          element: (
            <div className="content flex">
              <ImageDisplay defaultHeight={42} className="icon" name={temp.name || 'Unknown'} src={temp.icon} />
              <div className="desc flex-column">
                <div className="text name">
                  <span className="dapp-name">{temp.name ?? 'Unknown'}</span>
                  {/*<CustomSvg type={temp.url ? 'DappLock' : 'DappWarn'} />*/}
                  {(!temp.url || !temp.url.startsWith('https://')) && (
                    <CustomSvgV3 type="warning" className="warning-icon" fillColor="#EB7D50" />
                  )}
                </div>
                <div className="text contract-address">{`Contract address: ${ellipsisAddress}`}</div>
              </div>
            </div>
          ),
          click: () => {
            navigate(`/setting/wallet-security/token-allowance-detail`, { state: temp });
          },
        };
      }),
    [list, navigate],
  );

  const title = t('Token Allowance');
  const handleBack = useCallback(() => {
    navigate('/setting');
  }, [navigate]);

  return (
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
