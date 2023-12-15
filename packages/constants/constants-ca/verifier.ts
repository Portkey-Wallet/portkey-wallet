import { ApprovalType, OperationTypeEnum, VerificationType } from '@portkey-wallet/types/verifier';

export const APPROVAL_TO_OPERATION_MAP = {
  [ApprovalType.communityRecovery]: OperationTypeEnum.communityRecovery,
  [ApprovalType.addGuardian]: OperationTypeEnum.addGuardian,
  [ApprovalType.editGuardian]: OperationTypeEnum.editGuardian,
  [ApprovalType.deleteGuardian]: OperationTypeEnum.deleteGuardian,
  [ApprovalType.removeOtherManager]: OperationTypeEnum.removeOtherManager,
  [ApprovalType.managerApprove]: OperationTypeEnum.managerApprove,
  [ApprovalType.modifyTransferLimit]: OperationTypeEnum.modifyTransferLimit,
  [ApprovalType.transferApprove]: OperationTypeEnum.transferApprove,
};

export const APPROVAL_TO_VERIFICATION_MAP = {
  [ApprovalType.addGuardian]: VerificationType.addGuardianByApprove,
  [ApprovalType.editGuardian]: VerificationType.editGuardian,
  [ApprovalType.deleteGuardian]: VerificationType.deleteGuardian,
  [ApprovalType.removeOtherManager]: VerificationType.removeOtherManager,
  [ApprovalType.communityRecovery]: VerificationType.communityRecovery,
  [ApprovalType.managerApprove]: VerificationType.managerApprove,
  [ApprovalType.modifyTransferLimit]: VerificationType.modifyTransferLimit,
  [ApprovalType.transferApprove]: OperationTypeEnum.transferApprove,
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
  [VerificationType.managerApprove]: OperationTypeEnum.managerApprove,
  [VerificationType.modifyTransferLimit]: OperationTypeEnum.modifyTransferLimit,
  [VerificationType.transferApprove]: OperationTypeEnum.transferApprove,
};
