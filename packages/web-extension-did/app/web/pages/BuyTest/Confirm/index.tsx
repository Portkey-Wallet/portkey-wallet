import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import BackHeader from 'components/BackHeader';
import CustomSvg from 'components/CustomSvg';
import { useLocation, useNavigate } from 'react-router';
import { confirmReceiveText, overTimeText, visaCardNum, visaCardType } from '../const';
import { useCurrentWallet } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { getEntireDIDAelfAddress } from '@portkey-wallet/utils/aelf';
import getELF from 'utils/sandboxUtil/getELF';
import { timesDecimals } from '@portkey-wallet/utils/converter';
import { useCommonState, useLoading, useUserInfo } from 'store/Provider/hooks';
import { useCurrentChain } from '@portkey-wallet/hooks/hooks-ca/chainList';
import { useCurrentNetworkInfo } from '@portkey-wallet/hooks/hooks-ca/network';
import aes from '@portkey-wallet/utils/aes';
import PromptFrame from 'pages/components/PromptFrame';
import clsx from 'clsx';
import './index.less';

export default function Confirm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const chainInfo = useCurrentChain('AELF');
  const { state } = useLocation();
  const { isPrompt } = useCommonState();
  const { passwordSeed } = useUserInfo();
  const { walletInfo } = useCurrentWallet();
  const { setLoading } = useLoading();
  const currentNetwork = useCurrentNetworkInfo();
  const caAddress = useMemo(
    () => getEntireDIDAelfAddress(walletInfo.AELF?.caAddress || '', undefined, 'AELF'),
    [walletInfo],
  );
  const handleBack = useCallback(() => {
    navigate('/buy-test/preview', { state: state });
  }, [navigate, state]);

  const handleConfirm = useCallback(async () => {
    try {
      if (!passwordSeed) return message.error('Missing pin');
      const privateKey = aes.decrypt(walletInfo.AESEncryptPrivateKey, passwordSeed);
      if (!privateKey) return message.error('Missing private key');
      if (!chainInfo) return message.error('Missing chainInfo');
      if (!currentNetwork.tokenClaimContractAddress) return message.error('Missing tokenClaimContractAddress');
      setLoading(true);
      await getELF({
        chainInfo,
        chainType: currentNetwork.walletType,
        privateKey,
        address: currentNetwork.tokenClaimContractAddress,
        caHash: walletInfo.AELF?.caHash || '',
        amount: timesDecimals(100, 8).toNumber(),
      });
      navigate('/');
    } catch (error) {
      message.error(overTimeText);
      console.log('getELF error', error);
    } finally {
      setLoading(false);
    }
  }, [chainInfo, currentNetwork, navigate, passwordSeed, setLoading, walletInfo]);

  const mainContent = useMemo(
    () => (
      <div className={clsx(['confirm-frame flex-column', isPrompt ? 'detail-page-prompt' : ''])}>
        <div className="confirm-title">
          <BackHeader
            title="Confirm Payment"
            leftCallBack={handleBack}
            rightElement={<CustomSvg type="Close2" onClick={handleBack} />}
          />
        </div>
        <div className="confirm-content">
          <div className="card content">
            <div className="label">{t('Pay with')}</div>
            <div className="card-item visa flex">
              <CustomSvg type="BuyVisa" />
              <span className="card-type">{visaCardType}</span>
              <span className="card-number">{visaCardNum}</span>
            </div>
          </div>
          <div className="address content">
            <div className="label">{t('Wallet address')}</div>
            <div className="address-item item flex">
              <span>{caAddress?.replace(/(?<=^\w{18})\w+(?=\w{17})/, '...')}</span>
            </div>
          </div>
          <div className="receive content">
            <div className="label">{t('You will get')}</div>
            <div className="receive-item item flex">
              <span>{confirmReceiveText}</span>
            </div>
          </div>
        </div>
        <div className="confirm-footer">
          <Button type="primary" htmlType="submit" onClick={handleConfirm}>
            {t('Confirm')}
          </Button>
        </div>
      </div>
    ),
    [caAddress, handleBack, handleConfirm, isPrompt, t],
  );

  return <>{isPrompt ? <PromptFrame content={mainContent} /> : mainContent}</>;
}
