import AElf from 'aelf-sdk';

export const EBRIDGE_DISCLAIMER_ARRAY: { type: 'title' | 'text'; content: string }[] = [
  {
    type: 'text',
    content:
      'Please consider the following risk factors (many of which are specific and inherent to cryptographic tokens) before using any part of our Wallet/website/platform and before purchasing and/or trading ELF cryptographic tokens or any other cryptographic token which we (or any third-party service provider accessed through Portkey) may offer through our Wallet/website/platform from time to time (“ tokens”). The value of the tokens as well as your ability to access and transfer the tokens could be materially and adversely affected if any of these risk factors materialize.',
  },
  {
    type: 'text',
    content:
      'Please also note that this Risk Disclaimer is not exhaustive. You should carry out further research (and seek professional advice) to carefully determine whether purchasing and/or trading tokens is suitable for your particular financial situation and risk tolerance.',
  },
  {
    type: 'text',
    content:
      'Subject to any provision to the contrary set out in this disclaimer or our terms of Services, Portkey shall not be liable for any loss incurred by you resulting from your access to our platform or from your purchase, transfer or use of tokens.',
  },

  {
    type: 'text',
    content:
      'Tokens are high-risk assets and you should never use funds that you cannot afford to lose to purchase tokens. ',
  },
  {
    type: 'title',
    content: '1.1 Price volatility ',
  },
  {
    type: 'text',
    content:
      'The price of tokens can be subject to dramatic fluctuations and high volatility due to the rapid shifts in offer and demand resulting from events such as but not limited to: (a) good or bad publicity, (b) changes in the financial technology industry, (c) technological advancement, (d) market trends, (e) general economic and/or political conditions, (f) degree of adoption, (g) degree of institutional support, (h) regulatory measures, (i) degree of government support, (l) market dynamics, (m) trading activities, (n) hacking, and (o) events affecting large service providers, including exchanges.',
  },
  {
    type: 'text',
    content:
      'AS A RESULT OF PRICE VOLATILITY, YOUR TOKENS MAY LOSE ALL VALUE AND BECOME WORTHLESS. PORTKEY SHALL NOT BE RESPONSIBLE FOR ANY LOSS INCURRED BY YOU AS A RESULT OF THE INHERENT PRICE-VOLATILITY OF TOKENS.',
  },
  {
    type: 'title',
    content: '1.2 Protocols ',
  },

  {
    type: 'text',
    content:
      'Tokens are recorded on distributed ledgers (typically shared across networks of users) which are governed by, subject to, and distinguished on the basis of certain set of rules and/or smart contracts known as protocols.',
  },
  {
    type: 'text',
    content: '• Malfunction, breakdown and/or abandonment of protocols',
  },
  {
    type: 'text',
    content:
      'Any malfunction, breakdown, and/or abandonment of the protocols (and of any consensus mechanism, where applicable) on which the tokens are based could severely affect the price of the tokens as well as your ability to dispose of them (particularly where the protocol relies on substantial participation and wide networks to operate properly).',
  },
  {
    type: 'text',
    content: '• Validator attacks',
  },
  {
    type: 'text',
    content:
      'Some protocols integrate consensus-based mechanisms for the validation of transfers (“Consensus Protocols”). Consensus Protocols are, therefore, susceptible to attacks at the stage of validation, where token transactions are approved by the network. This may affect the accuracy of transactions and in your tokens being misappropriated (for example, through what is typically referred to as double spending attacks).',
  },
  {
    type: 'text',
    content: '• Hacking and security weaknesses',
  },
  {
    type: 'text',
    content:
      'Tokens may be subject to expropriation and/or theft. Bad actors (including hackers, groups and organizations) may attempt to interfere with the protocols or the tokens in a variety of ways, including, but not limited to, malware attacks, denial of service attacks, consensus-based attacks, sybil attacks, smurfing and spoofing.',
  },
  {
    type: 'text',
    content:
      'Furthermore, some protocols are based on open-source software and, as a result, subject to the risk of weakness being introduced to the protocols (either willingly or accidentally) at the development stage. Any such weakness may be exploited by bad actors for the purposes of misappropriating your tokens, or otherwise affecting the functionality of the protocol and of your ability to dispose of your tokens.',
  },
  {
    type: 'text',
    content:
      'PORTKEY DOES NOT HAVE CONTROL OVER THE PROTOCOLS. AS SUCH, PORTKEY SHALL NOT BE RESPONSIBLE FOR ANY LOSS ARISING OUT OF OR IN CONNECTION WITH THE PROTOCOLS.',
  },
  {
    type: 'title',
    content: '1.3 Laws and regulations',
  },
  {
    type: 'text',
    content:
      'The legal and/or regulatory framework surrounding tokens and distributed ledger technology is uncertain, not harmonized, and unsettled in many jurisdictions.',
  },
  {
    type: 'text',
    content:
      'It is difficult to predict what framework will become applicable to tokens in the near future and how the implementation of dedicated legal and/or regulatory frameworks will affect the price of tokens. A newly introduced legal and regulatory framework may interfere with or otherwise limit your ability to hold or dispose of your tokens, which in turn could result in a financial loss on your part.',
  },
  {
    type: 'text',
    content:
      'PORTKEY IS NOT RESPONSIBLE FOR ANY LOSS WHICH YOU MAY SUFFER AS A RESULT OF ANY NEWLY INTRODUCED LEGAL AND/OR REGULATORY FRAMEWORK.',
  },
  {
    type: 'title',
    content: '1.4 Taxation',
  },
  {
    type: 'text',
    content:
      'The tax characterization of tokens is complex and largely uncertain. The uncertainty in the tax treatment of tokens may expose you to unforeseen future tax consequences associated with purchasing, owning, selling or otherwise using tokens. You should seek tax advice to understand what tax obligations apply to you when purchasing, holding, transferring, and utilizing tokens. Failure to comply with your tax obligations could result in severe fines and even jail time.',
  },
  {
    type: 'text',
    content:
      'PORTKEY IS NOT RESPONSIBLE FOR ANY LOSS OR OTHER FORM OF LIABILITY ARISING OUT OF OR IN CONNECTION WITH YOUR FAILURE TO COMPLY WITH ANY TAX LIABILITY THAT IS OR WILL BE APPLICABLE TO YOU.',
  },
  {
    type: 'title',
    content: '1.5 Unanticipated risks',
  },
  {
    type: 'text',
    content:
      'In addition to the risks included in this Agreement, there are other risks associated with your purchase, holding, trading, and use of tokens, some of which Portkey cannot anticipate. Such risks may further materialize as unanticipated variations or combinations of the risks discussed in this section.',
  },
  {
    type: 'text',
    content:
      'THIS RISK DISCLAIMER IS NOT EXHAUSTIVE AND SHALL NOT BE TAKEN TO ENCOMPASS ALL RISKS INVOLVED IN THE PURCHASE, HOLDING, TRADING AND USE OF TOKENS. PORTKEY SHALL NOT BE RESPONSIBLE OR LIABLE FOR ANY LOSS SUFFERED BY YOU AS A RESULT OF UNANTICIPATED RISKS.',
  },
];

