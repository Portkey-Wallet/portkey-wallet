import CommonHeader from 'components/CommonHeader';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps } from 'types/Profile';
import './index.less';
import { useIsShowDeletion } from '@portkey-wallet/hooks/hooks-ca/account';
import { useNavigateState } from 'hooks/router';

export default function WalletNamePopup({ headerTitle, goBack, data }: IProfileDetailProps) {
  const navigate = useNavigateState();
  const showDeletion = useIsShowDeletion();
  return (
    <div className="wallet-name-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      <ViewContactBody data={data} />

      {showDeletion && (
        <div
          className="account-cancelation flex-center"
          onClick={() => navigate('/setting/wallet/account-cancelation')}>
          Delete Wallet
        </div>
      )}
    </div>
  );
}
