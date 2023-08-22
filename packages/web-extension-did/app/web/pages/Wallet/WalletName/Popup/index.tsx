import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps, MyProfilePageType } from 'types/Profile';
import './index.less';
import SetWalletNameForm from 'pages/Wallet/components/SetWalletNameForm';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';

export default function WalletNamePopup({
  headerTitle,
  goBack,
  type,
  data,
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
    <div className="wallet-name-popup min-width-max-height">
      <div className="nav-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
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
