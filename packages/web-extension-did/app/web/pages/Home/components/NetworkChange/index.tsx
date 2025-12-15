import { useCallback, useEffect, useState } from 'react';
import { useCurrentNetwork, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import './index.less';
import { CommonModal, CommonButton } from '@portkey/did-ui-react';
import CommonHeader from 'components/CommonHeader';
import { useChangeNetwork } from '../../../../hooks/useChangeNetwork';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';

export default function NetworkChange() {
  const currentNetwork = useCurrentNetwork();
  const changeNetwork = useChangeNetwork();
  const NetworkList = useNetworkList();

  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (currentNetwork === 'TESTNET') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [currentNetwork]);

  const onClick = useCallback(() => {
    const targetNetwork = NetworkList.find((network) => network.networkType === 'MAINNET');
    changeNetwork(targetNetwork as unknown as NetworkItem);
  }, [changeNetwork, NetworkList]);

  return (
    <CommonModal closable={false} maskClosable={false} open={open}>
      <CommonHeader title="Mainnet Only Support" />
      <div className="network-change-modal-content">
        Our blockchain wallet currently supports mainnet only. Testnet support is no longer available.
      </div>
      <div className="network-change-modal-button-wrap">
        <CommonButton className="common-button" type="primary" onClick={onClick}>
          Switch to Mainnet
        </CommonButton>
      </div>
    </CommonModal>
  );
}
