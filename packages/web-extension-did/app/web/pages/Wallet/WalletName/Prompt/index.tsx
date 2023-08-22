import SecondPageHeader from 'pages/components/SecondPageHeader';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps, MyProfilePageType } from 'types/Profile';
import './index.less';
import SetWalletNameForm from 'pages/Wallet/components/SetWalletNameForm';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

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
  saveCallback,
}: IProfileDetailProps) {
  const isMainNet = useIsMainnet();

  return (
    <div className="wallet-name-prompt">
      <SecondPageHeader title={headerTitle} leftCallBack={goBack} />

      {isMainNet && type === MyProfilePageType.VIEW && (
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
      {isMainNet && type === MyProfilePageType.EDIT && (
        <SetWalletNameForm data={data} handleCopy={handleCopy} saveCallback={saveCallback} />
      )}
      {!isMainNet && <SetWalletNameForm data={data} handleCopy={handleCopy} saveCallback={saveCallback} />}
    </div>
  );
}
