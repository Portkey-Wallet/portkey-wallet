import SecondPageHeader from 'pages/components/SecondPageHeader';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps, MyProfilePageType } from 'types/Profile';
import './index.less';
import SetWalletNameForm from 'pages/Wallet/components/SetWalletNameForm';

export default function WalletNamePrompt({
  headerTitle,
  goBack,
  data,
  showChat = false,
  type,
  editText,
  isShowRemark = false,
  isShowAddContactBtn = false,
  isShowAddedBtn = false,
  isShowChatBtn = false,
  handleEdit,
  handleCopy,
  saveCallback,
}: IProfileDetailProps) {
  return (
    <div className="wallet-name-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />

      {showChat && type === MyProfilePageType.VIEW && (
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
      {showChat && type === MyProfilePageType.EDIT && (
        <SetWalletNameForm data={data} handleCopy={handleCopy} saveCallback={saveCallback} />
      )}
      {!showChat && <SetWalletNameForm data={data} handleCopy={handleCopy} saveCallback={saveCallback} />}
    </div>
  );
}
