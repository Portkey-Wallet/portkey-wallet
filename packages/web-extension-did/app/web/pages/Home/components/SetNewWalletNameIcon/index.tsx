import { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Popover } from 'antd';
import CustomSvg from 'components/CustomSvg';
import { useSetNewWalletName } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import './index.less';

export default function SetNewWalletNameIcon() {
  const { shouldShowSetNewWalletNameIcon, handleSetNewWalletName } = useSetNewWalletName();
  const [isOpen, setIsOpen] = useState(false);

  const handlePopoverConfirm = useCallback(() => {
    setIsOpen(false);
    handleSetNewWalletName().catch((error) => {
      const msg = handleErrorMessage(error);
      singleMessage.error(msg);
    });
  }, [handleSetNewWalletName]);

  const popoverContent = useMemo(() => {
    return (
      <div className="popover-content-wrap flex-column">
        <div className="popover-content-prompt">
          Set your login account as your wallet name to make your wallet customised and recongnisable.
        </div>
        <div className="popover-content-confirm cursor-pointer" onClick={handlePopoverConfirm}>
          Set Wallet Name
        </div>
        <CustomSvg className="popover-close-icon cursor-pointer" type="SuggestClose" onClick={() => setIsOpen(false)} />
      </div>
    );
  }, [handlePopoverConfirm]);

  if (!shouldShowSetNewWalletNameIcon) return null;

  return (
    <Popover
      overlayClassName="set-new-wallet-name-popover"
      placement="bottomLeft"
      trigger="click"
      showArrow={false}
      content={popoverContent}
      open={isOpen}
      onOpenChange={(visible) => setIsOpen(visible)}>
      <div
        className={clsx('set-new-wallet-name-icon-wrap', 'flex-center', 'cursor-pointer', {
          ['set-new-wallet-name-icon-wrap-active']: isOpen,
        })}>
        <CustomSvg className="set-new-wallet-name-icon" type="InfoOutlined" />
      </div>
    </Popover>
  );
}
