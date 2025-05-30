import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Switch } from 'antd';
import CommonHeader from 'components/CommonHeader';
import CustomSvg from 'components/CustomSvg';
import { IUserTokenItemResponse } from '@portkey-wallet/types/types-ca/token';
import DropdownSearch from 'components/DropdownSearch';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useCommonState, useLoading, useUserInfo } from 'store/Provider/hooks';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { request } from '@portkey-wallet/api/api-did';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import singleMessage from 'utils/singleMessage';
import useToken from '@portkey-wallet/hooks/hooks-ca/useToken';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { PAGE_SIZE_DEFAULT, PAGE_SIZE_IN_ACCOUNT_ASSETS } from '@portkey-wallet/constants/constants-ca/assets';
import './index.less';
import CustomChainSelectDrawer from 'pages/components/CustomChainSelectDrawer';
import CustomChainSelectModal from 'pages/components/CustomChainSelectModal';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

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
  const [tokenShowList, setTokenShowList] = useState<IUserTokenItemResponse[]>(tokenDataShowInMarket);
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
    console.log('filterWord is', !filterWord);
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
        const res = await request.token.fetchTokenListBySearchV2({
          params: {
            symbol: keyword,
            chainIds: chainIdArray,
            skipCount: 0,
            maxResultCount: PAGE_SIZE_DEFAULT,
            version: '1.11.1',
          },
        });
        console.log('search result:', res);
        setTokenShowList(res.data);
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

  const handleUserTokenDisplay = useCallback(
    async (item: IUserTokenItemResponse) => {
      try {
        setLoading(true);
        const displayParam = item.displayStatus === 'None' ? true : false;
        await request.token.userTokensDisplaySwitch({
          params: {
            isDisplay: displayParam,
            ids: [item?.tokens?.[0].id, item?.tokens?.[1].id],
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
        // setTokenShowList((prev)=> {...prev, })
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
  const handleUserTokenSingleDisplay = useCallback(
    async (display: boolean, id: string) => {
      if (!id) {
        return;
      }
      try {
        setLoading(true);
        await request.token.userTokensDisplaySwitch({
          params: {
            isDisplay: display,
            ids: [id],
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
    (item: IUserTokenItemResponse) => {
      const isDefault = item?.isDefault || item?.tokens?.[0].isDefault || false;
      const isAdded = item.displayStatus !== 'None' || false;
      if (isDefault) {
        return (
          <span className="add-token-btn-icon">
            <CustomSvg type="GaryLock" />
          </span>
        );
      }

      return (
        <div className="flex-row-center">
          <span className="edit-btn-icon">
            <CustomSvg
              type="InteractiveEdit"
              onClick={() => {
                setChainOpen(true);
                setCurrentToken(item);
              }}
            />
          </span>
          <Switch
            checked={isAdded}
            className={isAdded ? 'checked-true' : 'checked-false'}
            onChange={() => handleUserTokenDisplay(item)}
          />
        </div>
      );
    },
    [handleUserTokenDisplay],
  );
  const calDisplayStatusText = useCallback(
    (item: IUserTokenItemResponse) => {
      let partialChainId = undefined;
      if (item?.tokens && item?.tokens.length > 1) {
        partialChainId = item?.tokens?.[0]?.isDisplay ? item?.tokens?.[0]?.chainId : item?.tokens?.[1]?.chainId;
      } else {
        partialChainId = item?.tokens?.[0]?.chainId;
      }
      return item.displayStatus === 'All'
        ? 'All Networks'
        : item.displayStatus === 'Partial'
        ? transNetworkText(partialChainId || 'AELF', !isMainnet)
        : 'Balance Hidden';
    },
    [isMainnet],
  );
  const renderTokenItem = useCallback(
    (item: IUserTokenItemResponse) => (
      <div className="token-item" key={`${item.symbol}-${item.imageUrl}`}>
        <div className="token-item-content">
          <TokenImageDisplay className="custom-logo" width={28} symbol={item.symbol} src={item.imageUrl} />
          <p className="token-info">
            <span className="token-item-symbol">{item.label ?? item.symbol}</span>
            <span className="token-item-net">{calDisplayStatusText(item)}</span>
          </p>
        </div>
        <div className="token-item-action">{renderTokenItemBtn(item)}</div>
      </div>
    ),
    [calDisplayStatusText, renderTokenItemBtn],
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

  const { isNotLessThan768, isPrompt } = useCommonState();
  const [chainOpen, setChainOpen] = useState(false);
  const [currentToken, setCurrentToken] = useState<IUserTokenItemResponse | undefined>(undefined);
  const SelectChainELe = useMemo(() => {
    return isNotLessThan768 ? (
      <CustomChainSelectModal
        open={chainOpen}
        item={currentToken}
        onClose={() => {
          setChainOpen(false);
          setCurrentToken(undefined);
        }}
        onChange={async (display, id) => {
          await handleUserTokenSingleDisplay(display, id || '');
        }}
      />
    ) : (
      <CustomChainSelectDrawer
        open={chainOpen}
        height="208"
        maskClosable={true}
        item={currentToken}
        placement="bottom"
        onClose={() => {
          setChainOpen(false);
          setCurrentToken(undefined);
        }}
        onChange={async (display, id) => {
          await handleUserTokenSingleDisplay(display, id || '');
        }}
      />
    );
  }, [chainOpen, currentToken, handleUserTokenSingleDisplay, isNotLessThan768]);

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['add-token', isPrompt && 'detail-page-prompt'])}>
        <div className="add-token-top">
          <CommonHeader
            title={t('Add tokens')}
            onLeftBack={() => navigate('/')}
            rightElementList={[{ customSvgType: 'SuggestAdd', onClick: handleAddCustomToken }]}
          />
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
        {SelectChainELe}
      </div>
    );
  }, [SelectChainELe, filterWord, handleAddCustomToken, isPrompt, navigate, renderTokenList, searchDebounce, t]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
