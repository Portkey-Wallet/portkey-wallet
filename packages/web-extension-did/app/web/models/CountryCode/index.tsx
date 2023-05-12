import CommonModal from 'components/CommonModal';
import { useAppDispatch, useCustomModal } from 'store/Provider/hooks';
import { setCountryModal } from 'store/reducers/modal/slice';
import { countryCodeFilter } from '@portkey-wallet/constants/constants-ca/country';
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BackHeader from 'components/BackHeader';
import { useTranslation } from 'react-i18next';
import CustomSvg from 'components/CustomSvg';
import { Input } from 'antd';
import { setCountryCodeAction } from 'store/reducers/loginCache/actions';
import { ISelectCountryCode } from 'store/reducers/loginCache/type';
import AllCountry from './components/AllCountry';
import { usePhoneCountryCode } from '@portkey-wallet/hooks/hooks-ca/misc';
import './index.less';

export default function CountryCode() {
  const { countryCodeModal } = useCustomModal();
  const dispatch = useAppDispatch();
  const [searchVal, setSearchVal] = useState<string>('');
  const { t } = useTranslation();
  const timer = useRef<any>(null);
  const { phoneCountryCodeList } = usePhoneCountryCode();

  const filterList = useMemo(
    () => countryCodeFilter(searchVal, phoneCountryCodeList),
    [phoneCountryCodeList, searchVal],
  );

  const debounce = useCallback((fn: () => void, delay = 500) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(function () {
      fn();
    }, delay);
  }, []);

  const onSearchCountry = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.trim();
      debounce(() => setSearchVal(val));
    },
    [debounce],
  );

  const onSelect = useCallback(
    (code: ISelectCountryCode) => {
      dispatch(setCountryModal(false));
      dispatch(setCountryCodeAction(code));
    },
    [dispatch],
  );

  const filterCountry = useMemo(
    () =>
      filterList.map((item) => (
        <div
          key={item.code}
          onClick={() => {
            onSelect({
              index: item.country[0],
              country: item,
            });
          }}>
          {item.country}
        </div>
      )),
    [filterList, onSelect],
  );

  useEffect(() => {
    setSearchVal('');
  }, [countryCodeModal]);

  return (
    <CommonModal
      className="country-code-modal"
      closable={false}
      open={countryCodeModal}
      onCancel={() => dispatch(setCountryModal(false))}
      title={
        <BackHeader
          title={t('Select country/region')}
          leftCallBack={() => {
            dispatch(setCountryModal(false));
          }}
        />
      }>
      <div className="flex-column country-title">
        <Input
          className="search-input"
          prefix={<CustomSvg type="SearchBlur" className="search-svg" />}
          placeholder="Search countries and region"
          onChange={onSearchCountry}
        />
      </div>
      <div
        style={{
          // eslint-disable-next-line no-inline-styles/no-inline-styles
          height: 468,
        }}>
        {searchVal ? filterCountry : <AllCountry onSelect={onSelect} />}
      </div>
    </CommonModal>
  );
}
