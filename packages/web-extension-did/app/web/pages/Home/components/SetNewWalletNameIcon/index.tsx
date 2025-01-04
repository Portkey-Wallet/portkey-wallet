import { useCallback, useState } from 'react';
import { useSetNewWalletName } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { handleErrorMessage } from '@portkey-wallet/utils';
import singleMessage from 'utils/singleMessage';
import './index.less';
import { PromptCardType } from '@portkey/did-ui-react/dist/_types/src/components/CommonPromptCard';
import { CommonPromptCard } from '@portkey/did-ui-react';

export default function SetNewWalletNameIcon() {
  const { shouldShowSetNewWalletNameModal, handleSetNewWalletName } = useSetNewWalletName();
  const [hidden, setHidden] = useState(false);

  const handlePopoverConfirm = useCallback(async () => {
    await handleSetNewWalletName()
      .then(() => {
        singleMessage.success('Wallet name updated.');
        setHidden(true);
      })
      .catch((error) => {
        const msg = handleErrorMessage(error);
        singleMessage.error(msg);
      });
  }, [handleSetNewWalletName]);

  if (!shouldShowSetNewWalletNameModal || hidden) return null;
  // if (hidden) return null;

  return (
    <CommonPromptCard
      className="set-new-wallet-name"
      title=""
      type={'warning' as PromptCardType}
      description={
        <div>
          <div>Use your login account as your wallet name to give it a unique identity.</div>
          <div className="set-name-button" onClick={handlePopoverConfirm}>
            Set it now
          </div>
        </div>
      }
    />
  );
}
