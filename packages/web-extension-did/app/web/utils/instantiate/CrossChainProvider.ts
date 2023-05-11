export default class CrossChainProvider {
  wallet: any;
  CROSS_INFO: any;
  constructor(options: { wallet: any; CROSS_INFO: any }) {
    this.wallet = options.wallet;
    // const CROSS_INFO = {
    //     mainChainId: 9992731,
    //     issueChainId: 9992731, // Token issue chain id
    //     from: {
    //         name: 'AELF',
    //         url: 'https://explorer-test.aelf.io/chain',
    //         id: 9992731,
    //         mainTokenContract: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
    //         crossChainContract: '2SQ9LeGZYSWmfJcYuQkDQxgd3HzwjamAaaL4Tge2eFSXw2cseq'
    //     },
    //     to: {
    //         name: 'tDVV',
    //         url: 'https://tdvv-wallet-test.aelf.io/chain', // provider url
    //         id: 1866392, // chain id
    //         mainTokenContract: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
    //         crossChainContract: '2snHc8AMh9QMbCAa7XXmdZZVM5EBZUUPDdLjemwUJkBnL6k8z9'
    //     }
    // };
    this.CROSS_INFO = options.CROSS_INFO;
  }

  send(param: any) {
    return window?.portkey_did?.request({
      method: 'CROSS_SEND',
      params: {
        method: 'CROSS_SEND',
        address: this.wallet.address,
        param,
        CROSS_INFO: this.CROSS_INFO,
      },
    });
  }

  receive(param: any) {
    return window?.portkey_did?.request({
      method: 'CROSS_RECEIVE',
      params: {
        method: 'CROSS_RECEIVE',
        address: this.wallet.address,
        param,
        CROSS_INFO: this.CROSS_INFO,
      },
    });
  }
}
