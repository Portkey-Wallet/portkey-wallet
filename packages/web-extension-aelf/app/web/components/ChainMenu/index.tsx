import { ChainChangeHandler, ChainItemType } from '@portkey-wallet/types/chain';
import { Button } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { forwardRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useCommonState } from 'store/Provider/hooks';
import './index.less';
interface ChainMenuProps {
  chainList: ChainItemType[];
  initState?: ChainItemType;
  onChainChange?: ChainChangeHandler;
  onChainRemove: ChainChangeHandler;
  onManageChain?: () => void;
  onClose?: () => void;
}

const ChainMenu = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ initState, chainList, onManageChain, onChainChange, onClose }: ChainMenuProps, _ref) => {
    const { t } = useTranslation();
    const { isPrompt } = useCommonState();
    const navigate = useNavigate();
    const items = useMemo(() => {
      const list = chainList
        .filter((chain) => chain.isCommon)
        .map((chain) => ({
          label: <span>{chain.networkName}</span>,
          key: chain.rpcUrl,
        }));
      return list;
    }, [chainList]);

    const manageKey = useMemo(() => initState?.rpcUrl, [initState?.rpcUrl]);

    const handleItemClick = useCallback(
      (info: { key: string }) => {
        if (info.key === manageKey) return;
        const select = chainList.filter((item) => item.rpcUrl === info.key);
        onClose?.();
        onChainChange?.(select[0]);
      },
      [chainList, manageKey, onChainChange, onClose],
    );

    return (
      <div className="chain-menu">
        <p className="title">{t('Networks')}</p>
        <div className="chain-wrap">
          {items.map((item) => (
            <div className="chain-item" key={item?.key} onClick={handleItemClick.bind(undefined, item)}>
              {item.key === manageKey ? (
                <CustomSvg className="select-flag" type="TickGreen" />
              ) : (
                <div className="empty" />
              )}
              <CustomSvg className="aelf-icon" type="Aelf" />
              {item.label}
            </div>
          ))}
        </div>
        <div className="button-wrap">
          <Button
            onClick={() => {
              onClose?.();
              if (!isPrompt) {
                onManageChain?.();
              } else {
                navigate('/setting/manage-networks');
              }
            }}>
            {t('Manage Networks')}
          </Button>
        </div>
      </div>
    );
  },
);

export default ChainMenu;
