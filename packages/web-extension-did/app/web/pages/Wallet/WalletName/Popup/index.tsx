import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps, MyProfilePageType } from 'types/Profile';
import './index.less';
import SetWalletNameForm from 'pages/Wallet/components/SetWalletNameForm';

export default function WalletNamePopup({
  headerTitle,
  goBack,
  type,
  data,
  showChat = false,
  editText,
  isShowRemark = false,
  handleEdit,
  handleCopy,
  saveCallback,
}: IProfileDetailProps) {
  return (
    <div className="wallet-name-popup min-width-max-height">
      <div className="nav-header">
        <BackHeader
          title={headerTitle}
          leftCallBack={goBack}
          rightElement={<CustomSvg type="Close2" onClick={goBack} />}
        />
      </div>
      {showChat && type === MyProfilePageType.VIEW && (
        <ViewContactBody
          data={data}
          editText={editText}
          isShowRemark={isShowRemark}
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