export const EBRIDGE_DISCLAIMER_TEXT = EBRIDGE_DISCLAIMER_ARRAY.map(ele => ele.content).join('');
export const EBRIDGE_DISCLAIMER_TEXT_SHARE256_POLICY_ID = AElf.utils.sha256(EBRIDGE_DISCLAIMER_TEXT);

// aelf mainnet
export const BRIDGE_INFO_AELF_MAINNET: { [key: string]: { BRIDGE_CONTRACT: string } } = {
  AELF: {
    BRIDGE_CONTRACT: '2dKF3svqDXrYtA5mYwKfADiHajo37mLZHPHVVuGbEDoD9jSgE8',
  },
  tDVV: {
    BRIDGE_CONTRACT: 'GZs6wyPDfz3vdEmgVd3FyrQfaWSXo9uRvc7Fbp5KSLKwMAANd',
  },
};

// evm mainnet
export const BRIDGE_INFO_EVM_MAINNET: {
  [key: string]: {
    chainInfo: any;
    bridgeContractAddress?: string;
    bridgeContractOutAddress?: string;
    limitContractAddress?: string;
  };
} = {
  BASE: {
    chainInfo: {
      chainId: 8453,
      exploreUrl: 'https://basescan.org/',
      rpcUrl: 'https://mainnet.base.org',
    },
    bridgeContractAddress: '0x06dFaE0488FCa172500EeAd593Cb978DC5c32193',
    bridgeContractOutAddress: '0xE30382636E09a94aAF7b7e8e03a948624AbdE284',
    limitContractAddress: '0x01A2EA8D36283F2dc93F31EB8378c1E737938ef4',
  },
  ETH: {
    chainInfo: {
      chainId: 1,
      exploreUrl: 'https://etherscan.io/',
      rpcUrl: 'https://eth-mainnet.token.im',
    },
    bridgeContractAddress: '0x7ffD4a8823626AF7E181dF36AAFF4270Aeb96Ddd',
    bridgeContractOutAddress: '0x648C372668Fb65f46DB478AF0302330d06B16b8B',
    limitContractAddress: '0xBDDfac1151A307e1bF7A8cEA4fd7999eF67bdb41',
  },
  BSC: {
    chainInfo: {
      chainId: 56,
      exploreUrl: 'https://bscscan.com/',
      rpcUrl: 'https://bsc-dataseed1.binance.org',
    },
    bridgeContractAddress: '0xbAf5D0cA1e63CD10E479F227d2dc88E066F63872',
    bridgeContractOutAddress: '0xE383261ABc2A32bdd54dC9cFB5C77407C5E660ef',
    limitContractAddress: '0xAA8a4d12F7272fFA2e67F82c88D628f0E629299B',
  },
} as const;

