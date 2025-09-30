import React, { useState, useCallback } from 'react';
import { CommonButton } from '@portkey/did-ui-react';
import singleMessage from 'utils/singleMessage';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import './ImportWallet.less';
import { useLocationState, useNavigateState } from 'hooks/router';
import { useAddWallet } from '@portkey-wallet/hooks/hooks-eoa/wallet';
import CommonHeader from 'components/CommonHeader';
import { useNavigate } from 'react-router';
import { SWEventDispatchAccountsChangedWithCurrentAccount } from 'utils/Wallet/account';
import { CommonTooltip } from 'components/CommonTooltipV2';

// Shared import logic hook
function useWalletImportHandler() {
  const addWallet = useAddWallet();
  const navigate = useNavigateState();
  const [imported, setImported] = useState(false);

  const handleImport = useCallback(
    async (pin: string, mnemonic?: string, privateKey?: string) => {
      const result = await addWallet(pin, mnemonic, privateKey, false);
      if (!result || !result.success) {
        singleMessage.error(result?.message || 'Failed to be imported');
        return false;
      } else {
        singleMessage.success('Successfully imported');
        setImported(true);
        setTimeout(async () => {
          await SWEventDispatchAccountsChangedWithCurrentAccount();
          navigate('/');
        }, 2000);
        return true;
      }
    },
    [addWallet, navigate],
  );

  return { handleImport, imported };
}

// Tab Switch Component
const ImportWalletTabSwitch: React.FC<{
  onSelected: (isPrivateKey: boolean) => void;
  privateKeySelected: boolean;
}> = ({ onSelected, privateKeySelected }) => (
  <div className="import-wallet-tab-switch">
    <button
      className={`import-wallet-tab-btn${!privateKeySelected ? ' selected' : ''}`}
      onClick={() => onSelected(false)}>
      Seed Phrase
    </button>
    <button
      className={`import-wallet-tab-btn${privateKeySelected ? ' selected' : ''}`}
      onClick={() => onSelected(true)}>
      Private Key
    </button>
  </div>
);

// PrivateKey Import Component
const PrivateKey: React.FC<{ pin: string }> = ({ pin }) => {
  const [inputText, setInputText] = useState('');
  const { handleImport, imported } = useWalletImportHandler();
  const isPrivateKeyValid = (() => {
    const privateKey = inputText.trim();
    if (!privateKey) return false;
    let pk = privateKey;
    if (pk.startsWith('0x') || pk.startsWith('0X')) pk = pk.slice(2);
    if (pk.length !== 64) return false;
    return /^[0-9a-fA-F]{64}$/.test(pk);
  })();

  const onPaste = async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      setInputText(text);
    } catch {
      singleMessage.error('Failed to read clipboard');
    }
  };
  const onClear = () => setInputText('');
  const onImport = async () => {
    await handleImport(pin, undefined, inputText.trim());
  };

  return (
    <div className="import-wallet-private-key">
      <textarea
        className="import-wallet-input"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter private key"
        rows={5}
      />
      <div className="import-wallet-btn-row">
        {inputText.length === 0 ? (
          <button className="import-wallet-action-btn" onClick={onPaste}>
            <CopyOutlined className="import-wallet-icon" />
            Paste
          </button>
        ) : (
          <button className="import-wallet-action-btn" onClick={onClear}>
            <DeleteOutlined className="import-wallet-icon" />
            Clear
          </button>
        )}
      </div>
      <CommonButton
        type="primary"
        className="import-wallet-main-btn"
        disabled={!isPrivateKeyValid || imported}
        onClick={onImport}>
        Import
      </CommonButton>
    </div>
  );
};

// RecoverPhrase Import Component
const RecoverPhrase: React.FC<{ pin: string }> = ({ pin }) => {
  const [mnemonics, setMnemonics] = useState(Array(12).fill(''));
  const { handleImport, imported } = useWalletImportHandler();
  const isMnemonicsValid =
    mnemonics.every((word) => /^[a-zA-Z]+$/.test(word)) && mnemonics.join(' ').trim().split(/\s+/).length === 12;

  const handleChange = (idx: number, value: string) => {
    const arr = [...mnemonics];
    arr[idx] = value.replace(/[^a-zA-Z]/g, '').toLowerCase();
    setMnemonics(arr);
  };
  const onPaste = async () => {
    try {
      const text = (await navigator.clipboard.readText()).trim();
      const words = text.split(/\s+/);
      if (words.length === 12 && words.every((w) => /^[a-zA-Z]+$/.test(w))) {
        setMnemonics(words);
      } else {
        singleMessage.error('Invalid seed phrase');
      }
    } catch {
      singleMessage.error('Failed to read clipboard');
    }
  };
  const onClear = () => setMnemonics(Array(12).fill(''));
  const onImport = async () => {
    await handleImport(pin, mnemonics.join(' '), undefined);
  };

  return (
    <div className="import-wallet-recover-phrase">
      <div className="import-wallet-mnemonics-wrap">
        {mnemonics.map((word, idx) => (
          <input
            key={idx}
            className="import-wallet-mnemonic-input"
            value={word}
            onChange={(e) => handleChange(idx, e.target.value)}
            placeholder={String(idx + 1)}
            maxLength={16}
          />
        ))}
      </div>
      <div className="import-wallet-btn-row">
        {mnemonics.every((w) => !w) ? (
          <button className="import-wallet-action-btn" onClick={onPaste}>
            <CopyOutlined className="import-wallet-icon" />
            Paste
          </button>
        ) : (
          <button className="import-wallet-action-btn" onClick={onClear}>
            <DeleteOutlined className="import-wallet-icon" />
            Clear
          </button>
        )}
      </div>
      <CommonButton
        type="primary"
        className="import-wallet-main-btn"
        disabled={!isMnemonicsValid || imported}
        onClick={onImport}>
        Import
      </CommonButton>
    </div>
  );
};

type TRouterParams = {
  pin: string;
};

// Main Page Component
export const ImportWallet: React.FC<{}> = () => {
  const { state } = useLocationState<TRouterParams>();
  const navigate = useNavigate();
  const { pin } = state;
  const [privateKeySelected, setPrivateKeySelected] = useState(false);
  const onSelectedTab = useCallback((isPrivateKey: boolean) => setPrivateKeySelected(isPrivateKey), []);

  return (
    <>
      <CommonHeader
        className="my-header"
        title=""
        onLeftBack={() => {
          navigate(-1);
        }}
      />
      <div className="import-wallet-container">
        <h2 className="import-wallet-title">Import your wallet</h2>

        <div className="import-wallet-subtitle">
          If you are migrating from Night ELF, Fairy App, or other wallets, please use the private key import method.
          <CommonTooltip title="Due to a technical upgrade, the original recover phrase will generate different sub-wallets in Night ELF and this plugin. Therefore, you need to use the private key import method. However, rest assured that both wallets can function normally, including features like transfers, voting, etc." />
        </div>

        <ImportWalletTabSwitch onSelected={onSelectedTab} privateKeySelected={privateKeySelected} />
        {privateKeySelected ? <PrivateKey pin={pin} /> : <RecoverPhrase pin={pin} />}
        {/* ImportByCloud 预留，后续扩展 */}
      </div>
    </>
  );
};
