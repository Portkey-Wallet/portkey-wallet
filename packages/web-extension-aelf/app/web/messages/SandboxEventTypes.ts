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
  // [DEPRECATED-ETRANSFER] cross etransfer - deprecated, use eBridge instead
  // etransferCrossTransfer = 'etransferCrossTransfer',
  // cross eBridge
  eBridgeCrossTransfer = 'eBridgeCrossTransfer',
  eBridgeCrossTransferLimit = 'eBridgeCrossTransferLimit',
  eBridgeCrossTransferELFFee = 'eBridgeCrossTransferELFFee',

  // decodedTxData
  getDecodedTxData = 'getDecodedTxData',
}
export default SandboxEventTypes;
