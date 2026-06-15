import { assertEBridgeCreateReceiptSuccess, buildEBridgeSendOptions } from '../../js/pages/Send/SendPreview/ebridge';

const fromChainInfo = {
  chainId: 'AELF',
  chainType: 'aelf',
  rpcUrl: 'https://aelf.io',
  bridgeContract: 'bridgeContract',
} as any;

const toChainInfo = {
  chainId: 56,
  chainType: 'ethereum',
  rpcUrl: 'https://bsc.io',
  bridgeContract: 'evmBridgeContract',
} as any;

const tokenInfo = {
  AELF: {
    symbol: 'USDT',
    decimals: 6,
    address: 'aelfUsdt',
  },
  56: {
    symbol: 'USDT',
    decimals: 18,
    address: 'bscUsdt',
  },
} as any;

describe('SendPreview eBridge helpers', () => {
  test('buildEBridgeSendOptions keeps the current wallet on eBridge options', () => {
    const wallet = { address: 'ELF_current_AELF' } as any;

    const options = buildEBridgeSendOptions({
      fromChainInfo,
      toChainInfo,
      tokenInfo,
      wallet,
    });

    expect(options.wallet).toBe(wallet);
  });

  test('buildEBridgeSendOptions rejects missing wallet', () => {
    expect(() =>
      buildEBridgeSendOptions({
        fromChainInfo,
        toChainInfo,
        tokenInfo,
        wallet: undefined as any,
      }),
    ).toThrow('Could not find wallet information');
  });

  test('assertEBridgeCreateReceiptSuccess returns successful receipt result', () => {
    const result = { transactionId: 'tx-id' };

    expect(assertEBridgeCreateReceiptSuccess(result)).toBe(result);
  });

  test('assertEBridgeCreateReceiptSuccess throws when createReceipt returns error', () => {
    expect(() => assertEBridgeCreateReceiptSuccess({ error: { message: 'CreateReceipt failed' } })).toThrow(
      'CreateReceipt failed',
    );
  });

  test('assertEBridgeCreateReceiptSuccess throws when transactionId is missing', () => {
    expect(() => assertEBridgeCreateReceiptSuccess({})).toThrow('Transfer error');
  });
});
