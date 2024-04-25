import { TradeTypeEnum } from 'constants/trade';
import { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';

export const getDisclaimerData = (dappUrl: string, type: TradeTypeEnum) => {
  let data: IDisclaimerProps = initDisclaimerData;
  switch (type) {
    case TradeTypeEnum.ETrans:
      data = {
        targetUrl: dappUrl,
        originUrl: dappUrl,
        dappIcon: 'ETransFavicon',
        originTitle: 'ETransfer',
        titleText: 'You will be directed to a third-party DApp: ETransfer',
      };
      break;
    case TradeTypeEnum.Swap:
      data = {
        targetUrl: dappUrl,
        originUrl: dappUrl,
        dappIcon: 'BridgeFavicon', // TODO
        originTitle: 'eBridge', // TODO
        titleText: 'You will be directed to a third-party DApp: Swap',
      };
      break;
    case TradeTypeEnum.eBridge:
      data = {
        targetUrl: dappUrl,
        originUrl: dappUrl,
        dappIcon: 'BridgeFavicon',
        originTitle: 'eBridge',
        titleText: 'You will be directed to a third-party DApp: eBridge',
      };
      break;
  }
  return data;
};