// aelf testnet
export const BRIDGE_INFO_AELF_TESTNET: { [key: string]: { BRIDGE_CONTRACT: string } } = {
  AELF: {
    BRIDGE_CONTRACT: 'foDLAM2Up3xLjg43SvCy5Ed6zaY5CKG8uczj6yUVZUweqQUmz',
  },
  tDVW: {
    BRIDGE_CONTRACT: 'JKjoabe2wyrdP1P8TvNyD4GZP6z1PuMvU2y5yJ4JTeBjTMAoX',
  },
};

// evm testnet
export const BRIDGE_INFO_EVM_TESTNET: {
  [key: string]: {
    chainInfo: any;
    bridgeContractAddress?: string;
    bridgeContractOutAddress?: string;
    limitContractAddress?: string;
  };
} = {
  SETH: {
    chainInfo: {
      chainId: 11155111,
      exploreUrl: 'https://sepolia.etherscan.io/',
      rpcUrl: 'https://sepolia.infura.io/v3/fce90b852ec6426eb706bc1a6dcd35a6',
    },
    bridgeContractAddress: '0xf9Ab39c7A0A925BAf94f9C1c1d1CE8bFc9F9b2b3',
    bridgeContractOutAddress: '0x276A12Bd934cb9753AdB89DFe88CA1442c5B1B47',
    limitContractAddress: '0x82a0951a93f51ce67dE3F45A1381C48050762B8d',
  },
  BASE: {
    chainInfo: {
      chainId: 84532,
      exploreUrl: 'https://sepolia.basescan.org/',
      rpcUrl: 'https://sepolia.base.org',
    },
    bridgeContractAddress: '0x35aD61E5Ae01b105aD482D58937a2dCa87A2d832',
    bridgeContractOutAddress: '0x801790e7318eeE92087dD8DFA091f8FE16d93ba8',
    limitContractAddress: '0x8E0cF442690a9395C42623F6503Ab926c739f59E',
  },
  BSC: {
    chainInfo: {
      chainId: 97,
      exploreUrl: 'https://testnet.bscscan.com/',
      rpcUrl: 'https://data-seed-prebsc-1-s2.binance.org:8545',
    },
    bridgeContractAddress: '0xD032D743A87586039056E3d35894D9F0560E26Be',
    bridgeContractOutAddress: '0x4C6720dec7C7dcdE1c7B5E9dd2b327370AC9F834',
    limitContractAddress: '0x37cf44B567bA9e2a26E38B777Cc1001b7289324B',
  },
};

