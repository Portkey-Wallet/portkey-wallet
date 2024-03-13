import { CountryCodeDataDTO, CountryCodeItem, defaultCountryCode } from 'types/wallet';
import { PortkeyEntries } from '../../../config/entries';
import BaseContainer, { BaseContainerProps } from '../../../model/container/BaseContainer';
import { COUNTRY_CODE_DATA_KEY, CURRENT_USING_COUNTRY_CODE } from '../../../model/global';
import SelectCountry, { SelectCountryResult } from 'pages/Login/SelectCountry';
import React from 'react';
import { GlobalStorage } from 'service/storage';

export default class SelectCountryEntryPage extends BaseContainer<
  SelectCountryPageProps,
  SelectCountryPageState,
  SelectCountryResult
> {
  constructor(props: SelectCountryPageProps) {
    super(props);
    this.state = {
      currentUsing: defaultCountryCode,
      dataList: null,
    };
    this.checkMMKVStorage();
  }

  checkMMKVStorage = async () => {
    const currUsing = await GlobalStorage.getString(CURRENT_USING_COUNTRY_CODE);
    const cachedData = await GlobalStorage.getString(COUNTRY_CODE_DATA_KEY);
    this.setState({
      currentUsing: currUsing
        ? (JSON.parse(currUsing) as CountryCodeItem)
        : { code: '65', country: 'Singapore', iso: 'SG' },
      dataList: cachedData ? (JSON.parse(cachedData) as CountryCodeDataDTO)?.data : [],
    });
  };

  getEntryName = (): string => PortkeyEntries.SELECT_COUNTRY_ENTRY;

  onSelected = (result: CountryCodeItem | null | undefined) => {
    if (result) {
      this.onCacheData(result);
    }
    this.onFinish({
      data: {
        result: result ? JSON.stringify(result) : '',
      },
      status: result ? 'success' : 'fail',
    });
  };

  onCacheData = (result: CountryCodeItem) => {
    GlobalStorage.set(CURRENT_USING_COUNTRY_CODE, JSON.stringify(result));
  };

  render() {
    return (
      <>
        <SelectCountry selectCountry={this.state.currentUsing ?? defaultCountryCode} navigateBack={this.onSelected} />
      </>
    );
  }
}

export interface SelectCountryPageProps extends BaseContainerProps {
  selectCountry: string;
}

export interface SelectCountryPageState {
  currentUsing: CountryCodeItem;
  dataList: Array<CountryCodeItem> | null;
}
