import MenuItem from 'components/MenuItem';
import './index.less';
import Avatar from 'pages/components/Avatar';
import { TAccountInfo } from '@portkey-wallet/types/types-eoa/wallet';

export interface IWalletEntryProps {
  walletAvatar?: string;
  walletName: string;
  portkeyId?: string;
  clickAvatar: () => void;
  addressesTotalBalanceInUsd?: {
    [key: string]: string;
  };
  currentAccount?: TAccountInfo;
}

export default function WalletEntry({
  walletAvatar,
  walletName,
  clickAvatar,
  addressesTotalBalanceInUsd,
  currentAccount,
}: IWalletEntryProps) {
  return (
    <MenuItem className="wallet-entry" height={72} onClick={clickAvatar}>
      <div className="flex-between">
        <div className="flex-start-center wallet-entry-main">
          <Avatar avatarUrl={walletAvatar} nameIndex={walletName?.substring(0, 1).toLocaleUpperCase()} size="large" />
          <div className="wallet-info">
            <div className="wallet-info-name">{walletName}</div>
          </div>
        </div>
        <div className="flex-start-center">
          {addressesTotalBalanceInUsd && currentAccount?.address
            ? `$${addressesTotalBalanceInUsd[currentAccount?.address] || '0'}`
            : ''}
        </div>
      </div>
    </MenuItem>
  );
}
