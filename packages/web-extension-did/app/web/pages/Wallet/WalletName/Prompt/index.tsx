import SecondPageHeader from 'pages/components/SecondPageHeader';
import ViewContactBody from 'pages/Contacts/components/ViewContactBody';
import { IProfileDetailProps } from 'types/Profile';
import './index.less';

export default function WalletNamePrompt({
  headerTitle,
  goBack,
  data,
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
    </div>
  );
}
