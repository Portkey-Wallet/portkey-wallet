// import { IndexBar, List } from 'antd-mobile';
import clsx from 'clsx';
import { useMemo } from 'react';
import './index.less';
import { AddressItem } from '@portkey-wallet/types/types-ca/contact';
import { formatStr2EllipsisStr } from '@portkey-wallet/utils/converter';
import { CustomSvgV3 } from 'components/CustomSvgV3';

// import { useAelfContactList } from '@portkey-wallet/hooks/hooks-ca/contact';
// import ContactCard from './ContactCard';
import { useTranslation } from 'react-i18next';
import { ChainId } from '@portkey-wallet/types';
import TokenImageDisplay from 'pages/components/TokenImageDisplay';

import { useLocalContactSearch } from '@portkey-wallet/hooks/hooks-ca/contactNew';

export default function Contacts({
  chainId,
  onChange,
}: {
  chainId: ChainId;
  onChange: (account: AddressItem) => void;
}) {
  const { t } = useTranslation();

  // const contactIndexList = useAelfContactList();

  const localSearch = useLocalContactSearch();

  const { contactIndexFilterList: searchResult } = localSearch('');

  console.log('searchResult', searchResult);

  // const [curList] = useState<any>([]);

  const showContactList = useMemo(() => {
    return searchResult;
    // .filter((list: any) => list.contacts[0].addressInfo.network == 'aelf');
  }, []);

  console.log(chainId, onChange);

  console.log('showContactList', showContactList);

  // useEffect(() => {

  //   setCurList(searchResult);
  // }, [contactIndexList]);

  // return <>321312</>;

  return (
    <div className="contacts">
      <div className={clsx(['contacts-body', 'index-bar-hidden'])}>
        {showContactList.length === 0 ? (
          <p className="no-data">{t('There is no contacts')}</p>
        ) : (
          <div>
            {showContactList.map((list: any, index) => {
              return (
                <div className="contact-list" key={index}>
                  {list?.contacts[0]?.addressInfo?.network === 'aelf' ? (
                    <>
                      <TokenImageDisplay
                        src={list?.contacts[0]?.caHolderInfo?.avatar}
                        subDisplay={true}
                        chain={list?.contacts[0]?.addressInfo?.chainId === 'AELF' ? 'main' : 'dApp'}
                      />
                      <div className="info-box">
                        <div className="name">{list?.contacts[0]?.caHolderInfo?.walletName}</div>
                        <div className="address">
                          {formatStr2EllipsisStr(
                            `ELF_${list?.contacts[0]?.addressInfo?.address}_${list.contacts[0]?.addressInfo?.chainId}`,
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="chain-box">
                        <TokenImageDisplay className="show-name" symbol={list?.contacts[0]?.name} subDisplay={false} />
                        <TokenImageDisplay
                          className="chain-logo"
                          src={list?.contacts[0]?.addressInfo.networkImage}
                          subDisplay={false}
                        />
                      </div>

                      <div className="info-box">
                        <div className="name">{list?.contacts[0]?.name}</div>
                        <div className="address">{formatStr2EllipsisStr(list?.contacts[0]?.addressInfo?.address)}</div>
                      </div>
                    </>
                  )}
                  <CustomSvgV3 type="info" className="info-icon" />
                </div>
              );
            })}
          </div>
          // <IndexBar>
          //   {curList.map(({ index, contacts }) => {
          //     return (
          //       <IndexBar.Panel
          //         className={!contacts.length ? 'contact-empty' : ''}
          //         index={index}
          //         title={index}
          //         key={index}>
          //         <List>
          //           {contacts.map((item) => (
          //             <List.Item key={item.id}>
          //               <ContactCard user={item} onChange={onChange} fromRecents={false} chainId={chainId} />
          //             </List.Item>
          //           ))}
          //         </List>
          //       </IndexBar.Panel>
          //     );
          //   })}
          // </IndexBar>
        )}
      </div>
    </div>
  );
}
