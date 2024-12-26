import { TradeTypeEnum } from 'constants/trade';
import { IDisclaimerProps, initDisclaimerData } from 'pages/components/DisclaimerModal';

export interface IGetDisclaimerData {
  originUrl: string;
  targetUrl: string;
  type: TradeTypeEnum;
}

export const getDisclaimerData = ({ type, targetUrl, originUrl }: IGetDisclaimerData) => {
  let data: IDisclaimerProps = initDisclaimerData;
  switch (type) {
    case TradeTypeEnum.ETrans:
      data = {
        targetUrl,
        originUrl,
        dappIcon: 'ETransFavicon',
        originTitle: 'ETransfer',
        titleText: 'You will be directed to a third-party DApp: ETransfer',
      };
      break;
    case TradeTypeEnum.Swap:
      data = {
        targetUrl,
        originUrl,
        dappIcon: 'SwapFavicon',
        originTitle: 'AwakenSwap',
        titleText: 'You will be directed to a third-party DApp: AwakenSwap',
      };
      break;
    case TradeTypeEnum.eBridge:
      data = {
        targetUrl,
        originUrl,
        dappIcon: 'BridgeFavicon',
        originTitle: 'eBridge',
        titleText: 'You will be directed to a third-party DApp: eBridge',
      };
      break;
    case TradeTypeEnum.eForest:
      data = {
        targetUrl,
        originUrl,
        dappIcon: 'ForestFavicon',
        originTitle: 'Forest',
        titleText: 'You will be directed to a third-party DApp: Forest',
      };
      break;
  }
  return data;
};
