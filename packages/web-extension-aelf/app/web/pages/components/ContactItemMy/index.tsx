import React, { memo, useMemo } from 'react';
import { MAIN_CHAIN_ID } from '@portkey-wallet/constants/constants-ca/activity';
import { addressFormat } from '@portkey-wallet/utils';
import { ChainId } from '@portkey-wallet/types';
import { useCurrentUserInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { AELF_NETWORK_NAME } from '@portkey-wallet/constants/constants-ca/common';
import { CustomSvgV3 } from 'components/CustomSvgV3';
import ImageDisplay from '../ImageDisplay';
import { formatStr2EllipsisStr } from '../ContactAddress';
import './index.less';

export interface IContactItemMy {
  address: string;
  avatarImg: string;
  network: string;
  isExchange?: boolean;
  chainId: ChainId;
  [key: string]: any;
}
export interface ItemTypeMy {
  addressList: Array<IContactItemMy>;
  onClick?: (item: IContactItemMy) => void;
}

const ContactItemMy: React.FC<ItemTypeMy> = (props) => {
  const { addressList, onClick } = props;
  const { avatar, nickName } = useCurrentUserInfo();

  const myOtherAddress = useMemo(() => {
    return addressList?.[0];
  }, [addressList]);

  const addressFormatStr = useMemo(() => {
    const { address, network, isExchange = false, chainId } = myOtherAddress ?? {};
    if (network === AELF_NETWORK_NAME) {
      if (isExchange && chainId === MAIN_CHAIN_ID) {
        return address;
      }
      return addressFormat(address, chainId, network);
    }
    return address;
  }, [myOtherAddress]);

  const addressEllipsisStr = useMemo(() => {
    const { network } = myOtherAddress ?? {};
    if (network === AELF_NETWORK_NAME) {
      return formatStr2EllipsisStr(addressFormatStr, 8, 9);
    }
    return formatStr2EllipsisStr(addressFormatStr, 6, 4);
  }, [myOtherAddress, addressFormatStr]);

  const networkName = useMemo(() => {
    const { network, chainId } = myOtherAddress ?? {};
    return `${network} ${chainId === MAIN_CHAIN_ID ? 'MainChain' : 'dAppChain'}`;
  }, [myOtherAddress]);

  return (
    <div className="contact-item-my flex" onClick={() => onClick?.(myOtherAddress)}>
      <div className="contact-item-avatar">
        <ImageDisplay
          src={avatar || ''}
          name={nickName}
          className="item-avatar"
          defaultWidth={40}
          defaultHeight={40}
          borderRadius={20}
        />
        <CustomSvgV3
          className="item-avatar-corner"
          type={myOtherAddress?.chainId === 'AELF' ? 'Chain=AELF Main' : 'Chain=AELF Side'}
        />
      </div>
      <div className="contact-item-info flex-1">
        <div className="row-top">{addressEllipsisStr}</div>
        <div className="row-bottom">{networkName || ''}</div>
      </div>
    </div>
  );
};

export default memo(ContactItemMy);
