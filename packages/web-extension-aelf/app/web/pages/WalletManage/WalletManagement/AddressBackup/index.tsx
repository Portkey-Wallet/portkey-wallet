import { useCallback, useMemo, useState, useEffect } from 'react';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import singleMessage from 'utils/singleMessage';
import getPrivateKeyAndMnemonic from 'utils/Wallet/getPrivateKeyAndMnemonic';
import { useAppDispatch } from 'store/Provider/hooks';
import { updateWallet } from '@portkey-wallet/store/store-eoa/wallet/actions';
import { useLocationState, useNavigateState } from 'hooks/router';
import './index.less';
import { UnlockOverlay } from '../../../components/UnlockModal';
import CommonHeader from 'components/CommonHeader';

export const AddressBackup = () => {
  const navigate = useNavigateState();
  const dispatch = useAppDispatch();
  const { state } = useLocationState<{
    walletToBeBackup: any;
    accountToBeBackup: any;
    backupType: 'Private key' | 'Seed phrase';
  }>();
  const { walletToBeBackup, accountToBeBackup, backupType } = state || {};

  const [mnemonics, setMnemonics] = useState<string[]>([]);
  const [privateKey, setPrivateKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [unlockOverlayOpen, setUnlockOverlayOpen] = useState(false);

  // 解密助记词/私钥
  useEffect(() => {
    if (!walletToBeBackup && !accountToBeBackup && !backupType) {
      navigate('/wallet/reset');
      return;
    }
  }, [walletToBeBackup, accountToBeBackup, backupType, navigate]);

  // 复制助记词/私钥
  const onCopy = useCallback(async () => {
    try {
      if (backupType === 'Private key') {
        await navigator.clipboard.writeText(privateKey);
      } else {
        await navigator.clipboard.writeText(mnemonics.join(' '));
        if (walletToBeBackup) {
          dispatch(updateWallet({ wallet: { ...walletToBeBackup, isBackup: true } }));
        }
      }
      setCopied(true);
      singleMessage.success(`${backupType} copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      singleMessage.error('Copy failed');
    }
  }, [backupType, privateKey, mnemonics, walletToBeBackup, dispatch]);

  const unlockAndShow = useCallback(
    (pin: string) => {
      setUnlockOverlayOpen(false);
      getPrivateKeyAndMnemonic(
        {
          AESEncryptPrivateKey: accountToBeBackup.AESEncryptPrivateKey,
          AESEncryptMnemonic: walletToBeBackup.AESEncryptMnemonic,
        },
        pin,
      )
        .then((res) => {
          console.log('unlockAndShow res: ', res, backupType);
          if (backupType === 'Seed phrase') {
            setMnemonics(res?.mnemonic ? res.mnemonic.split(' ') : []);
            setPrivateKey('');
          } else {
            setPrivateKey(res?.privateKey || '');
            setMnemonics([]);
          }
          setVisible(true);
        })
        .catch(() => {
          setMnemonics([]);
          setPrivateKey('');
          singleMessage.error('Decrypt failed');
        });
    },
    [accountToBeBackup.AESEncryptPrivateKey, backupType, walletToBeBackup.AESEncryptMnemonic],
  );

  // 助记词/私钥展示区
  const mnemonicsView = useMemo(
    () => (
      <div className="address-backup-mnemonics-wrap">
        {backupType === 'Seed phrase' &&
          mnemonics.map((mnemonic, idx) => (
            <div className="address-backup-word-wrap" key={idx}>
              <span className="address-backup-word-label">{idx + 1}</span>
              <span className="address-backup-mnemonics-label">{mnemonic}</span>
            </div>
          ))}
        {backupType === 'Private key' && (
          <div className="address-backup-private-key-wrap">
            <span className="address-backup-private-key">{privateKey}</span>
          </div>
        )}
        {/*{!visible && (mnemonics.length > 0 || privateKey) && (*/}
        {!visible && (
          <>
            <div className="address-backup-overlay" />
            <div className="address-backup-eye-btn">
              {/*<span onClick={() => setVisible(true)}>*/}
              <span onClick={() => setUnlockOverlayOpen(true)}>
                <CustomSvgV3 type="visibility" className="address-backup-eye-icon" />
              </span>
            </div>
          </>
        )}
      </div>
    ),
    [backupType, mnemonics, privateKey, visible],
  );

  // 复制按钮/已复制提示
  const copyButton = (
    <button className="address-backup-copy-btn" onClick={onCopy}>
      <CustomSvgV3 type="copy" className="address-backup-copy-icon" />
      <span className="ml-8">Copy to clipboard</span>
    </button>
  );
  const copiedView = (
    <div className="address-backup-copy-btn">
      <CustomSvgV3 type="check_circle" className="success-color" />
      <span className="address-backup-copy-success">{backupType} copied</span>
    </div>
  );

  // 顶部风险提示
  const tipView = (
    <div className="address-backup-tip-wrap">
      <CustomSvgV3 type="warning" className="address-backup-tip-icon" />
      <div className="address-backup-tip-text-container">
        <div className="address-backup-tip-title">DO NOT share your seed phrase with anyone!</div>
        <div className="address-backup-tip-sub-title">
          Anyone who has access to your seed phrase can access your wallet and assets.
        </div>
      </div>
    </div>
  );

  return (
    <div className="address-backup-container">
      <CommonHeader
        className="my-header"
        title=""
        onLeftBack={() => {
          navigate('/wallet/reset');
        }}
        onLeftBackShowClose={false}
      />
      <div className="address-backup-title">{backupType}</div>
      {tipView}
      {mnemonicsView}
      {copied ? copiedView : visible && copyButton}
      {/* 云备份相关按钮和逻辑可按需补充 */}
      {/* Unlock */}
      <UnlockOverlay
        open={unlockOverlayOpen}
        onClose={() => setUnlockOverlayOpen(false)}
        onUnLockHandler={unlockAndShow}
      />
    </div>
  );
};
