import SecondPageHeader from 'pages/components/SecondPageHeader';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps, MyProfilePageType } from 'types/Profile';
import './index.less';
import SetWalletNameForm from 'pages/Wallet/components/SetWalletNameForm';

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
  return (
    <div className="wallet-name-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />

      {type === MyProfilePageType.VIEW && (
        <ViewContactBody data={data} editText={editText} isShowRemark={isShowRemark} handleEdit={handleEdit} />
      )}
      {type === MyProfilePageType.EDIT && <SetWalletNameForm data={data} saveCallback={saveCallback} />}
    </div>
  );
}
