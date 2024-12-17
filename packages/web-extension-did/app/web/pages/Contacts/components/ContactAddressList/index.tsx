import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import './index.less';
import { transNetworkTextWithAllChain } from '@portkey-wallet/utils/activity';
import { addressFormat, formatStr2EllipsisStr } from '@portkey-wallet/utils';
import { ChainType } from '@portkey/provider-types';
import { useIsMainnet } from '@portkey-wallet/hooks/hooks-ca/network';
import Copy from 'components/Copy';
import { CustomSvgV3 } from 'components/CustomSvgV3';

export default function ContactAddressList({ list }: { list: AddressItem[] }) {
  const isMainnet = useIsMainnet();

  return (
    <div className="contact-addresses">
      {list.map((ads: AddressItem, index: number) => {
        const formatAddressShow = addressFormat(ads?.address, ads?.chainId, ads?.chainName as ChainType);
        const ellipsisAddress = formatStr2EllipsisStr(formatAddressShow);
        return (
          <div className="address-item" key={index}>
            <div className="flex-between-center">
              <div className="flex-row-center chain">
                {ads?.image && <img src={ads?.image} className="chain-img" alt="chain logo" />}

                {!ads?.image && ads.chainId === 'AELF' ? (
                  <CustomSvgV3 type="Chain=AELF Main" className="chain-elf" />
                ) : (
                  <CustomSvgV3 type="Chain=AELF Side" className="chain-elf" />
                )}

                <span className="chain-text">
                  {transNetworkTextWithAllChain(ads.chainId, !isMainnet, ads.chainName, ads.displayChainName)}
                </span>
              </div>
              <Copy
                toCopy={formatAddressShow}
                iconType="copy"
                iconClassName="address-copy-icon"
                fillColor="#FFFFFF66"
              />
            </div>
            <div className="address-wrapper">
              <div className="address">{ellipsisAddress}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
