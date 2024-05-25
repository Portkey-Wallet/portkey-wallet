import { useNavigate } from 'react-router';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import CommonHeader from 'components/CommonHeader';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';
import './index.less';

interface ICommonTokenHeaderProps {
  symbol?: string;
  imgUrl?: string;
  chainId: string;
  onLeftBack?: () => void;
}

export default function CommonTokenHeader({ symbol, imgUrl, chainId, onLeftBack }: ICommonTokenHeaderProps) {
  const isMainNet = useIsMainnet();
  const navigate = useNavigate();

  return (
    <CommonHeader
      className="common-token-header"
      title={
        <div className="title flex-column">
          <div className="symbol flex-row-center">
            <TokenImageDisplay symbol={symbol} src={imgUrl} width={20} />
            <span>{symbol}</span>
          </div>
          <div className="network">{transNetworkText(chainId, !isMainNet)}</div>
        </div>
      }
      onLeftBack={onLeftBack || (() => navigate('/'))}
    />
  );
}
