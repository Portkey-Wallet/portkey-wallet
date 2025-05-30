import { useTranslation } from 'react-i18next';
import CustomSvg from 'components/CustomSvg';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useChangeNetwork } from 'hooks/useChangeNetwork';
import { useIsMainnet, useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { NetworkType } from '@portkey-wallet/types';
import { IconType } from 'types/icon';
import { useCallback } from 'react';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import CustomModal from 'pages/components/CustomModal';
import useChangeNetworkText from 'hooks/useChangeNetworkText';
import clsx from 'clsx';
import './index.less';

const netWorkIcon: Record<NetworkType, IconType> = {
  MAINNET: 'Aelf',
  TESTNET: 'elf-icon',
};

export default function NetworkList() {
  const { t } = useTranslation();

  const { currentNetwork } = useWallet();
  const NetworkList = useNetworkList();
  const changeNetwork = useChangeNetwork();
  const changeNetworkModalText = useChangeNetworkText();
  const isMainnet = useIsMainnet();
  const handleChangeNetwork = useCallback(
    (network: NetworkItem) => {
      if (network.networkType === currentNetwork) return;
      if (!network.isActive) return;
      const { title, content } = changeNetworkModalText(network.networkType);
      CustomModal({
        type: 'confirm',
        content: (
          <div className="change-network-modal">
            <div className="title">
              {title}
              <br />
              {`aelf ${isMainnet ? 'Testnet' : 'Mainnet'}`}
            </div>
            <div className="content">{content}</div>
          </div>
        ),
        onOk: () => {
          changeNetwork(network);
        },
        okText: 'Confirm',
      });
    },
    [changeNetwork, changeNetworkModalText, currentNetwork, isMainnet],
  );

  return (
    <div className="flex-column network-list">
      {NetworkList.map((net) => (
        <div
          key={net.networkType}
          className={clsx('network-item', !net.isActive && 'disabled')}
          onClick={() => handleChangeNetwork(net)}>
          <div className="network-item-checked">
            {currentNetwork === net.networkType && <CustomSvg type="selected" className="selected-svg" />}
          </div>
          <div className="network-item-icon">
            <CustomSvg type={netWorkIcon[net.networkType]} />
          </div>
          {t(net.name)}
        </div>
      ))}
    </div>

    // <div className="network-list">
    //   {allNetworkType.map((net) => (
    //     <div
    //       key={net.key}
    //       className={clsx('network-item', net.disabled ? 'disabled' : '')}
    //       onClick={() => handleChangeNet(net)}>
    //       <div className="network-item-checked">
    //         {curNet === net.key && <CustomSvg type="selected" className="selected-svg" />}
    //       </div>
    //       <div className="network-item-icon">
    //         <CustomSvg type={net.icon as any} />
    //       </div>
    //       {t(net.name)}
    //     </div>
    //   ))}
    // </div>
  );
}
