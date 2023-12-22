/* global portkey */

// century renew blade meadow faith evil uniform work discover poet ripple drill

// JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE is Token contract in testnet.
const tokenContractAddress = 'ELF_JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE_AELF';
// const testAddress = '2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX';
// Please set your own address.
let testAddress = 'YUW9zH5GhRboT5JK4vXp5BLAfCDv28rRmTQwo418FuaJmkSg8';

// events
document.addEventListener('portkey#initialized', (result) => {
  console.log('portkey#initialized', Date.now());
  console.log('portkey test.html: ', result);

  window.portkey.on('connect', (...args) => {
    console.log(args, 'connect== on');
  });

  window.portkey.on('chainChanged', (...args) => {
    console.log(args, '_handleChainChanged== on');
    const loginInfo = document.getElementById('chain-info');
    loginInfo.innerHTML = JSON.stringify(args[0]);
    testAddress = args[0].address;
  });

  window.portkey.on('accountsChanged', (...args) => {
    const loginInfo = document.getElementById('login-info');
    console.log(args, 'accountsChanged== on');
    loginInfo.innerHTML = JSON.stringify(args[0]);
  });
  window.portkey.on('onDisconnect', (...args) => {
    console.log(args, 'onDisconnect== on');
  });

  // window.ethereum.on('accountsChanged', (...args) => {
  //   console.log(args, 'args ethereum==accountsChanged');
  // });
  //

  const versionBtn = document.getElementById('version-btn');
  const loginBtn = document.getElementById('login-btn');
  const switchNetwork = document.getElementById('switch-network');

  const logoutBtn = document.getElementById('logout-btn');
  const lockBtn = document.getElementById('lock-btn');
  const getChainStatus = document.getElementById('get-chain-status');
  const callAelfChainBtn = document.getElementById('call-aelf-chain');
  const initAelfContract = document.getElementById('init-aelf-contract');
  const callAelfContract = document.getElementById('call-aelf-contract');
  const executeAelfContract = document.getElementById('execute-aelf-contract');
  const executeAelfContractUnapproved = document.getElementById('execute-aelf-contract-un-approve');

  const executeAelfContractTransfer = document.getElementById('execute-aelf-contract-transfer');
  const executeAelfContractDiffrentParam = document.getElementById('execute-aelf-contract-diff');
  const aelfContractGetSignTx = document.getElementById('execute-aelf-contract-getSignTx');

  const checkPermissionDefault = document.getElementById('check-permission-default');
  const checkPermissionAddress = document.getElementById('check-permission-address');
  const checkPermissionContractAddress = document.getElementById('check-permission-contract');
  const setPermission = document.getElementById('set-contract-permission');
  const removeContractPermission = document.getElementById('remove-contract-permission');
  const removeWhitelist = document.getElementById('remove-whitelist');
  // Login at first
  const aelf = new window.portkey.AElf({
    // httpProvider: 'http://192.168.199.210:5000/chain',
    // httpProvider: ['http://192.168.66.237:8000'],
    httpProvider: ['https://explorer.aelf.io/chain'],
    // httpProvider: ['http://1.119.195.50:11105/chain'],
    // httpProvider: ['http://1.119.195.50:11105/chain'],
    appName: 'your own app name',
    pure: true,
  });
  // const aelfNight = new window.NightElf.AElf({
  //   // httpProvider: 'http://192.168.199.210:5000/chain',
  //   httpProvider: ['https://explorer-test.aelf.io/chain'],
  //   // httpProvider: ['http://1.119.195.50:11105/chain'],
  //   // httpProvider: ['http://1.119.195.50:11105/chain'],
  //   appName: 'your own app name',
  //   pure: true,
  // });
  // console.log('aelf>>>>>>>>>>>', aelf, aelfNight);

  switchNetwork.onclick = async function () {
    const switchNetworkRes = await window.portkey.request({
      method: 'portkey_switchChain',
      params: {
        rpcUrl: 'https://explorer-test.aelf.io/chain',
        chainType: 'aelf',
      },
    });
    console.log(switchNetworkRes, 'switchNetworkRes===');
  };

  versionBtn.onclick = function () {
    console.log('version:', aelf.getVersion());
  };

  loginBtn.onclick = function () {
    aelf
      .login({
        chainId: 'AELF',
        appName: 'test app',
        appLogo: 'https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white-d0c9fe2af5.png',
        rpcUrl: 'https://explorer-test.aelf.io/chain',
      })
      .then((result) => {
        // console.log('promise then', result);
        console.log(result, 'login==result==');
        if (result.data?.address) {
          testAddress = result.data.address;
        }
      })
      .catch((error) => {
        console.log('promise catch', error);
      });
  };

  logoutBtn.onclick = async function () {
    aelf.logout(
      {
        chainId: 'AELF',
        address: testAddress,
      },
      (error, result) => {
        console.log('logout>>>>>>>>>>>>>>>>>>', error, result);
      },
    );
  };

  lockBtn.onclick = function () {
    aelf.lock({}, (error, result) => {
      console.log('lock>>>>>>>>>>>>>>>>>>', result);
    });
  };

  const getChainStatusValue = document.getElementById('get-chain-status-value');

  getChainStatus.onclick = function () {
    // If you unlock you Portkey
    // When you get the unlock prompt page, callback way will be influence.
    // You can not get callback in this demo.[Use callback && promise in the same time]
    // But if you use callback way only. It's OK.
    aelf.chain.getChainStatus((error, result) => {
      console.log('>>>>>>>>>>>>> getChainStatus callback >>>>>>>>>>>>>');
      console.log(error, result);
      if (error) {
        return (getChainStatusValue.innerHTML = JSON.stringify(error));
      }
      getChainStatusValue.innerHTML = JSON.stringify(result);
    });

    aelf.chain
      .getChainStatus()
      .then((result) => {
        console.log('>>>>>>>>>>>>> getChainStatus promise >>>>>>>>>>>>>');
        console.log('promise then', result);
      })
      .catch((error) => {
        console.log('promise catch', error);
      });
  };

  setPermission.onclick = function () {
    aelf.setContractPermission(
      {
        hainId: 'AELF',
        payload: {
          address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu',
          contracts: [
            {
              chainId: 'AELF',
              contractAddress: tokenContractAddress,
              contractName: 'token',
              description: 'token contract',
              github: '',
            },
            {
              chainId: 'AELF TEST',
              contractAddress: 'TEST contractAddress',
              contractName: 'TEST contractName',
              description: 'contract description',
              github: '',
            },
          ],
        },
      },
      (error, result) => {
        console.log('>>>>>>>>>>>>>', result);
      },
    );
  };

  callAelfChainBtn.onclick = function () {
    const txid = 'ff5bcd126f9b7f22bbfd0816324390776f10ccb3fe0690efc84c5fcf6bdd3fc6';
    aelf.chain.getTxResult(txid, (err, result) => {
      console.log('>>>>>>>>>>>>> getTxResult >>>>>>>>>>>>>');
      console.log(err, result);
    });
  };

  const getBlockByHeight = document.getElementById('get-block-by-height');
  getBlockByHeight.onclick = function () {
    aelf.chain.getBlockByHeight(66, true, (err, result) => {
      console.log('>>>>>>>>>>>>> getBlockByHeight >>>>>>>>>>>>>');
      console.log(err, result);
    });
  };
  const getBlockHeight = document.getElementById('get-block-height');
  getBlockHeight.onclick = function () {
    aelf.chain.getBlockHeight((err, result) => {
      console.log('>>>>>>>>>>>>> getBlockHeight >>>>>>>>>>>>>');
      console.log(err, result);
    });
  };
  const getBlock = document.getElementById('get-block');
  getBlock.onclick = function () {
    aelf.chain.getBlockHeight((err, result) => {
      console.log('>>>>>>>>>>>>> getBlock >>>>>>>>>>>>>');
      console.log(err, result);
    });
  };

  const getContractFileDescriptorSet = document.getElementById('get-contract-descriptor-set');
  getContractFileDescriptorSet.onclick = function () {
    aelf.chain.getContractFileDescriptorSet('JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE', (err, result) => {
      console.log('getContractFileDescriptorSet>>>>>>>>>>>>>>>>>>>', result);
    });
  };

  const sendTransaction = document.getElementById('send-transation');
  sendTransaction.onclick = function () {
    aelf.chain.sendTransaction({}, (err, result) => {
      console.log('>>>>>>>>>>>>>>>>>>>', result);
    });
  };

  removeContractPermission.onclick = function () {
    aelf.removeContractPermission(
      {
        payload: {
          // contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb'
          contractAddress: tokenContractAddress,
        },
      },
      (error, result) => {
        console.log('removeContractPermission>>>>>>>>>>>>>>>>>>>', result);
      },
    );
  };

  removeWhitelist.onclick = function () {
    aelf.removeMethodsWhitelist(
      {
        payload: {
          // contractAddress: '2Xg2HKh8vusnFMQsHCXW1q3vys5JxG5ZnjiGwNDLrrpb9Mb',
          // whitelist: ['Approve']
          contractAddress: tokenContractAddress,
          whitelist: ['Transfer'],
        },
      },
      (error, result) => {
        console.log('removeWhitelist>>>>>>>>>>>>>>>>>', result);
      },
    );
  };

  /* global tokenC */
  window.tokenC = {};
  initAelfContract.onclick = function () {
    const wallet = {
      address: testAddress,
      // address withoud permission
      // address: '65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9'
    };
    // It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
    // There is only one value named address;
    aelf.chain.contractAt(tokenContractAddress, wallet, (error, result) => {
      console.log('>>>>>>>>>>>>> contractAt Async >>>>>>>>>>>>>');
      console.log(error, result);
      window.tokenC = result;
    });
  };

  callAelfContract.onclick = async function () {
    const res = await tokenC.GetBalance.call(
      {
        symbol: 'ELF',
        owner: testAddress,
      },
      (err, result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', err, result);
      },
    );
    console.log(res, 'callAelfContract==');
  };

  executeAelfContract.onclick = function () {
    tokenC.Approve(
      {
        amount: '100',
        spender: testAddress,
        symbol: 'ELF',
      },
      (err, result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', err, result);
      },
    );
  };

  executeAelfContractUnapproved.onclick = function () {
    tokenC.UnApprove(
      {
        amount: '100',
        spender: testAddress,
        symbol: 'ELF',
      },
      (err, result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', err, result);
      },
    );
  };

  executeAelfContractTransfer.onclick = function () {
    tokenC.Transfer(
      {
        symbol: 'ELF',
        // to: 'ELF_2RCLmZQ2291xDwSbDEJR6nLhFJcMkyfrVTq1i1YxWC4SdY49a6_AELF',
        to: '2mxgN6utUcCpUeXm3HDrNpm1VXeLKdZ9Q8wUAyqosZD5TeEJRQ',
        amount: 1,
        memo: 'have fun',
      },
      (err, result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', err, result);
      },
    );
  };

  executeAelfContractDiffrentParam.onclick = function () {
    tokenC.Transfer(
      {
        symbol: 'ELF',
        to: 'ELF_2RCLmZQ2291xDwSbDEJR6nLhFJcMkyfrVTq1i1YxWC4SdY49a6_AELF',
        // to: 'ELF_2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX_AELF',
        amount: 2,
        memo: 'have fun',
      },
      (err, result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', result);
      },
    );
  };

  aelfContractGetSignTx.onclick = function () {
    tokenC.Transfer.getSignedTx(
      {
        symbol: 'ELF',
        to: 'KKvRDUeqNcXvXFSRTXn4A16WTx8gyfSggJjaHFBhaSMPn5ZL4',
        amount: 1,
        memo: 'have fun',
      },
      (err, result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', err, result);
      },
    );
  };

  // checkPermissionDefault.onclick = function () {
  //     portkey.api({
  //         appName: 'hzzTest',
  //         method: 'CHECK_PERMISSION',
  //         address: 'ELF_6WZNJgU5MHWsvzZmPpC7cW6g3qciniQhDKRLCvbQcTCcVFH'
  //     }).then(result => {
  //         console.log('>>>>>>>>>>>>>>>>>>>', result);
  //     });
  // };

  checkPermissionDefault.onclick = function () {
    aelf.checkPermission(
      {
        appName: 'hzzTest',
        address: '2JqnxvDiMNzbSgme2oxpqUFpUYfMjTpNBGCLP2CsWjpbHdu',
      },
      (error, result) => {
        console.log('checkPermission>>>>>>>>>>>>>>>>>', result);
      },
    );
  };

  checkPermissionAddress.onclick = function () {
    aelf.checkPermission(
      {
        appName: 'hzzTest',
        address: testAddress,
        type: 'address', // if you did not set type, it aways get by domain.
      },
      (error, result) => {
        console.log('checkPermission>>>>>>>>>>>>>>>>>', result);
      },
    );
  };

  checkPermissionContractAddress.onclick = function () {
    aelf.checkPermission(
      {
        appName: 'hzzTest',
        address: testAddress,
        contractAddress: tokenContractAddress,
        type: 'contract', // if you did not set type, it aways get by domain.
      },
      (error, result) => {
        console.log('checkPermission>>>>>>>>>>>>>>>>>', result);
      },
    );
  };

  const illegalMethod = document.getElementById('error-illegal-method');
  illegalMethod.onclick = function () {
    window.portkey
      .request({
        appName: 'hzzTest',
        method: 'GET_ADDRESS233',
      })
      .then((result) => {
        console.log('>>>>>>>>>>>>>>>>>>>', result);
      });
  };

  const errorGetTxResult = document.getElementById('error-get-tx-result');
  errorGetTxResult.onclick = function () {
    aelf.chain.getTxResult('', (err, result) => {
      console.log('getTxResult Error>>>>>>>>>>>>>>>>>>>', err, result);
    });
  };

  const getSignature = document.getElementById('get-signature');
  getSignature.onclick = function () {
    aelf
      .getSignature({
        appName: 'hzzTest',
        address: testAddress,
        // address: 'ELF_28Y8JA1i2cN6oHvdv7EraXJr9a1gY6D1PpJXw9QtRMRwKcBQMK_AELF',
        hexToBeSign: '2322233',
      })
      .then((result) => {
        console.log('result: ', result);
      });
  };

  const getAddressBtn = document.getElementById('get-address-btn');
  getAddressBtn.onclick = async () => {
    const list = await aelf.getAddress();
    console.log('getAddress>>>>>>>>>>>>>>>>>>', list);
  };

  const setRecaptchaCode = document.getElementById('set-recaptcha-code');
  setRecaptchaCode.onclick = async () => {
    const list = await window.portkey.request({
      method: 'portkey_setReCaptchaCodeV2',
      params: {
        a: 1,
        b: 2,
      },
    });
    console.log('getAddress>>>>>>>>>>>>>>>>>>', list);
  };

  const getExtensionInfo = document.getElementById('get-extension-info');
  getExtensionInfo.onclick = async () => {
    try {
      const list = await aelf.getExtensionInfo();
      console.log('getExtensionInfo>>>>>>>>>>>>>>>>>>', list);
    } catch (error) {
      console.log('getExtensionInfo>>>>>>>>>>>>>>>>>>error', error);
    }
  };
  // For test
  // const permissionIndex = [0];
  // const permissionsTemp = [{
  //     "appName": "hzzTest",
  //     "domain": "OnlyForTest!!!",
  //     "address": "ELF_4yCJfobjm2YAdxGrwACQihpa3TMz1prDTdYiWTvFTvefQFs",
  //     "contracts": [{
  //             "chainId": "AELF",
  //             "contractAddress": "ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx",
  //             "contractName": "token",
  //             "description": "token contract",
  //             "github": ""
  //         },
  //         {
  //             "chainId": "AELF TEST",
  //             "contractAddress": "TEST contractAddress",
  //             "contractName": "TEST contractName",
  //             "description": "contract description",
  //             "github": ""
  //         }
  //     ]
  // }];

  // CALL_AELF_CONTRACT_WITHOUT_CHECK
  // portkey.api({
  //     appName: 'hzzTest',
  //     // method: 'CALL_AELF_CONTRACT',
  //     method: 'CALL_AELF_CONTRACT_WITHOUT_CHECK',
  //     hostname: 'aelf.io',
  //     chainId: 'AELF',
  //     payload: {
  //         contractName: 'token',
  //         contractAddress: 'ELF_3AhZRe8RvTiZUBdcqCsv37K46bMU2L2hH81JF8jKAnAUup9',
  //         method: 'BalanceOf',
  //         params: ['ELF_2rAp1aiE3VMwR6SEx5dJYR2Sh8NHsJ2euJoxNaT7uF7XfeB']
  //     }
  // }).then(result => {
  //     console.log('>>>>>>>>>>>>>>>>>>>', result);
  // });
});
