import { CountryItem } from 'packages/types/types-ca/country';
import countryCodeMap from './countryCodeList.json';

export const getCountryCodeJSON = (countryCode: CountryItem[]) => {
  const country: { [x: string]: CountryItem[] } = {};
  countryCode.forEach(item => {
    const first = item.country[0];
    if (country[first]) country[first].push(item);
    else country[first] = [item];
  });
  return country;
};

export const getCountryCodeIndex = (countryCode: CountryItem[]) => {
  return Object.entries(getCountryCodeJSON(countryCode));
};

export const countryCodeList = countryCodeMap.countryCode;

export const countryCode = getCountryCodeJSON(countryCodeList);

export const countryCodeIndex = getCountryCodeIndex(countryCodeList);

export const countryCodeFilter = (filterFelid: string, itemList: CountryItem[]) => {
  if (!filterFelid) return itemList;
  filterFelid = filterFelid.toLocaleLowerCase();
  if (/\d/.test(filterFelid)) {
    // all numbers
    const numStr = filterFelid.match(/\d+/g)?.join('').trim();
    // all non-numeric
    const str = filterFelid
      .match(/[^0-9]/g)
      ?.join('')
      .trim();
    const list: CountryItem[] = [];
    if (numStr) {
      list.push(...itemList.filter(country => country.code.includes(numStr)));
    }
    if (str) {
      list.push(...itemList.filter(country => country.country.toLocaleLowerCase().includes(str)));
    }
    return Array.from(new Set(list));
  } else {
    return itemList.filter(country => country.country.toLocaleLowerCase().includes(filterFelid));
  }
};

export const DefaultCountry = { country: 'Singapore', code: '65', iso: 'SG' };
