import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import clsx from 'clsx';
import { useCommonState } from 'store/Provider/hooks';
import { useCallback } from 'react';
import PromptFrame from 'pages/components/PromptFrame';
import Copy from 'components/Copy';
import { ContactItemType } from '@portkey-wallet/types/types-ca/contact';
import { useIsTestnet } from '@portkey-wallet/hooks/hooks-ca/network';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { addressFormat, getExploreLink } from '@portkey-wallet/utils';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import TitleWrapper from 'components/TitleWrapper';
import './index.less';

export default function RecentDetail() {
  const { state } = useLocation();
  const { isPrompt } = useCommonState();
  const isTestNet = useIsTestnet();
  const nav = useNavigate();
  const onClose = useCallback(() => {
    nav(-1);
  }, [nav]);
  const chainInfo = useCurrentChain(state?.chainId || '');
  const transAddress = addressFormat(state?.address, state.chainId, 'aelf');

  const goAddContact = useCallback(() => {
    const initContactItem: Partial<ContactItemType> = {
      id: '-1',
      name: '',
      addresses: [{ chainId: 'AELF', address: state?.address || '' }],
    };
    nav('/setting/contacts/add', { state: initContactItem });
  }, [nav, state?.address]);

  const viewOnExplorer = useCallback(() => {
    const openWinder = window.open(getExploreLink(chainInfo?.explorerUrl || '', transAddress, 'address'), '_blank');
    if (openWinder) {
      openWinder.opener = null;
    }
  }, [chainInfo?.explorerUrl, transAddress]);

  const mainContent = () => {
    return (
      <div className={clsx(['recent-detail', isPrompt ? 'detail-page-prompt' : null])}>
        <TitleWrapper
          className="recent-detail-header"
          title="Details"
          leftCallBack={onClose}
          rightElement={<CustomSvg type="Close2" onClick={onClose} />}
        />
        <div className="recent-detail-body">
          <div className="recent-detail-address-wrap">
            {state?.name && (
              <div className="recent-detail-contact flex-row-center">
                <div className="flex-center avatar">{state?.name?.slice(0, 1)}</div>
                <div className="name">{state?.name}</div>
              </div>
            )}

            <div className="recent-detail-address-row">
              <span className="address">{transAddress}</span>
              <span className="network">{transNetworkText(state.chainId, isTestNet)}</span>
            </div>

            <div className="recent-detail-action-row">
              {!state?.name && <CustomSvg type={'AddContact'} onClick={goAddContact} />}
              <Copy iconType={'Copy3'} iconClassName="copy-address" toCopy={transAddress} />
              <CustomSvg type={'Share'} onClick={viewOnExplorer} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <>{isPrompt ? <PromptFrame content={mainContent()} className="transaction-detail" /> : mainContent()}</>;
}
