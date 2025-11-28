import { useState, useMemo, Fragment, useEffect } from 'react';
import { ChainId } from '@portkey-wallet/types';
import { addressFormat } from '@portkey-wallet/utils';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import CommonCloseHeader from 'components/CommonCloseHeader';
import singleMessage from 'utils/singleMessage';
import { useCopyToClipboard } from 'react-use';
import { useCurrentAccount } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import { useCurrentNetwork } from '@portkey-wallet/hooks/hooks-eoa/network';
import BaseDrawer from '../BaseDrawer';
import { useCommonState } from 'store/Provider/hooks';
import BaseModal from 'components/BaseModal';
import './index.less';
import { CustomSvgV3 } from 'components/CustomSvgV3';

export interface ICopyAddressDrawerOrModalProps {
  open: boolean;
  onClose: () => void;
  customAddress?: string;
}

interface IModalAddressInfo {
  chain: ChainId;
  name: string;
  // icon: IconName;
  addressFormatted: string;
  addressShow: string;
}

const modalAddressInfoMainnet: IModalAddressInfo[] = [
  {
    chain: 'tDVV',
    // icon: 'Chain=AELF Side',
    name: 'aelf dAppChain',
    addressFormatted: '',
    addressShow: '',
  },
  {
    chain: 'AELF',
    // icon: 'Chain=AELF Main',
    name: 'aelf MainChain',
    addressFormatted: '',
    addressShow: '',
  },
];

const modalAddressInfoTestnet: IModalAddressInfo[] = [
  {
    chain: 'tDVW',
    // icon: 'Chain=AELF Side',
    name: 'aelf dAppChain',
    addressFormatted: '',
    addressShow: '',
  },
  {
    chain: 'AELF',
    // icon: 'Chain=AELF Main',
    name: 'aelf MainChain',
    addressFormatted: '',
    addressShow: '',
  },
];

const CopyAddressDrawerOrModal: React.FC<ICopyAddressDrawerOrModalProps> = ({ open, onClose, customAddress }) => {
  const { isNotLessThan768 } = useCommonState();
  const userInfo = useCurrentAccount();
  const currentNetwork = useCurrentNetwork();

  const [addressesShowInfo, setAddressesShowInfo] = useState<IModalAddressInfo[]>([]);

  useEffect(() => {
    const address = customAddress || userInfo?.address || '';
    const addressesShowInfo = (currentNetwork === 'TESTNET' ? modalAddressInfoTestnet : modalAddressInfoMainnet).map(
      (_addressInfo) => {
        const addressFormatted = addressFormat(address, _addressInfo.chain);
        return {
          ..._addressInfo,
          addressFormatted,
          // addressShow: formatStr2EllipsisStr(addressFormatted, 8),
          addressShow: address,
        };
      },
    );
    setAddressesShowInfo(addressesShowInfo);
  }, [currentNetwork, userInfo?.address, customAddress]);

  const [, setCopied] = useCopyToClipboard();

  const renderAddressItem = ({ address, chainId }: { address: string; chainId: ChainId }) => {
    const formatChain = transNetworkText(chainId, !(currentNetwork === 'MAINNET'));
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
            onClose();
          }}
        />
      </div>
    );
  };

  const renderAddressList = () => (
    <div className="address-list">
      {addressesShowInfo.map((item, index) => (
        <Fragment key={index}>
          {renderAddressItem({
            address: item.addressShow,
            chainId: item.chain,
            // imgUrl: item.chainImageUrl,
          })}
        </Fragment>
      ))}
    </div>
  );

  const commonProps = useMemo(
    () => ({
      destroyOnClose: true,
      open: open,
      onClose: onClose,
    }),
    [open, onClose],
  );

  return isNotLessThan768 ? (
    <BaseModal {...commonProps} footer={false} centered closable={false} className="copy-address-modal" maskClosable>
      <CommonCloseHeader title="Your addresses" onClose={onClose} />
      {renderAddressList()}
    </BaseModal>
  ) : (
    <BaseDrawer
      {...commonProps}
      className="common-drawer copy-address-drawer"
      height="220"
      maskClosable
      placement="bottom">
      <CommonCloseHeader title="Your addresses" onClose={onClose} />
      {renderAddressList()}
    </BaseDrawer>
  );
};

export default CopyAddressDrawerOrModal;
