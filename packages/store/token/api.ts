import response from './data.json';

console.log(response);

const data = [0, 1, 2, 3, 4, 5, 6, 7].map((_ele, index) => {
  return {
    isDefault: false, // boolean,
    symbol: `${index}ELF`, // "ELF"   the name showed
    tokenName: `${index}ELF`, //  "ELF"
    chainId: 1, // string "AELF"
    decimals: 8,
    address: `${index}-ArPnUb5FtxG2oXTaWX2DxNZowDEruJLs2TEkhRCzDdrRDfg8B`,
  };
});

data[0].isDefault = true;

const MOCK_RESPONSE = {
  data: response.data.list.map(ele => {
    return {
      ...ele,
      isDefault: ele.symbol === 'ELF',
    };
  }),
};

export function fetchTokenList({
  // todo maybe remote tokenList change
  chainId,
  pageSize,
  pageNo,
}: {
  chainId: string;
  pageSize: number;
  pageNo: number;
}): Promise<{ data: any[] }> {
  console.log('fetching....list', chainId, pageSize, pageNo);
  return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSE), 1000));
}
