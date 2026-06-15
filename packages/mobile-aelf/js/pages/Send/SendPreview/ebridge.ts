import type { TEBridgeOptions } from '@portkey-wallet/utils/eBridgeEOA';

type EBridgeCreateReceiptResult = {
  error?: unknown;
  transactionId?: string;
};

export const buildEBridgeSendOptions = (options: TEBridgeOptions): TEBridgeOptions => {
  if (!options.wallet) {
    throw new Error('Could not find wallet information');
  }

  return options;
};

export const assertEBridgeCreateReceiptSuccess = <T extends EBridgeCreateReceiptResult>(
  result: T | null | undefined,
): T => {
  if (result?.error) {
    if (result.error instanceof Error) {
      throw result.error;
    }

    if (typeof result.error === 'string') {
      throw new Error(result.error);
    }

    throw new Error((result.error as { message?: string })?.message || 'Transfer error');
  }

  if (!result?.transactionId) {
    throw new Error('Transfer error');
  }

  return result;
};
