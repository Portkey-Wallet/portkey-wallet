import { CountryCodeDataDTO, CountryCodeItem } from 'types/wallet';
import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps } from '../../../model/container/BaseContainer';
import {
  AccountCheckResult,
  COUNTRY_CODE_DATA_KEY,
  CURRENT_USING_COUNTRY_CODE,
  attemptAccountCheck,
} from '../../../model/sign-in';
import SelectCountry from 'pages/Login/SelectCountry';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalStorage } from 'service/storage';

export default class SelectCountryEntryPage extends BaseContainer<
  BaseContainerProps,
  SelectCountryPageState,
  SelectCountryPageResult
> {
  constructor(props: BaseContainerProps) {
    super(props);
    const currUsing = GlobalStorage.getString(CURRENT_USING_COUNTRY_CODE);
    const cachedData = GlobalStorage.getString(COUNTRY_CODE_DATA_KEY);
    this.state = {
      currentUsing: currUsing
        ? (JSON.parse(currUsing) as CountryCodeItem)
        : { code: '65', country: 'Singapore', iso: 'SG' },
      dataList: cachedData ? (JSON.parse(cachedData) as CountryCodeDataDTO)?.data : [],
    };
  }

  getEntryName = (): string => PortkeyEntries.SELECT_COUNTRY_ENTRY;

  attemptAccountCheck = async (accountIdentifier: string): Promise<AccountCheckResult> => {
    return attemptAccountCheck(accountIdentifier);
  };

  onSelected = (result: SelectCountryPageResult) => {
    this.onCacheData();
    this.onFinish({
      result,
      status: 'success',
    });
  };

  onCacheData = () => {
    const { dataList, currentUsing } = this.state;
    GlobalStorage.set(COUNTRY_CODE_DATA_KEY, JSON.stringify({ locateData: dataList }));
    GlobalStorage.set(CURRENT_USING_COUNTRY_CODE, JSON.stringify(currentUsing));
  };

  render() {
    return (
      <SafeAreaProvider>
        <SelectCountry />
      </SafeAreaProvider>
    );
  }
}

export interface SelectCountryPageState {
  currentUsing: CountryCodeItem;
  dataList: Array<CountryCodeItem>;
}

export interface SelectCountryPageResult {}