export const BRIDGE_TOKEN_WHITE_LIST_MAINNET: { [key: string]: any } = {
  ELF: {
    AELF: { name: 'Native Token', decimals: 8, symbol: 'ELF', address: '', issueChainId: 9992731 },
    tDVV: { name: 'Native Token', decimals: 8, symbol: 'ELF', address: '', issueChainId: 9992731 },
    '1': {
      name: 'ELF Token',
      decimals: 18,
      symbol: 'ELF',
      address: '0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e',
    },
    '56': {
      name: 'ELF Token',
      decimals: 18,
      symbol: 'ELF',
      address: '0xa3f020a5c92e15be13caf0ee5c95cf79585eecc9',
    },
  },
  ETH: {
    AELF: {
      name: 'ETH',
      decimals: 8,
      symbol: 'ETH',
      address: '',
      issueChainId: 9992731,
    },
    tDVV: {
      name: 'ETH',
      decimals: 8,
      symbol: 'ETH',
      address: '',
      issueChainId: 9992731,
    },
    '1': {
      name: 'ETH Token',
      decimals: 18,
      symbol: 'ETH',
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      isNativeToken: true,
    },
    '8453': {
      name: 'ETH Token',
      decimals: 18,
      symbol: 'ETH',
      address: '0x4200000000000000000000000000000000000006',
      isNativeToken: true,
    },
  },
  BNB: {
    AELF: { name: 'BNB Token', decimals: 8, symbol: 'BNB', address: '', issueChainId: 9992731 },
    tDVV: { name: 'BNB Token', decimals: 8, symbol: 'BNB', address: '', issueChainId: 9992731 },
    '56': {
      name: 'BNB Token',
      decimals: 18,
      symbol: 'BNB',
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      isNativeToken: true,
    },
  },
  USDC: {
    AELF: {
      name: 'USDC',
      decimals: 6,
      symbol: 'USDC',
      address: '',
      issueChainId: 9992731,
    },
    tDVV: {
      name: 'USDC',
      decimals: 6,
      symbol: 'USDC',
      address: '',
      issueChainId: 9992731,
    },
    '1': {
      name: 'USDC Token',
      decimals: 6,
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    },
    '56': {
      name: 'USDC Token',
      decimals: 18,
      symbol: 'USDC',
      address: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    },
    '8453': {
      name: 'USDC Token',
      decimals: 6,
      symbol: 'USDC',
      address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    },
  },
  USDT: {
    AELF: {
      name: 'USDT',
      decimals: 6,
      symbol: 'USDT',
      address: '',
      issueChainId: 9992731,
    },
    tDVV: {
      name: 'USDT',
      decimals: 6,
      symbol: 'USDT',
      address: '',
      issueChainId: 9992731,
    },
    '1': {
      name: 'USDT Token',
      decimals: 6,
      symbol: 'USDT',
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    },
    '56': {
      name: 'USDT Token',
      decimals: 18,
      symbol: 'USDT',
      address: '0x55d398326f99059ff775485246999027b3197955',
    },
  },
  DAI: {
    AELF: {
      name: 'DAI',
      decimals: 8,
      symbol: 'DAI',
      address: '',
      issueChainId: 9992731,
    },
    tDVV: {
      name: 'DAI',
      decimals: 8,
      symbol: 'DAI',
      address: '',
      issueChainId: 9992731,
    },
    '1': {
      name: 'DAI Token',
      decimals: 18,
      symbol: 'DAI',
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    '56': {
      name: 'DAI Token',
      decimals: 18,
      symbol: 'DAI',
      address: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
    },
    '8453': {
      name: 'DAI Token',
      decimals: 18,
      symbol: 'DAI',
      address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    },
  },
  SGR: {
    '1': {
      name: 'Schrodinger',
      decimals: 8,
      symbol: 'SGR',
      address: '0x478156DeAbfAc918369044D52A6BdB5Cc5597994',
    },
    tDVV: {
      name: 'Schrodinger',
      decimals: 8,
      symbol: 'SGR-1',
      address: '',
      issueChainId: 9992731,
    },
  },
} as const;

export const BRIDGE_TOKEN_WHITE_LIST_TESTNET: { [key: string]: any } = {
  ELF: {
    AELF: { name: 'Native Token', decimals: 8, symbol: 'ELF', address: '', issueChainId: 9992731 },
    tDVV: { name: 'Native Token', decimals: 8, symbol: 'ELF', address: '', issueChainId: 9992731 },
    tDVW: { name: 'Native Token', decimals: 8, symbol: 'ELF', address: '', issueChainId: 9992731 },
    '97': {
      name: 'ELF Token',
      decimals: 18,
      symbol: 'ELF',
      address: '0xd1CD51a8d28ab58464839ba840E16950A6a635ad',
    },
    '11155111': {
      name: 'ELF Token',
      decimals: 18,
      symbol: 'ELF',
      address: '0x8adD57b8aD6C291BC3E3ffF89F767fcA08e0E7Ab',
    },
  },
  USDT: {
    AELF: {
      name: 'USDT',
      decimals: 6,
      symbol: 'USDT',
      address: '',
      issueChainId: 9992731,
    },
    tDVV: {
      name: 'USDT',
      decimals: 6,
      symbol: 'USDT',
      address: '',
      issueChainId: 9992731,
    },
    tDVW: {
      name: 'USDT',
      decimals: 6,
      symbol: 'USDT',
      address: '',
      issueChainId: 9992731,
    },
    '97': {
      name: 'USDT Token',
      decimals: 18,
      symbol: 'USDT',
      address: '0x3F280eE5876CE8B15081947E0f189E336bb740A5',
    },
    '11155111': {
      name: 'USDT Token',
      decimals: 6,
      symbol: 'USDT',
      address: '0x60eeCc4d19f65B9EaDe628F2711C543eD1cE6679',
    },
  },
  ETH: {
    AELF: {
      name: 'ETH',
      decimals: 8,
      symbol: 'ETH',
      address: '',
      issueChainId: 9992731,
    },
    tDVV: {
      name: 'ETH',
      decimals: 8,
      symbol: 'ETH',
      address: '',
      issueChainId: 9992731,
    },
    tDVW: {
      name: 'ETH',
      decimals: 8,
      symbol: 'ETH',
      address: '',
      issueChainId: 9992731,
    },
    '11155111': {
      name: 'ETH Token',
      decimals: 18,
      symbol: 'ETH',
      address: '0x035900292c309d8beCBCAFb3227238bec0EBa253',
      isNativeToken: true,
    },
    '84532': {
      name: 'ETH Token',
      decimals: 18,
      symbol: 'ETH',
      address: '0x13aEe64E227af004De02BA2d651E4e3670e15A83',
      isNativeToken: true,
    },
  },
  USDC: {
    AELF: {
      name: 'USDC',
      decimals: 6,
      symbol: 'USDC',
      address: '',
      issueChainId: 9992731,
    },
    tDVV: {
      name: 'USDC',
      decimals: 6,
      symbol: 'USDC',
      address: '',
      issueChainId: 9992731,
    },
    tDVW: {
      name: 'USDC',
      decimals: 6,
      symbol: 'USDC',
      address: '',
      issueChainId: 9992731,
    },
    '84532': {
      name: 'USDC Token',
      decimals: 6,
      symbol: 'USDC',
      address: '0xB110e5d737dcfb38CE22E58482F9546D401F0A2D',
    },
  },
  AGENT: {
    tDVV: {
      name: 'AGENT',
      decimals: 8,
      symbol: 'AGENT',
      address: '',
      issueChainId: 1931928,
    },
    tDVW: {
      name: 'AGENT',
      decimals: 8,
      symbol: 'AGENT',
      address: '',
      issueChainId: 1931928,
    },
    '84532': {
      name: 'AGENT Token',
      decimals: 18,
      symbol: 'AGENT',
      address: '0x048d64c0b70c16b3f99d01b18e613d24d5dfaeab',
    },
  },
  BNB: {
    AELF: { name: 'BNB Token', decimals: 8, symbol: 'BNB', address: '', issueChainId: 9992731 },
    '97': {
      name: 'BNB Token',
      decimals: 18,
      symbol: 'BNB',
      address: '0x0CBAb7E71f969Bfb3eF5b13542E9087a73244F02',
      isNativeToken: true,
    },
    tDVW: { name: 'BNB Token', decimals: 8, symbol: 'BNB', address: '', issueChainId: 9992731 },
  },
  SGR: {
    '11155111': {
      name: 'Schrodinger',
      decimals: 8,
      symbol: 'SGR',
      address: '0x310e7bD119253b9F9F3AC0cD191A1b8b5b1b3b84',
    },
    tDVV: {
      name: 'Schrodinger',
      decimals: 8,
      symbol: 'SGR-1',
      address: '',
      issueChainId: 9992731,
    },
    tDVW: {
      name: 'Schrodinger',
      decimals: 8,
      symbol: 'SGR-1',
      address: '',
      issueChainId: 9992731,
    },
  },
  WRITE: {
    AELF: { name: 'WRITE Token', decimals: 8, symbol: 'WRITE', address: '', issueChainId: 9992731 },
    tDVV: { name: 'WRITE Token', decimals: 8, symbol: 'WRITE', address: '', issueChainId: 9992731 },
    tDVW: { name: 'WRITE Token', decimals: 8, symbol: 'WRITE', address: '', issueChainId: 9992731 },
  },
  WUSD: {
    '11155111': {
      name: 'WUSD Token',
      decimals: 6,
      symbol: 'WUSDvT1',
      address: '0x50A9FC9f46401f2e0AF52835aCD50238431C8ebc',
    },
    tDVV: {
      name: 'WUSD Token',
      decimals: 6,
      symbol: 'WUSDTEST',
      address: '',
      issueChainId: 9992731,
    },
    tDVW: {
      name: 'WUSD Token',
      decimals: 6,
      symbol: 'WUSDTEST',
      address: '',
      issueChainId: 9992731,
    },
    AELF: {
      name: 'WUSD Token',
      decimals: 6,
      symbol: 'WUSDTEST',
      address: '',
      issueChainId: 9992731,
    },
  },
};
