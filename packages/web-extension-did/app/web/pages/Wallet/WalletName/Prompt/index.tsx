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
  isShowAddContactBtn = false,
  isShowAddedBtn = false,
  isShowChatBtn = false,
  handleEdit,
  handleCopy,
}: IProfileDetailProps) {
  return (
    <div className="wallet-name-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />
      {type === MyProfilePageType.VIEW && (
        <ViewContactBody
          data={data}
          editText={editText}
          isShowRemark={isShowRemark}
          isShowAddContactBtn={isShowAddContactBtn}
          isShowAddedBtn={isShowAddedBtn}
          isShowChatBtn={isShowChatBtn}
          handleEdit={handleEdit}
          handleCopy={handleCopy}
        />
      )}
      {type === MyProfilePageType.EDIT && <SetWalletNameForm data={data} handleCopy={handleCopy} />}
    </div>
  );
}
