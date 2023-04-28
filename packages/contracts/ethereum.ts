import Web3 from 'web3';

export const getETHChainBalance = async (rpcUrl: string, owner: string) => {
  var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  return await web3.eth.getBalance(owner);
};
