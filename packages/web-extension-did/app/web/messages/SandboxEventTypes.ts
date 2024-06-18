enum SandboxEventTypes {
  getBalances = 'getBalances',
  // View
  callViewMethod = 'callViewMethod',
  // Send
  callSendMethod = 'callSendMethod',
  // getEncodedTx
  getTransactionFee = 'getTransactionFee',
  // getTransactionRaw
  getTransactionRaw = 'getTransactionRaw',

  initViewContract = 'initViewContract',
  // cross etransfer
  etransferCrossTransfer = 'etransferCrossTransfer',
}
export default SandboxEventTypes;
