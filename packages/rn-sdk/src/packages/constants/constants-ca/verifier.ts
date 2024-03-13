import { ApprovalType, OperationTypeEnum, VerificationType } from 'packages/types/verifier';

export const APPROVAL_TO_OPERATION_MAP = {
  [ApprovalType.communityRecovery]: OperationTypeEnum.communityRecovery,
  [ApprovalType.addGuardian]: OperationTypeEnum.addGuardian,
  [ApprovalType.editGuardian]: OperationTypeEnum.editGuardian,
  [ApprovalType.deleteGuardian]: OperationTypeEnum.deleteGuardian,
  [ApprovalType.removeOtherManager]: OperationTypeEnum.removeOtherManager,
};

export const VERIFICATION_TO_OPERATION_MAP = {
  [VerificationType.register]: OperationTypeEnum.register,
  [VerificationType.communityRecovery]: OperationTypeEnum.communityRecovery,
  [VerificationType.addGuardian]: OperationTypeEnum.addGuardian,
  [VerificationType.addGuardianByApprove]: OperationTypeEnum.addGuardian,
  [VerificationType.deleteGuardian]: OperationTypeEnum.deleteGuardian,
  [VerificationType.editGuardian]: OperationTypeEnum.editGuardian,
  [VerificationType.removeOtherManager]: OperationTypeEnum.removeOtherManager,
  [VerificationType.setLoginAccount]: OperationTypeEnum.setLoginAccount,
  [VerificationType.addManager]: OperationTypeEnum.unknown,
};
