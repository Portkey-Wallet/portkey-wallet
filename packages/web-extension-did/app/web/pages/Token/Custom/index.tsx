import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { useChainIdList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { Button, Input, message } from 'antd';
import CustomSvg from 'components/CustomSvg';
import TitleWrapper from 'components/TitleWrapper';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import PromptEmptyElement from 'pages/components/PromptEmptyElement';
import CustomSelect from 'pages/components/CustomSelect';
import { useDebounceCallback } from '@portkey-wallet/hooks';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { ChainId } from '@portkey-wallet/types';
import { request } from '@portkey-wallet/api/api-did';
import { handleErrorMessage } from '@portkey-wallet/utils';
import './index.less';

export default function CustomToken() {
  const navigate = useNavigate();
  const { setLoading } = useLoading();
  const { t } = useTranslation();
  const [errorMsg, setErrorMsg] = useState('');
  const [curToken, setCurToken] = useState<any>({});
  const [curChainId, setCurChain] = useState<ChainId>('AELF');
  const [value, setValue] = useState<string>('');
  const { isPrompt } = useCommonState();
  const chainList = useChainIdList();
  const isMainnet = useIsMainnet();

  const chainOptions = useMemo(
    () =>
      chainList?.map((item) => ({
        value: item,
        children: (
          <div className="flex select-option">
            <CustomSvg type={isMainnet ? 'Aelf' : 'elf-icon'} />
            <span className="title">{transNetworkText(item, !isMainnet)}</span>
          </div>
        ),
      })),
    [chainList, isMainnet],
  );

  const handleSearch = useCallback(
    async (keyword: string, chainId = curChainId) => {
      try {
        if (!keyword) {
          setCurToken({});
          setValue('');
          setErrorMsg('');
          return;
        }
        setLoading(true);
        const res = await request.token.fetchTokenItemBySearch({
          params: {
            symbol: keyword,
            chainId,
          },
        });
        const { symbol, decimals, id } = res;
        if (symbol && decimals && id) {
          setCurToken(res);
          setValue(symbol);
        }
        setErrorMsg('');
      } catch (error) {
        setCurToken({});
        console.log('filter search error', error);
      } finally {
        setLoading(false);
      }
    },
    [curChainId, setLoading],
  );

  const searchDebounce = useDebounceCallback(handleSearch, [value], 500);

  const handleChangeChainId = useCallback(
    (chainId: ChainId) => {
      setCurChain(chainId);
      if (value) handleSearch(value, chainId);
    },
    [handleSearch, value],
  );

  const handleBack = useCallback(() => {
    navigate('/add-token');
  }, [navigate]);

  const handleAdd = useCallback(async () => {
    if (curToken?.isDefault || curToken?.isDisplay) {
      setErrorMsg('This token has already been added.');
    } else {
      try {
        setLoading(true);
        await request.token.displayUserToken({
          resourceUrl: `${curToken?.id}/display`,
          params: {
            isDisplay: !curToken?.isDisplay,
          },
        });
        navigate('/add-token');
      } catch (error: any) {
        const err = handleErrorMessage(error, 'add custom token error');
        message.error(err);
        console.log('add custom token error', error);
      } finally {
        setLoading(false);
      }
    }
  }, [curToken?.id, curToken?.isDefault, curToken?.isDisplay, navigate, setLoading]);

  const mainContent = useCallback(() => {
    return (
      <div className={clsx(['page-custom-token', isPrompt ? 'detail-page-prompt' : null])}>
        <TitleWrapper
          className="page-title"
          title={t('Custom Token')}
          leftCallBack={handleBack}
          rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
        />
        <div className="page-content flex-column">
          <div className="tip">
            {t(
              'To add a token, you need to select the network that it belongs to and enter its symbol for automatic recognition.',
            )}
          </div>
          <div>
            <p className="label">{t('Verifier')}</p>
            <CustomSelect
              className="select value"
              value={curChainId}
              onChange={handleChangeChainId}
              items={chainOptions}
            />
          </div>
          <div>
            <p className="label">{t('Token Symbol')}</p>
            <Input
              className="symbol-input input"
              value={value}
              onChange={(e) => {
                const _value = e.target.value.replaceAll(' ', '');
                setValue(_value);
                searchDebounce(_value);
              }}
            />
            {errorMsg && <div className="err-msg">{errorMsg}</div>}
          </div>
          <div>
            <p className="label">{t('Token Decimal')}</p>
            <Input disabled={true} className="decimals-input input" value={curToken?.decimals} />
          </div>
        </div>
        <div className="btn-wrap">
          <Button disabled={!curToken.symbol} className="btn" type="primary" onClick={handleAdd}>
            {t('Add')}
          </Button>
        </div>
        {isPrompt ? <PromptEmptyElement /> : null}
      </div>
    );
  }, [
    chainOptions,
    curChainId,
    curToken,
    errorMsg,
    handleAdd,
    handleBack,
    handleChangeChainId,
    isPrompt,
    searchDebounce,
    t,
    value,
  ]);

  return <>{isPrompt ? <PromptFrame content={mainContent()} /> : mainContent()}</>;
}
