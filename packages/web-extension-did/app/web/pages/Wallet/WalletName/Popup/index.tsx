import CommonHeader from 'components/CommonHeader';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps, MyProfilePageType } from 'types/Profile';
import './index.less';
import SetWalletNameForm from 'pages/Wallet/components/SetWalletNameForm';
import { useCommonState } from 'store/Provider/hooks';
import { useIsShowDeletion } from '@portkey-wallet/hooks/hooks-ca/account';
import { useNavigateState } from 'hooks/router';

export default function WalletNamePopup({
  headerTitle,
  goBack,
  type,
  data,
  editText,
  isShowRemark = false,
  handleEdit,
  saveCallback,
}: IProfileDetailProps) {
  const navigate = useNavigateState();
  const { isPrompt } = useCommonState();
  const showDeletion = useIsShowDeletion();

  return (
    <div className="wallet-name-popup min-width-max-height">
      <CommonHeader title={headerTitle} onLeftBack={goBack} />
      {type === MyProfilePageType.VIEW && (
        <ViewContactBody data={data} editText={editText} isShowRemark={isShowRemark} handleEdit={handleEdit} />
      )}
      {type === MyProfilePageType.EDIT && <SetWalletNameForm data={data} saveCallback={saveCallback} />}

      {showDeletion && isPrompt && type === MyProfilePageType.VIEW && (
        <div
          className="account-cancelation flex-center"
          onClick={() => navigate('/setting/wallet/account-cancelation')}>
          Account Deletion
        </div>
      )}
    </div>
  );
}
