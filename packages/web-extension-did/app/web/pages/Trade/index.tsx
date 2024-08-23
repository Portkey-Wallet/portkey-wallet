import { Button } from 'antd';
import CustomSvg, { SvgType } from 'components/CustomSvg';
import CommonHeader from 'components/CommonHeader';
import BottomBar from 'pages/components/BottomBar';
import { useCommonState, useLoading } from 'store/Provider/hooks';
import { useExtensionBridgeButtonShow, useExtensionNFTTabShow } from 'hooks/cms';
import { useCallback, useMemo, useRef, useState } from 'react';
import DisclaimerModal, { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';
import { useCheckSecurity } from 'hooks/useSecurity';
import { useOriginChainId } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { TradeTypeEnum } from 'constants/trade';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import { useDisclaimer } from '@portkey-wallet/hooks/hooks-ca/disclaimer';
import { getDisclaimerData } from 'utils/disclaimer';
import './index.less';

export default function TradePage() {
  const { isPrompt } = useCommonState();
  const { isBridgeShow } = useExtensionBridgeButtonShow();
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const disclaimerData = useRef<IDisclaimerProps>(initDisclaimerData);
  const checkSecurity = useCheckSecurity();
  const { setLoading } = useLoading();
  const originChainId = useOriginChainId();
  const { eBridgeUrl = '', awakenUrl = '', eForestUrl = '' } = useCurrentNetworkInfo();
  const { checkDappIsConfirmed } = useDisclaimer();
  const { isNFTTabShow } = useExtensionNFTTabShow();
  const tradeList = useMemo(
    () => [
      {
        icon: 'SwapFavicon',
        key: TradeTypeEnum.Swap,
        title: 'Swap',
        desc: 'Trade assets within the aelf ecosystem utilising DEX - AwakenSwap',
        btnContent: 'Swap Now',
      },
      {
        icon: 'BridgeFavicon',
        key: TradeTypeEnum.eBridge,
        title: 'Bridge',
        desc: 'Bridge assets in and out of aelf via cross-chain bridge - eBridge',
        btnContent: 'Cross-Chain Now',
      },
      {
        icon: 'ForestFavicon',
        key: TradeTypeEnum.eForest,
        title: 'NFT',
        desc: 'Create, mint, and trade various NFTs on the marketplace - Forest',
        btnContent: 'Explore Now',
      },
    ],
    [],
  );
  const tradeListShow = useMemo(
    () =>
      tradeList.filter((item) => {
        if (item.key === TradeTypeEnum.eBridge) {
          return isBridgeShow;
        }
        if (item.key === TradeTypeEnum.eForest) {
          return isNFTTabShow;
        }
        return true;
      }),
    [isBridgeShow, isNFTTabShow, tradeList],
  );

  const handleCheckSecurity = useCallback(async () => {
    try {
      setLoading(true);
      const isSafe = await checkSecurity(originChainId);
      setLoading(false);
      return isSafe;
    } catch (error) {
      setLoading(false);
      console.log('===handleCheckSecurity error', error);
      return false;
    }
  }, [checkSecurity, originChainId, setLoading]);

  const handleClick = useCallback(
    async (type: TradeTypeEnum) => {
      const isSecurity = await handleCheckSecurity();
      if (!isSecurity) return;
      let tradeLink = '';
      let originUrl = '';
      switch (type) {
        case TradeTypeEnum.Swap:
          tradeLink = awakenUrl;
          originUrl = awakenUrl;
          break;
        case TradeTypeEnum.eBridge:
          tradeLink = eBridgeUrl;
          originUrl = eBridgeUrl;
          break;
        case TradeTypeEnum.eForest:
          tradeLink = `${eForestUrl}/collections`;
          originUrl = eForestUrl;
          break;
      }
      if (checkDappIsConfirmed(originUrl)) {
        const openWinder = window.open(tradeLink, '_blank');
        if (openWinder) {
          openWinder.opener = null;
        }
      } else {
        disclaimerData.current = getDisclaimerData({ type, targetUrl: tradeLink, originUrl });
        setDisclaimerOpen(true);
      }
    },
    [awakenUrl, checkDappIsConfirmed, eBridgeUrl, eForestUrl, handleCheckSecurity],
  );

  return (
    <div className="trade-page-warp flex-column">
      <CommonHeader title="Trade" />
      <div className="trade-page-content flex-column flex-1">
        {tradeListShow.map((item, index) => (
          <div className="trade-item flex-column-center" key={`${item.title}_${index}`}>
            <CustomSvg className="trade-item-icon" type={item.icon as SvgType} />
            <div className="trade-item-title">{item.title}</div>
            <div className="trade-item-desc">{item.desc}</div>
            <Button type="primary" className="trade-item-btn" onClick={() => handleClick(item.key)}>
              {item.btnContent}
            </Button>
          </div>
        ))}
      </div>
      {!isPrompt && <BottomBar />}
      <DisclaimerModal open={disclaimerOpen} onClose={() => setDisclaimerOpen(false)} {...disclaimerData.current} />
    </div>
  );
}
