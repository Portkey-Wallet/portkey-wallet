import { getDefaultWallet } from '@portkey-wallet/utils/aelfUtils';
import AElf from 'aelf-sdk';

// const wallet2 = AElf.wallet.createNewWallet();

// const walletGotByPrivitKey = AElf.wallet.getWalletByPrivateKey(wallet.privateKey);
// console.log('walletGotByPrivitKey', walletGotByPrivitKey);

// const walletGotByMn = AElf.wallet.getWalletByMnemonic(wallet.mnemonic);
// console.log('walletGotByMn', walletGotByMn);

//  account1 has many aelf
const address1 = 'mfzJTsv5UGQGoZw4gdrivTihVoZgtdm2f8ppnY7W2t6nGYfS1';
const wallet1 = getDefaultWallet();
console.log('wallet1', wallet1);

// account2
const address2 = 'PhxFvf8eMxKxrQZZNbLvmnsjwAfGShEvkPBDcjkF4qX7vsa2K';

// JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE  mainChain

// link to Blockchain
const aelf = new AElf(new AElf.providers.HttpProvider('http://192.168.66.251:8000'));
console.log(aelf, 'aelf===');

if (!aelf.isConnected()) {
  console.log('Blockchain Node is not running.');
}
// aelf.isConnected().then(v => {
//   console.log(v, 'isConnected==');
// });
aelf.chain.getBlock;

const tokenContractName = 'AElf.ContractNames.Token';
let tokenContractAddress;
let tokenContract;
(async () => {
  // get chain status
  const chainStatus = await aelf.chain.getChainStatus();
  console.log('chainStatus', chainStatus);
  // get genesis contract address
  const GenesisContractAddress = chainStatus.GenesisContractAddress;
  console.log('GenesisContractAddress', GenesisContractAddress);

  // get genesis contract instance
  const zeroContract = await aelf.chain.contractAt(GenesisContractAddress, wallet1);
  console.log('zeroContract', zeroContract);

  // Get contract address by the read only method `GetContractAddressByName` of genesis contract
  tokenContractAddress = await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(tokenContractName));
  console.log('tokenContractAddress', tokenContractAddress);

  // get token contract
  tokenContract = await aelf.chain.contractAt(tokenContractAddress, wallet1);

  // transfer
  const transactionId = await tokenContract.Transfer({
    symbol: 'ELF',
    to: address2,
    amount: '1',
    memo: 'transfer address1 to address2',
  });
  console.log('transactionId', transactionId);

  // get account balance1
  const result1 = await tokenContract.GetBalance.call({
    symbol: 'ELF',
    owner: address1,
  });
  console.log('countBlance1', result1);

  // get account balance2
  const result2 = await tokenContract.GetBalance.call({
    symbol: 'ELF',
    owner: address2,
  });
  console.log('countBlance2', result2);

  const transactionResult = await aelf.chain.getTxResult(transactionId.TransactionId);
  console.log('transactionResult', transactionResult);
})();
