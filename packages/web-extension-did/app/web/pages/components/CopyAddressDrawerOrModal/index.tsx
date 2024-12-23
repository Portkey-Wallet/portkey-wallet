import { useState, forwardRef, useImperativeHandle, useMemo, useCallback, Fragment } from 'react';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { addressFormat } from '@portkey-wallet/utils';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import CommonCloseHeader from 'components/CommonCloseHeader';
import singleMessage from 'utils/singleMessage';
import { useCopyToClipboard } from 'react-use';
// import { NetworkType } from '@portkey-wallet/types';
// import { IconType } from 'types/icon';
import BaseDrawer from '../BaseDrawer';
import { useCommonState } from 'store/Provider/hooks';
import BaseModal from 'components/BaseModal';
import './index.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';
// import CustomSvg from 'components/CustomSvg';

export interface ICopyAddressDrawerOrModalInstance {
  open: () => void;
}

const CopyAddressDrawerOrModal = forwardRef((_, ref) => {
  const { isNotLessThan768 } = useCommonState();
  const isMainnet = useIsMainnet();
  const caAddressInfos = useCaAddressInfoList();

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));
  const [, setCopied] = useCopyToClipboard();

  const renderAddressItem = ({
    address,
    chainId,
  }: {
    address: string;
    chainId: ChainId;
    imgUrl: string | undefined;
  }) => {
    const formatChain = transNetworkText(chainId, !isMainnet);
    const formatAddress = addressFormat(address, chainId);

    return (
      <div className="address-item flex-row-between">
        <div className="network-item-info">
          <div className="network-item-icon">
            <CustomSvgV3 type={formatChain.includes('dAppChain') ? 'elf-icon' : 'Aelf'} />
          </div>
          <div className="address-wrap flex-column">
            <div className="chain">{formatChain}</div>
            <div className="address">{formatStr2EllipsisStr(formatAddress, [8, 9])}</div>
          </div>
        </div>

        <CustomSvgV3
          type="copyAddress"
          onClick={() => {
            setCopied(formatAddress);
            singleMessage.success('Copy Success');
          }}
        />
      </div>
    );
  };

  const renderAddressList = () => (
    <div className="address-list flex-column">
      {caAddressInfos.map((item, index) => (
        <Fragment key={index}>
          {renderAddressItem({
            address: item.caAddress,
            chainId: item.chainId,
            imgUrl: item.chainImageUrl,
          })}
        </Fragment>
      ))}
    </div>
  );

  const commonProps = useMemo(
    () => ({
      destroyOnClose: true,
      open: isOpen,
      onClose: handleClose,
    }),
    [isOpen, handleClose],
  );

  return isNotLessThan768 ? (
    <BaseModal {...commonProps} footer={false} centered closable={false} className="copy-address-modal" maskClosable>
      <CommonCloseHeader title="Your addresses" onClose={handleClose} />
      {renderAddressList()}
    </BaseModal>
  ) : (
    <BaseDrawer
      {...commonProps}
      className="common-drawer copy-address-drawer"
      height="220"
      maskClosable
      placement="bottom">
      <CommonCloseHeader title="Your addresses" onClose={handleClose} />
      {renderAddressList()}
    </BaseDrawer>
  );
});

export default CopyAddressDrawerOrModal;
