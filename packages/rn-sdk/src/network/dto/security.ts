import { ITransferLimitItem } from 'model/security';

export interface CheckPaymentSecurityRuleParams {
  caHash: string;
  skipCount?: number;
  maxResultCount?: number;
}

export interface CheckPaymentSecurityRuleResult {
  data: ITransferLimitItem[];
  totalRecordCount: number;
}
