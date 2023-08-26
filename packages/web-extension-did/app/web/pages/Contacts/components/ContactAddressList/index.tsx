import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import CustomSvg from 'components/CustomSvg';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { useCopyToClipboard } from 'react-use';
import './index.less';
import { useCallback } from 'react';
import { useIsTestnet } from 'hooks/useNetwork';
import { transNetworkTextWithAllChain } from '@portkey-wallet/utils/activity';

export default function ContactAddressList({ list }: { list: AddressItem[] }) {
  const isTestNet = useIsTestnet();
  const { t } = useTranslation();
  const [, setCopied] = useCopyToClipboard();
  const handleCopy = useCallback(
    (v: string) => {
      setCopied(v);
      message.success(t('Copy Success'));
    },
    [setCopied, t],
  );

  return (
    <div className="contact-addresses">
      {list.map((ads: AddressItem, index: number) => (
        <div className="address-item" key={index}>
          <div className="flex-between-center">
            <div className="address-wrapper">
              <div className="address">{`ELF_${ads?.address}_${ads?.chainId}`}</div>
            </div>
            <CustomSvg onClick={() => handleCopy(ads?.address)} type="Copy" className="address-copy-icon" />
          </div>
          <div className="flex-row-center chain">
            {ads?.image && <img src={ads?.image} className="chain-img" />}

            {!ads?.image && ads?.chainName === 'aelf' && !isTestNet && <CustomSvg type="Aelf" className="chain-elf" />}
            {!ads?.image && ads?.chainName === 'aelf' && isTestNet && (
              <CustomSvg type="elf-icon" className="chain-elf" />
            )}

            <span className="chain-text">{transNetworkTextWithAllChain(ads.chainId, isTestNet, ads.chainName)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
