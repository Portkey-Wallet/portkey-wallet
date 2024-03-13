import CustomSvg from 'components/CustomSvg';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import './index.less';
import { transNetworkTextWithAllChain } from '@portkey-wallet/utils/activity';
import { addressFormat } from '@portkey-wallet/utils';
import { ChainType } from '@portkey/provider-types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import Copy from 'components/Copy';

export default function ContactAddressList({ list }: { list: AddressItem[] }) {
  const isMainnet = useIsMainnet();

  return (
    <div className="contact-addresses">
      {list.map((ads: AddressItem, index: number) => {
        const formatAddressShow = addressFormat(ads?.address, ads?.chainId, ads?.chainName as ChainType);
        return (
          <div className="address-item" key={index}>
            <div className="flex-between-center">
              <div className="address-wrapper">
                <div className="address">{formatAddressShow}</div>
              </div>
              <Copy toCopy={formatAddressShow} iconType="Copy4" iconClassName="address-copy-icon" />
            </div>
            <div className="flex-row-center chain">
              {ads?.image && <img src={ads?.image} className="chain-img" />}

              {!ads?.image && ads?.chainName === 'aelf' && isMainnet && <CustomSvg type="Aelf" className="chain-elf" />}
              {!ads?.image && ads?.chainName === 'aelf' && !isMainnet && (
                <CustomSvg type="elf-icon" className="chain-elf" />
              )}

              <span className="chain-text">{transNetworkTextWithAllChain(ads.chainId, !isMainnet, ads.chainName)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
