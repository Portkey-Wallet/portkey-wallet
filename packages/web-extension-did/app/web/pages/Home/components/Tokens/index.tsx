import { ITokenItemResponse, ITokenSectionResponse } from '@portkey-wallet/types/types-ca/token';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { formatAmountUSDShow, formatTokenAmountShowWithDecimals } from '@portkey-wallet/utils/converter';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import LoadingMore from 'components/LoadingMore/LoadingMore';
import { PAGE_SIZE_IN_ACCOUNT_TOKEN } from '@portkey-wallet/constants/constants-ca/assets';
import { useCaAddressInfoList, useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useAccountTokenInfo } from '@portkey-wallet/hooks/hooks-ca/assets';
import './index.less';
import { useEffectOnce } from 'react-use';
import useGAReport from 'hooks/useGAReport';
import clsx from 'clsx';
import { Row, Col, Collapse } from 'antd';
import CustomSvg from 'components/CustomSvg';

export default function TokenList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMainnet = useIsMainnet();
  const caAddressInfos = useCaAddressInfoList();
  const userInfo = useCurrentUserInfo();
  const { accountTokenList, totalRecordCount, fetchAccountTokenInfoList } = useAccountTokenInfo();
  const hasMoreTokenList = useMemo(
    () => accountTokenList.length < totalRecordCount,
    [accountTokenList.length, totalRecordCount],
  );
  const [openPanel, setOpenPanel] = useState<string[]>([]);

  const { startReport, endReport } = useGAReport();

  useEffectOnce(() => {
    startReport('Home-TokenList');
  });

  useEffect(() => {
    fetchAccountTokenInfoList({ caAddressInfos, skipCount: 0, maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN }).then(() => {
      endReport('Home-TokenList');
    });
  }, [caAddressInfos, endReport, fetchAccountTokenInfoList]);

  const onNavigate = useCallback(
    (tokenInfo: ITokenItemResponse) => {
      navigate('/token-detail', { state: tokenInfo });
    },
    [navigate],
  );

  const getMoreTokenList = useCallback(async () => {
    if (accountTokenList.length < totalRecordCount) {
      await fetchAccountTokenInfoList({
        caAddressInfos,
        skipCount: accountTokenList.length,
        maxResultCount: PAGE_SIZE_IN_ACCOUNT_TOKEN,
      });
    }
  }, [accountTokenList.length, caAddressInfos, fetchAccountTokenInfoList, totalRecordCount]);

  const handleAddToken = useCallback(() => {
    navigate('/add-token');
    return;
  }, [navigate]);

  const getTokenAmount = useCallback(
    (item: { balance?: string; decimals?: number }) =>
      userInfo.hideAssets ? '****' : formatTokenAmountShowWithDecimals(item.balance, item.decimals),
    [userInfo.hideAssets],
  );

  const getAmountUSDShow = useCallback(
    (item: ITokenSectionResponse) => {
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
    (item: ITokenSectionResponse, index: number) => {
      return (
        <Collapse.Panel
          key=""
          header={
            <li
              className="token-list-item flex-row-center"
              key={`${item.label}_${item.symbol}`}
              // onClick={() => onNavigate(item)}
            >
              <TokenImageDisplay width={36} className="token-icon" symbol={item.symbol} src={item.imageUrl} />
              <div className="token-desc">
                <div className="info flex-between">
                  <span>{item.label ?? item.symbol}</span>
                  <span>{getTokenAmount(item)}</span>
                </div>
                <div className="amount flex-between">
                  {!!item.price && <span>${item.price}</span>}
                  {getAmountUSDShow(item)}
                </div>
              </div>
              <div
                className={
                  openPanel.includes(index.toString()) ? 'more-wrapper' : 'more-wrapper more-wrapper-transparent'
                }>
                <CustomSvg
                  // className={openPanel.includes(index.toString()) ? 'is-active' : ''}
                  type={openPanel.includes(index.toString()) ? 'ActiveMore' : 'InteractiveMore'}
                />
              </div>
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
            {item?.tokens?.map((tokenItem, index) => (
              <div
                className="container"
                style={{ marginTop: index !== 0 ? 4 : 0 }}
                key={`${tokenItem.symbol}_${index}`}
                onClick={() => onNavigate(tokenItem)}>
                <Row className="row">
                  <Col className="text" span={12}>
                    {transNetworkText(tokenItem.chainId, !isMainnet)}
                  </Col>
                  <Col className="amount-container" span={12}>
                    <div className="amount">{getTokenAmount(tokenItem)}</div>
                    <CustomSvg type="NewRightArrow" />
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Collapse.Panel>
      );
    },
    [getAmountUSDShow, getTokenAmount, isMainnet, onNavigate, openPanel],
  );
  return (
    <div className={clsx('tab-token', !hasMoreTokenList && 'hidden-loading-more')}>
      <Collapse onChange={handleChange}>{accountTokenList.map((item, index) => renderItem(item, index))}</Collapse>
      <LoadingMore hasMore={hasMoreTokenList} loadMore={getMoreTokenList} className="load-more" />

      <div className="add-token-wrapper flex-center" onClick={handleAddToken}>
        <span className="add-token-text">{t('Add Tokens')}</span>
      </div>
    </div>
  );
}
