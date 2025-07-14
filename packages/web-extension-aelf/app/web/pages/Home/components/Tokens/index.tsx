import { ITokenSectionResponse } from '@portkey-wallet/types/types-eoa/token';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-eoa/network';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { PAGE_SIZE_IN_ACCOUNT_TOKEN } from '@portkey-wallet/constants/constants-ca/assets';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-eoa/assets';
import './index.less';
import { useEffectOnce } from 'react-use';
import useGAReport from 'hooks/useGAReport';
import clsx from 'clsx';
import { Row, Col, Collapse } from 'antd';
// import CustomSvg from 'components/CustomSvg';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useCommonState } from 'store/Provider/hooks';
import { useCurrentAddressInfos } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useLatestRef } from '@portkey-wallet/hooks';

export default function TokenList() {
  const { isPrompt } = useCommonState();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();
  const addressInfos = useCurrentAddressInfos();
  console.log(addressInfos, '=====addressInfos');

  const userInfo = useCurrentUserInfo();
  const { accountTokenList, totalRecordCount, fetchAccountTokenInfoList } = useAccountTokenInfo();
  console.log(accountTokenList, '=====accountTokenList');

  const addressInfosList = useLatestRef(addressInfos);
  const hasMoreTokenList = useMemo(
    () => accountTokenList && totalRecordCount && accountTokenList.length < totalRecordCount,
    [accountTokenList, totalRecordCount],
  );
  console.log('===useAccountTokenInfo');

  const [, setOpenPanel] = useState<string[]>([]);

  const { startReport, endReport } = useGAReport();

  useEffectOnce(() => {
    startReport('Home-TokenList');
  });

  useEffect(() => {
    fetchAccountTokenInfoList({
      addressInfos: addressInfosList.current || [],
      skipCount: 0,
      maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
    }).then(() => {
      endReport('Home-TokenList');
    });
  }, [addressInfosList, endReport, fetchAccountTokenInfoList]);

  const onNavigate = useCallback(
    (tokenInfo: any, chainId?: string) => {
      navigate('/token-detail', { state: { tokenInfo, chainId } });
    },
    [navigate],
  );

  const getMoreTokenList = useCallback(async () => {
    if (accountTokenList && totalRecordCount && accountTokenList.length < totalRecordCount) {
      await fetchAccountTokenInfoList({
        addressInfos: addressInfosList.current || [],
        skipCount: accountTokenList.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      });
    }
  }, [accountTokenList, addressInfosList, fetchAccountTokenInfoList, totalRecordCount]);

  const handleAddToken = useCallback(() => {
    navigate('/add-token');
    return;
  }, [navigate]);

  const getTokenAmount = useCallback(
    (item: { balance?: string; decimals?: number | string }) =>
      userInfo.hideAssets ? '****' : formatTokenAmountShowWithDecimals(item.balance, item.decimals),
    [userInfo.hideAssets],
  );

  const getAmountUSDShow = useCallback(
    (item: any) => {
      const formatAmount = formatAmountUSDShow(item?.balanceInUsd);
      let text = '';
      if (isMainnet && formatAmount) {
        if (userInfo.hideAssets) {
          text = '****';
        } else {
          text = formatAmount;
        }
        return <span className="convert">{text}</span>;
      }
      return null;
    },
    [isMainnet, userInfo.hideAssets],
  );
  const handleChange = useCallback(
    (arr: string[] | string) => {
      console.log('arr is:', arr);
      const openArr = typeof arr === 'string' ? [arr] : arr;
      setOpenPanel(openArr);
    },
    [setOpenPanel],
  );
  const renderItem = useCallback(
    (item: ITokenSectionResponse) => {
      console.log('item', item);
      return (
        <Collapse.Panel
          key=""
          header={
            <li
              className="token-list-item flex-row-center"
              key={`${item.label}_${item.symbol}`}
              onClick={() => item.tokens && item.tokens.length == 1 && onNavigate(item.tokens, item.chainId)}>
              <div className="logos">
                <TokenImageDisplay width={40} className="token-icon" symbol={item.symbol} src={item.imageUrl} />
                <div className="logo-number-box">
                  {item?.tokens?.length === 1 ? (
                    <TokenImageDisplay
                      width={20}
                      className="token-icon"
                      symbol={item.symbol}
                      src={item.tokens[0].chainImageUrl}
                    />
                  ) : (
                    <div className="logo-number">2</div>
                  )}
                </div>
              </div>
              <div className="token-desc">
                <div className="info flex-between">
                  <span>{item.label ?? item.symbol}</span>
                  <span>{getTokenAmount(item)}</span>
                </div>
                <div className="amount flex-between">
                  {!!item.price && isMainnet && <span>${item.price}</span>}
                  {getAmountUSDShow(item)}
                </div>
              </div>
              {/* <div
                className={
                  openPanel.includes(index.toString()) ? 'more-wrapper' : 'more-wrapper more-wrapper-transparent'
                }>
                <CustomSvg
                  // className={openPanel.includes(index.toString()) ? 'is-active' : ''}
                  type={openPanel.includes(index.toString()) ? 'ActiveMore' : 'InteractiveMore'}
                />
              </div> */}
            </li>
          }>
          {/* <span>{transNetworkText(item.chainId, !isMainnet)}</span> */}

          <div className="item-wrapper">
            {/* {item.tokens.map((tokenItem) => {
             return (<div className="container">
              <Row className="row">
                <Col className="text" span={12}>
                  MainChain AELF
                </Col>
                <Col className="amount-container" span={12}>
                  <div className="amount">2,000</div>
                  <CustomSvg type="NewRightArrow" />
                </Col>
              </Row>
            </div>);
            }} */}
            {item?.tokens &&
              item?.tokens?.length > 1 &&
              item?.tokens?.map((tokenItem, index) => (
                <div
                  className="container"
                  key={`${tokenItem.symbol}_${index}`}
                  onClick={() => onNavigate(item?.tokens, tokenItem.chainId)}>
                  <Row className="row">
                    <Col className="row-first" span={12}>
                      <div className="symbol-logo">
                        <TokenImageDisplay width={40} className="token-icon" symbol={item.symbol} src={item.imageUrl} />
                        <TokenImageDisplay
                          width={20}
                          className="token-icon chain-logo"
                          symbol={item.symbol}
                          src={tokenItem.chainImageUrl}
                        />
                      </div>

                      <div className="text">
                        <div className="symbol">{tokenItem.label || tokenItem.symbol}</div>
                        <div className="chain-desc">{transNetworkText(tokenItem.chainId, !isMainnet)}</div>
                      </div>
                    </Col>

                    <Col className="amount-container" span={12}>
                      <div className="amount">
                        <div>{getTokenAmount(tokenItem)}</div>
                        <span>{getAmountUSDShow(tokenItem)}</span>
                      </div>
                      {/* <CustomSvg type="NewRightArrow" /> */}
                    </Col>
                  </Row>
                </div>
              ))}
          </div>
        </Collapse.Panel>
      );
    },
    [getAmountUSDShow, getTokenAmount, isMainnet, onNavigate],
  );
  return (
    <div className={clsx('tab-token', !hasMoreTokenList && 'hidden-loading-more')}>
      <Collapse onChange={handleChange}>{accountTokenList?.map((item) => renderItem(item))}</Collapse>
      <LoadingMore hasMore={!!hasMoreTokenList} loadMore={getMoreTokenList} className="load-more" />
      <div
        className={clsx(['add-token-wrapper flex-center', !isPrompt && 'add-token-wrapper-margin'])}
        onClick={handleAddToken}>
        <CustomSvgV3 type="manage-token" className="manage-token-icon" />
        <span className="add-token-text">{t('Add Tokens')}</span>
      </div>
    </div>
  );
}
