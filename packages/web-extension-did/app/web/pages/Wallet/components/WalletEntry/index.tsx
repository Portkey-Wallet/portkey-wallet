import UploadOrViewAvatar from 'pages/components/UploadOrViewAvatar';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import MenuItem from 'components/MenuItem';
import './index.less';

export interface IWalletEntryProps {
  walletAvatar: string;
  walletName: string;
  portkeyId: string;
  clickAvatar: () => void;
}

export default function WalletEntry({ walletAvatar, walletName, portkeyId, clickAvatar }: IWalletEntryProps) {
  return (
    <MenuItem className="wallet-entry" height={108} onClick={clickAvatar}>
      <div className="flex-start-center wallet-entry-main">
        <UploadOrViewAvatar
          avatarUrl={walletAvatar}
          nameIndex={walletName?.substring(0, 1).toLocaleUpperCase()}
          isEdit={false}
        />
        <div className="wallet-info">
          <div className="wallet-info-name">{walletName}</div>
          <div className="wallet-info-portkey-id">{`Portkey ID: ${formatStr2EllipsisStr(portkeyId, [4, 6])}`}</div>
        </div>
      </div>
    </MenuItem>
  );
}
