import SecondPageHeader from 'pages/components/SecondPageHeader';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps, MyProfilePageType } from 'types/Profile';
import './index.less';
import SetWalletNameForm from 'pages/Wallet/components/SetWalletNameForm';
import { useNavigateState } from 'hooks/router';
import { useIsShowDeletion } from '@portkey-wallet/hooks/hooks-ca/account';

export default function WalletNamePrompt({
  headerTitle,
  goBack,
  data,
  type,
  editText,
  isShowRemark = false,
  handleEdit,
  saveCallback,
}: IProfileDetailProps) {
  const navigate = useNavigateState();
  const showDeletion = useIsShowDeletion();

  return (
    <div className="wallet-name-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />

      {type === MyProfilePageType.VIEW && (
        <ViewContactBody data={data} editText={editText} isShowRemark={isShowRemark} handleEdit={handleEdit} />
      )}
      {type === MyProfilePageType.EDIT && <SetWalletNameForm data={data} saveCallback={saveCallback} />}

      {showDeletion && type === MyProfilePageType.VIEW && (
        <div
          className="account-cancelation flex-center"
          onClick={() => navigate('/setting/wallet/account-cancelation')}>
          Account Cancelation
        </div>
      )}
    </div>
  );
}
