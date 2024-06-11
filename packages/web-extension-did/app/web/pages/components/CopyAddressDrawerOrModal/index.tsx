import { useState, forwardRef, useImperativeHandle, useMemo, useCallback, Fragment } from 'react';
import { useCaAddressInfoList } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { ChainId } from '@portkey-wallet/types';
import { addressFormat } from '@portkey-wallet/utils';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import CommonCloseHeader from 'components/CommonCloseHeader';
import Copy, { CopySize } from 'components/CopyAddress';
import BaseDrawer from '../BaseDrawer';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';

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

  const renderAddressItem = ({ address, chainId }: { address: string; chainId: ChainId }) => {
    const formatChain = transNetworkText(chainId, !isMainnet);
    const formatAddress = addressFormat(address, chainId);
    return (
      <div className="address-item flex-row-between">
        <div className="address-wrap flex-column">
          <div className="chain">{formatChain}</div>
          <div className="address">{formatStr2EllipsisStr(formatAddress, [8, 9])}</div>
        </div>
        <Copy className="address-copy" size={CopySize.Middle} toCopy={formatAddress} />
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
    // TODO: CopyAddressModal
    <></>
  ) : (
    <BaseDrawer
      {...commonProps}
      className="common-drawer copy-address-drawer"
      height="280"
      maskClosable
      placement="bottom">
      <CommonCloseHeader title="Copy Address" onClose={handleClose} />
      {renderAddressList()}
    </BaseDrawer>
  );
});

export default CopyAddressDrawerOrModal;
