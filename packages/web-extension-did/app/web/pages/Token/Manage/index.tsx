import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, message } from 'antd';
import SettingHeader from 'pages/components/SettingHeader';
import CustomSvg from 'components/CustomSvg';
import { useToken } from '@portkey-wallet/hooks/hooks-ca/useToken';
import { TokenItemShowType } from '@portkey-wallet/types/types-ca/token';
import DropdownSearch from 'components/DropdownSearch';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useCommonState, useTokenInfo, useUserInfo } from 'store/Provider/hooks';
import { fetchAllTokenListAsync } from '@portkey-wallet/store/store-ca/tokenManagement/action';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import './index.less';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from 'hooks/useNetwork';
import { ELF_SYMBOL } from '@portkey-wallet/constants/constants-ca/assets';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';

export default function AddToken() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, tokenActions] = useToken();
  const { tokenDataShowInMarket } = useTokenInfo();
  const { displayUserToken } = tokenActions;
  const [filterWord, setFilterWord] = useState<string>('');
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const { passwordSeed } = useUserInfo();
  const appDispatch = useAppDispatch();
  const chainIdArray = useChainIdList();
  const isTestNet = useIsTestnet();

  useEffect(() => {
    passwordSeed && appDispatch(fetchAllTokenListAsync({ keyword: filterWord, chainIdArray }));
  }, [passwordSeed, filterWord, appDispatch, chainIdArray]);

  useEffect(() => {
    tokenDataShowInMarket.length ? setOpenDrop(false) : setOpenDrop(true);
    if (filterWord && !tokenDataShowInMarket.length) setOpenDrop(true);
  }, [filterWord, tokenDataShowInMarket]);

  const rightElement = useMemo(() => <CustomSvg type="Close2" onClick={() => navigate(-1)} />, [navigate]);

  const handleUserTokenDisplay = useCallback(
    async (item: TokenItemShowType) => {
      try {
        await displayUserToken({ tokenItem: item, keyword: filterWord, chainIdArray });
        message.success('success');
      } catch (error: any) {
        message.error(error?.message || 'handle display error');
        console.log('=== userToken display', error);
      }
    },
    [chainIdArray, displayUserToken, filterWord],
  );

  const renderTokenItem = useCallback(
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

  const renderList = useCallback(
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
            <span className="token-item-net">{transNetworkText(item.chainId, isTestNet)}</span>
          </p>
        </div>
        <div className="token-item-action">{renderTokenItem(item)}</div>
      </div>
    ),
    [isTestNet, renderTokenItem],
  );

  const { isPrompt } = useCommonState();
  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['add-token', isPrompt ? 'detail-page-prompt' : null])}>
        <div className="add-token-top">
          <SettingHeader title={t('Add tokens')} leftCallBack={() => navigate(-1)} rightElement={rightElement} />
          <DropdownSearch
            overlayClassName="empty-dropdown"
            open={openDrop}
            overlay={<div className="empty-tip">{t('There is no search result')}</div>}
            value={filterWord}
            inputProps={{
              // onBlur: () => setOpenDrop(false),
              onFocus: () => {
                if (filterWord && !tokenDataShowInMarket.length) setOpenDrop(true);
              },
              onChange: (e) => {
                const _value = e.target.value.replaceAll(' ', '');
                if (!_value) setOpenDrop(false);

                setFilterWord(_value);
              },
              placeholder: 'Search token',
            }}
          />
        </div>
        {!!tokenDataShowInMarket.length && (
          <div className="add-token-content">{tokenDataShowInMarket.map((item) => renderList(item))}</div>
        )}
        {isPrompt ? <PromptEmptyElement /> : null}
        {/* {filterWord && !tokenDataShowInMarket.length && (
      <div className="flex-center fix-max-content add-token-content-empty">{t('There is no search result.')}</div>
    )} */}
      </div>
    );
  }, [filterWord, isPrompt, navigate, openDrop, renderList, rightElement, t, tokenDataShowInMarket]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
