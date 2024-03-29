import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from 'antd';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import DropdownSearch from 'components/DropdownSearch';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useCommonState, useLoading, useUserInfo } from 'store/Provider/hooks';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { request } from '@portkey-wallet/api/api-did';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import singleMessage from 'utils/singleMessage';
import useToken from '@portkey-wallet/hooks/hooks-ca/useToken';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_IN_ACCOUNT_ASSETS } from '@portkey-wallet/constants/constants-ca/assets';
import './index.less';

export default function AddToken() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tokenDataShowInMarket, totalRecordCount, fetchTokenInfoList } = useToken();
  const [filterWord, setFilterWord] = useState<string>('');
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const chainIdArray = useChainIdList();
  const isMainnet = useIsMainnet();
  const { setLoading } = useLoading();
  const [tokenShowList, setTokenShowList] = useState<TokenItemShowType[]>(tokenDataShowInMarket);
  const hasMoreToken = useMemo(
    () => tokenDataShowInMarket.length < totalRecordCount,
    [tokenDataShowInMarket.length, totalRecordCount],
  );

  const getMoreTokenInfo = useCallback(async () => {
    if (tokenDataShowInMarket.length && tokenDataShowInMarket.length < totalRecordCount) {
      await fetchTokenInfoList({
        chainIdArray,
        keyword: '',
        skipCount: tokenDataShowInMarket.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
      });
    }
  }, [chainIdArray, fetchTokenInfoList, tokenDataShowInMarket.length, totalRecordCount]);

  useEffect(() => {
    if (!filterWord) {
      setTokenShowList(tokenDataShowInMarket);
    }
  }, [filterWord, tokenDataShowInMarket]);

  useEffect(() => {
    if (!filterWord) {
      fetchTokenInfoList({ keyword: '', chainIdArray, skipCount: 0, maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS });
    }
  }, [passwordSeed, appDispatch, chainIdArray, filterWord, fetchTokenInfoList]);

  const handleAddCustomToken = useCallback(() => {
    setFilterWord('');
    navigate('/custom-token');
  }, [navigate]);

  const handleSearch = useCallback(
    async (keyword: string) => {
      try {
        if (!keyword) return;
        const res = await request.token.fetchTokenListBySearch({
          params: {
            symbol: keyword,
            chainIds: chainIdArray,
            skipCount: 0,
            maxResultCount: PAGE_SIZE_DEFAULT,
          },
        });
        const _target = (res || []).map((item: any) => ({
          ...item,
          isAdded: item.isDisplay,
          userTokenId: item.id,
        }));
        setTokenShowList(_target);
      } catch (error) {
        setTokenShowList([]);
        console.log('filter search error', error);
      }
    },
    [chainIdArray],
  );

  const searchDebounce = useDebounceCallback(
    async (params) => {
      setLoading(true);
      await handleSearch(params);
      setLoading(false);
    },
    [handleSearch, setLoading],
    500,
  );

  const rightElement = useMemo(
    () => (
      <div className="flex-center">
        <Button onClick={handleAddCustomToken} className="custom-token-add-btn">
          {t('Custom Token')}
        </Button>
        <CustomSvg type="Close2" onClick={() => navigate('/')} />
      </div>
    ),
    [handleAddCustomToken, navigate, t],
  );

  const handleUserTokenDisplay = useCallback(
    async (item: TokenItemShowType) => {
      try {
        setLoading(true);
        await request.token.displayUserToken({
          resourceUrl: `${item.userTokenId}/display`,
          params: {
            isDisplay: !item.isAdded,
          },
        });
        await sleep(1000);
        if (!filterWord) {
          await fetchTokenInfoList({
            chainIdArray,
            keyword: '',
            skipCount: 0,
            maxResultCount: PAGE_SIZE_IN_ACCOUNT_ASSETS,
          });
        } else {
          await handleSearch(filterWord);
        }
        singleMessage.success('success');
      } catch (error: any) {
        const err = handleErrorMessage(error, 'handle display error');
        singleMessage.error(err);
        console.log('=== userToken display', error);
      } finally {
        setLoading(false);
      }
    },
    [chainIdArray, fetchTokenInfoList, filterWord, handleSearch, setLoading],
  );

  const renderTokenItemBtn = useCallback(
    (item: TokenItemShowType) => {
      const { isDefault = false, isAdded = true } = item;
      if (isDefault) {
        return (
          <span className="add-token-btn-icon">
            <CustomSvg type="GaryLock" />
          </span>
        );
      }

      return (
        <Button
          className="add-token-btn"
          onClick={() => {
            handleUserTokenDisplay(item);
          }}>
          {t(isAdded ? 'Hide' : 'Add')}
        </Button>
      );
    },
    [handleUserTokenDisplay, t],
  );

  const renderTokenItem = useCallback(
    (item: TokenItemShowType) => (
      <div className="token-item" key={`${item.symbol}-${item.chainId}`}>
        <div className="token-item-content">
          <TokenImageDisplay className="custom-logo" width={28} symbol={item.symbol} src={item.imageUrl} />
          <p className="token-info">
            <span className="token-item-symbol">{item.symbol}</span>
            <span className="token-item-net">{transNetworkText(item.chainId, !isMainnet)}</span>
          </p>
        </div>
        <div className="token-item-action">{renderTokenItemBtn(item)}</div>
      </div>
    ),
    [isMainnet, renderTokenItemBtn],
  );

  const renderNoSearchResult = useMemo(
    () => (
      <div className="flex-column-center no-result">
        <CustomSvg type="Group" className="no-token-svg" />
        <p className="desc">{t('There is no search Result.')}</p>
        <div className="flex-center">
          <Button className="flex-row-center add-button flex-center" type="text" onClick={handleAddCustomToken}>
            <CustomSvg type="Plus" className="plug-svg" /> {t('Custom Token')}
          </Button>
        </div>
      </div>
    ),
    [handleAddCustomToken, t],
  );

  const renderSearchResultTip = useMemo(
    () => (
      <div className="flex-column-center search-result-tip">
        <p className="desc">{t("Can't find your token? Please try below.")}</p>
        <div className="flex-center">
          <Button className="flex-row-center add-button flex-center" type="text" onClick={handleAddCustomToken}>
            <CustomSvg type="Plus" className="plug-svg" /> {t('Custom Token')}
          </Button>
        </div>
      </div>
    ),
    [handleAddCustomToken, t],
  );

  const renderTokenList = useMemo(
    () =>
      tokenShowList.length ? (
        <div className="add-token-content flex-column-between">
          <div>
            {!filterWord.length && <div className="token-title">{t('Popular Assets')}</div>}
            {tokenShowList.map((item) => renderTokenItem(item))}
            {!filterWord && <LoadingMore hasMore={hasMoreToken} loadMore={getMoreTokenInfo} className="load-more" />}
          </div>
          {filterWord && renderSearchResultTip}
        </div>
      ) : (
        <>{filterWord ? renderNoSearchResult : ''}</>
      ),
    [
      filterWord,
      getMoreTokenInfo,
      hasMoreToken,
      renderNoSearchResult,
      renderSearchResultTip,
      renderTokenItem,
      t,
      tokenShowList,
    ],
  );

  const { isPrompt } = useCommonState();
  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['add-token', isPrompt && 'detail-page-prompt'])}>
        <div className="add-token-top">
          <SettingHeader title={t('Add tokens')} leftCallBack={() => navigate('/')} rightElement={rightElement} />
          <DropdownSearch
            overlay={<></>}
            value={filterWord}
            inputProps={{
              onChange: (e) => {
                const _value = e.target.value.replaceAll(' ', '');
                setFilterWord(_value);
                searchDebounce(_value);
              },
              placeholder: 'Search token',
            }}
          />
        </div>
        {renderTokenList}
      </div>
    );
  }, [filterWord, isPrompt, navigate, renderTokenList, rightElement, searchDebounce, t]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
