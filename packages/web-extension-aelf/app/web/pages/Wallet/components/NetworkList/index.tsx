import { useTranslation } from 'react-i18next';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import { useWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { useChangeNetwork } from 'hooks/useChangeNetwork';
import { useNetworkList } from '@portkey-wallet/hooks/hooks-ca/network';
import { NetworkType } from '@portkey-wallet/types';
import { IconTypeV3 } from 'types/icon';
import { useCallback } from 'react';
import { NetworkItem } from '@portkey-wallet/types/types-ca/network';
import { CustomModalBottom } from 'pages/components/CustomModalBottom';
import useChangeNetworkText from 'hooks/useChangeNetworkText';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
import MenuItem from 'components/MenuItem';
import './index.less';

const netWorkIcon: Record<NetworkType, IconTypeV3> = {
  MAINNET: 'Chain=AELF Main',
  TESTNET: 'Chain=Testnet',
};

export default function NetworkList() {
  const { t } = useTranslation();
  const { isPrompt } = useCommonState();

  const { currentNetwork } = useWallet();
  const NetworkList = useNetworkList();
  const changeNetwork = useChangeNetwork();
  const changeNetworkModalText = useChangeNetworkText();
  // const isMainnet = useIsMainnet();
  const handleChangeNetwork = useCallback(
    (network: NetworkItem) => {
      if (network.networkType === currentNetwork) return;
      if (!network.isActive) return;
      // const { title, content } = changeNetworkModalText(network.networkType);
      const { content } = changeNetworkModalText(network.networkType);
      CustomModalBottom({
        isPrompt,
        type: 'confirm',
        content: (
          <div className="change-network-modal">
            <div className="title">
              {/*{title}*/}
              Confirm network switch
              {/*<br />*/}
              {/*{`aelf ${isMainnet ? 'Testnet' : 'Mainnet'}`}*/}
            </div>
            <div className="content">{content}</div>
          </div>
        ),
        onOk: () => {
          changeNetwork(network);
        },
        cancelText: 'Cancel',
        okText: 'Confirm',
      });
    },
    [changeNetwork, changeNetworkModalText, currentNetwork, isPrompt],
  );

  return (
    <div className="flex-column network-list">
      <div className="menu-list">
        {NetworkList.map((net) => (
          <MenuItem
            key={net.networkType}
            height={74}
            showEnterIcon={currentNetwork !== net.networkType}
            className={clsx('network-item', (!net.isActive || currentNetwork === net.networkType) && 'disabled')}
            onClick={() => handleChangeNetwork(net)}>
            <div className="flex-row-center">
              <div className="network-item-icon">
                <CustomSvgV3 type={netWorkIcon[net.networkType]} />
              </div>
              {t(net.name)}
              {currentNetwork === net.networkType && <div className="network-current-tag">{t('Current')}</div>}
            </div>
          </MenuItem>
        ))}
      </div>
    </div>
  );
}
