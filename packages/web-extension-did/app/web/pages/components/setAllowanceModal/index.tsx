import { ChainId } from '@portkey-wallet/types';
import { handleErrorMessage } from '@portkey-wallet/utils';
import { ModalProps, DrawerProps } from 'antd';
import BaseDrawer from 'components/BaseDrawer';
import BaseModal from 'components/BaseModal';
import ManagerApproveInner, { IManagerApproveInnerProps } from 'pages/AllowanceApprove/ManagerApproveInner';
import { useMemo } from 'react';
import { useCommonState } from 'store/Provider/hooks';
import singleMessage from 'utils/singleMessage';
import './index.less';

export interface IAllowanceModal extends IManagerApproveInnerProps, ModalProps, DrawerProps {
  onCancel: () => void;
  targetChainId: ChainId;
  dappInfo?: {
    icon?: string;
    origin?: string;
    name?: string;
  };
}

export default function AllowanceModal(props: IAllowanceModal) {
  const {
    onCancel,
    onFinish,
    targetChainId,
    amount,
    symbol,
    batchApproveNFT,
    dappInfo,
    open,
    caHash = '',
    networkType,
    originChainId,
    defaultIcon,
  } = props;
  const { isNotLessThan768 } = useCommonState();
  const mainContent = useMemo(
    () => (
      <div className="manager-approve-page-modal">
        <ManagerApproveInner
          networkType={networkType}
          originChainId={originChainId}
          targetChainId={targetChainId}
          caHash={caHash}
          amount={amount}
          symbol={symbol}
          batchApproveNFT={batchApproveNFT}
          dappInfo={{
            icon: dappInfo?.icon,
            href: dappInfo?.origin,
            name: dappInfo?.name,
          }}
          defaultIcon={defaultIcon}
          onCancel={onCancel}
          onFinish={onFinish}
          onError={(error) => {
            singleMessage.error(handleErrorMessage(error));
            onCancel();
          }}
        />
      </div>
    ),
    [
      amount,
      batchApproveNFT,
      caHash,
      dappInfo?.icon,
      dappInfo?.name,
      dappInfo?.origin,
      defaultIcon,
      networkType,
      onCancel,
      onFinish,
      originChainId,
      symbol,
      targetChainId,
    ],
  );
  return isNotLessThan768 ? (
    <BaseModal
      destroyOnClose
      open={open}
      wrapClassName="set-allowance-modal"
      maskClosable={true}
      closable={false}
      centered={true}
      onCancel={onCancel}
      footer={null}>
      {mainContent}
    </BaseModal>
  ) : (
    <BaseDrawer
      destroyOnClose
      open={open}
      className="set-allowance-drawer"
      height="544px"
      maskClosable={true}
      onClose={onCancel}
      placement="bottom">
      {mainContent}
    </BaseDrawer>
  );
}
