/* eslint-disable no-inline-styles/no-inline-styles */
import { AccountType } from '@portkey-wallet/types/wallet';
import { Button } from 'antd';
import CommonModal from 'components/CommonModal';
import CustomSvg from 'components/CustomSvg';
import SWEventController from 'controllers/SWEventController';
import useConnection from 'hooks/useConnection';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useCustomModal, useWalletInfo } from 'store/Provider/hooks';
import { setAccountConnectModal } from 'store/reducers/modal/slice';
import { getCurrentTab } from 'utils/platforms';
import { shortenCharacters } from 'utils/reg';
import { setLocalStorage } from 'utils/storage/chromeStorage';
import './index.less';

export default function AccountConnect() {
  const { accountConnectModal } = useCustomModal();
  const { currentAccount, accountList }: { currentAccount: any; accountList: any[] } = useWalletInfo() as any;
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | undefined>();
  const connections = useConnection();

  const getCurrentTabPermission = useCallback(async () => {
    const tab = await getCurrentTab();
    console.log('tab', tab);
    setCurrentTab(tab);
  }, []);

  useEffect(() => {
    getCurrentTabPermission();
  }, [getCurrentTabPermission]);

  const connectionPermission = useMemo(() => {
    const url = currentTab?.url;
    if (!url) return;
    const origin = new URL(url).origin;
    return origin ? connections?.[origin]?.permission : undefined;
  }, [connections, currentTab?.url]);

  const permissionAccountList = useMemo(() => {
    const list = connectionPermission?.accountList;
    return accountList?.filter((account) => {
      if (!list) return false;
      return list?.includes(account.address);
    });
  }, [accountList, connectionPermission?.accountList]);

  const [permissionList, isHasCurrentAccount] = useMemo(() => {
    let isHasCurrentAccount = false;
    const list = permissionAccountList?.filter((item) => {
      isHasCurrentAccount = isHasCurrentAccount || item.address === currentAccount?.address;
      return item.address !== currentAccount?.address;
    });
    return [list ?? [], isHasCurrentAccount];
  }, [currentAccount?.address, permissionAccountList]);

  const onDisconnect = useCallback(
    async (account: AccountType) => {
      const permissionAccountList = (connectionPermission?.accountList ?? []).filter(
        (item) => item !== account.address,
      );
      const url = currentTab?.url;
      if (!url) return;
      const origin = new URL(url).origin;
      const newConnections = {
        ...connections,
        [origin]: {
          ...connections?.[origin],
          permission: {
            ...connections?.[origin].permission,
            accountList: permissionAccountList,
          },
        },
      };
      if (account.address === currentAccount?.address) {
        const account = permissionList?.filter((item) => item.address === permissionAccountList[0]);
        SWEventController.accountsChanged(account?.[0], (res) => {
          console.log(res, 'onDisconnect==');
        });
      } else if (!permissionAccountList.length) {
        SWEventController.accountsChanged(undefined, (res) => {
          console.log(res, 'onDisconnect==accountsChanged');
        });
      }
      setLocalStorage({
        connections: newConnections,
      });
    },
    [permissionList, connectionPermission?.accountList, connections, currentAccount?.address, currentTab?.url],
  );

  const onConnect = useCallback(
    async (account: AccountType) => {
      const permissionAccountList = (connectionPermission?.accountList ?? []).some((item) => item === account.address);
      if (permissionAccountList) return console.log('Already connected');
      const url = currentTab?.url;
      if (!url) return;
      const origin = new URL(url).origin;
      const newConnections = connections ?? {};
      if (!newConnections[origin].permission.accountList) newConnections[origin].permission.accountList = [];
      newConnections[origin].permission.accountList?.push(account.address);
      setLocalStorage({
        connections: newConnections,
      });
      if (account.address === currentAccount?.address) {
        SWEventController.accountsChanged(account, (res) => {
          console.log(res, 'onDisconnect==');
        });
      }
    },
    [connectionPermission?.accountList, connections, currentAccount?.address, currentTab?.url],
  );

  const connectTitle = useMemo(
    () => (
      <div className="flex-between-center">
        <span>{t(permissionAccountList?.length ? 'Connected' : 'Not Connected')}</span>
        <CustomSvg
          style={{ cursor: 'pointer' }}
          type="Close2"
          onClick={() => dispatch(setAccountConnectModal(false))}
        />
      </div>
    ),
    [dispatch, permissionAccountList?.length, t],
  );

  return (
    <CommonModal
      open={accountConnectModal}
      width={320}
      maskClosable
      className="account-connect"
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onCancel={() => dispatch(setAccountConnectModal(false))}
      closable={false}
      title={connectTitle}>
      {currentTab?.url && <p className="origin-wrapper">{new URL(currentTab.url).origin}</p>}
      <p className="connect-tip">
        {permissionAccountList?.length
          ? `${t('You have')} ${permissionAccountList.length} ${t('accounts connected to the site:')}`
          : t('To connect to a web3 site, locate the connect button on this site.')}
      </p>
      {!!permissionAccountList?.length && (
        <ul className="connect-wrapper">
          {currentAccount && (
            <li className="flex-between-center connect-item" key={currentAccount.address}>
              <div className="account-info">
                <p className="flex-between-center">
                  {currentAccount.accountName}&nbsp;<span className="active-tip">{t('Active')}</span>
                </p>
                <p className="account-address">{shortenCharacters(currentAccount.address)}</p>
              </div>

              {isHasCurrentAccount ? (
                <Button className="connect-btn" onClick={() => onDisconnect?.(currentAccount)}>
                  {t('Disconnect')}
                </Button>
              ) : (
                <Button className="connect-btn" onClick={() => onConnect?.(currentAccount)}>
                  {t('Connect')}
                </Button>
              )}
            </li>
          )}

          {permissionList?.map((account) => (
            <li className="flex-between-center connect-item" key={account.address}>
              <div className="account-info">
                <p>{account.accountName}</p>
                <p className="account-address">{shortenCharacters(account.address)}</p>
              </div>
              <Button className="connect-btn" onClick={() => onDisconnect?.(account)}>
                Disconnect
              </Button>
            </li>
          ))}
        </ul>
      )}
    </CommonModal>
  );
}
