const itemData = [
  {
    chainId: 'AELF',
    caAddress: '2tgCgt32ZBSgB26XPGSWdkeaizNsnykLrc7eoUzJ8dV6wrzap8',
    address: 'T2pEMm5sfQ6C1L1LyNMhAWjuEnzFvEzt3Wrh9hGUq4hTBJuVg',
    addressChainId: 'AELF',
    transactionTime: '1678355520',
    name: null,
    addresses: null,
  },
  {
    chainId: 'AELF',
    caAddress: '2tgCgt32ZBSgB26XPGSWdkeaizNsnykLrc7eoUzJ8dV6wrzap8',
    address: '2XuBe7qrnvAEZTU1EoWk7C4bp5ab49jV2Y3Uaxkisy8crz2nkd',
    addressChainId: 'tDVV',
    transactionTime: '1678350945',
    name: 'k_t',
    addresses: [
      {
        chainId: 'tDVV',
        address: '2XuBe7qrnvAEZTU1EoWk7C4bp5ab49jV2Y3Uaxkisy8crz2nkd',
        transactionTime: '1678350945',
      },
      { chainId: 'AELF', address: '2XuBe7qrnvAEZTU1EoWk7C4bp5ab49jV2Y3Uaxkisy8crz2nkd', transactionTime: null },
    ],
  },
];

export const mockRecentData = {
  data: new Array(10).fill(itemData),
  totalRecordCount: 100,
};
