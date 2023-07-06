import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, message } from 'antd';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import DropdownSearch from 'components/DropdownSearch';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useCommonState, useLoading, useTokenInfo, useUserInfo } from 'store/Provider/hooks';
import { fetchAllTokenListAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { request } from '@portkey-wallet/api/api-did';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { handleErrorMessage, sleep } from '@portkey-wallet/utils';
import './index.less';

export default function AddToken() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tokenDataShowInMarket } = useTokenInfo();
  const [filterWord, setFilterWord] = useState<string>('');
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const chainIdArray = useChainIdList();
  const isMainnet = useIsMainnet();
  const { setLoading } = useLoading();
  const [tokenShowList, setTokenShowList] = useState<TokenItemShowType[]>(tokenDataShowInMarket);

  useEffect(() => {
    if (!filterWord) {
      setTokenShowList(tokenDataShowInMarket);
    }
  }, [filterWord, tokenDataShowInMarket]);

  useEffect(() => {
    !filterWord && passwordSeed && appDispatch(fetchAllTokenListAsync({ keyword: '', chainIdArray }));
  }, [passwordSeed, appDispatch, chainIdArray, filterWord]);

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
    [filterWord],
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
          await appDispatch(fetchAllTokenListAsync({ chainIdArray }));
        } else {
          await handleSearch(filterWord);
        }
        message.success('success');
      } catch (error: any) {
        const err = handleErrorMessage(error, 'handle display error');
        message.error(err);
        console.log('=== userToken display', error);
      } finally {
        setLoading(false);
      }
    },
    [appDispatch, chainIdArray, filterWord, handleSearch, setLoading],
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
          {item.symbol === ELF_SYMBOL ? (
            <CustomSvg className="token-logo" type="elf-icon" />
          ) : (
            <div className="token-logo custom-word-logo">{item.symbol?.[0] || ''}</div>
          )}
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
            <div className="token-title">{t('Popular Assets')}</div>
            {tokenShowList.map((item) => renderTokenItem(item))}
          </div>
          {filterWord && renderSearchResultTip}
        </div>
      ) : (
        <>{filterWord ? renderNoSearchResult : ''}</>
      ),
    [filterWord, renderNoSearchResult, renderSearchResultTip, renderTokenItem, t, tokenShowList],
  );

  const { isPrompt } = useCommonState();
  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['add-token', isPrompt ? 'detail-page-prompt' : null])}>
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
