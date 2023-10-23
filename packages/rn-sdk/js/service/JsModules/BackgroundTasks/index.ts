import { sleep } from '@portkey-wallet/utils';
import { portkeyModulesEntity } from 'service/native-modules';

export const handleBackgroundTask = async ({
  taskName,
  params,
}: {
  taskName: BackgroundTaskName;
  params: string;
}): Promise<void> => {
  await sleep(500);
  switch (taskName) {
    case BackgroundTaskName.CALL_CA_CONTRACT_METHOD:
    default: {
      handleCallCaContractMethod(JSON.parse(params));
    }
  }
};

export const handleCallCaContractMethod = async (config: CallCaContractMethodConfig): Promise<void> => {
  const { methodName, extraData, eventId } = config || {};
  portkeyModulesEntity.NativeWrapperModule.onWarning('callContractMethod', 'callContractMethod called.');
  portkeyModulesEntity.NativeWrapperModule.emitJSMethodResult(
    eventId,
    JSON.stringify({
      params: {
        methodName,
        eventId,
        extraData,
      },
    }),
  );
};

export enum BackgroundTaskName {
  CALL_CA_CONTRACT_METHOD = 'callCaContractMethod',
}

export interface CallCaContractMethodConfig {
  methodName: string;
  eventId: string;
  extraData: any;
}
