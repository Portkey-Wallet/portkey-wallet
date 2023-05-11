import { IndexBar, IndexBarRef } from 'antd-mobile';
import { useEffect, useRef } from 'react';
import { ISelectCountryCode } from 'store/reducers/loginCache/type';
import { useLoginInfo } from 'store/Provider/hooks';
import { countryCodeIndex } from '@portkey-wallet/constants/constants-ca/country';

export default function AllCountry({ onSelect }: { onSelect: (v: ISelectCountryCode) => void }) {
  const indexBarRef = useRef<IndexBarRef>(null);
  const { countryCode } = useLoginInfo();

  useEffect(() => {
    indexBarRef.current?.scrollTo(countryCode.index);
  }, [countryCode.index]);

  return (
    <IndexBar ref={indexBarRef}>
      {countryCodeIndex.map(([index, countries]) => {
        return (
          <IndexBar.Panel className={!countries.length ? 'country-empty' : ''} index={index} title={index} key={index}>
            {countries.map((item) => (
              <div
                key={`${item.code}_${item.country}`}
                onClick={() => {
                  onSelect({
                    index: index,
                    country: item,
                  });
                }}>
                <div className="flex-between-center country-item-content">
                  <span className="country-item-name">{item.country}</span>
                  <div className="flex-center country-index-code">{item.code}</div>
                </div>
              </div>
            ))}
          </IndexBar.Panel>
        );
      })}
    </IndexBar>
  );
}
