import { callAddGuardianMethodPure } from 'model/contract/handler';

export async function guardianAccelerate(
  accelerateChainId: string,
  managerAddress: string,
  {
    caHash,
    guardianToAdd,
    guardiansApproved,
  }: {
    caHash: string;
    guardianToAdd: any;
    guardiansApproved: any;
  },
) {
  return callAddGuardianMethodPure(accelerateChainId, managerAddress, { caHash, guardianToAdd, guardiansApproved });
}
