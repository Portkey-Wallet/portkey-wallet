import { sleep } from '@portkey-wallet/utils';
import { PortkeyModulesEntity } from 'service/native-modules';

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
  PortkeyModulesEntity.NativeWrapperModule.onWarning('callContractMethod', 'callContractMethod called.');
  PortkeyModulesEntity.NativeWrapperModule.emitJSMethodResult(
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
