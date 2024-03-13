export interface IContractService {
  callCaContractMethod(props: CallCaMethodProps): Promise<BaseMethodResult>;
}

export interface CallCaMethodProps {
  contractMethodName: string;
  isViewMethod: boolean;
  params?: { [key: string | symbol]: any };
  eventId?: string;
}
export interface BaseMethodResult {
  status: 'success' | 'fail';
  transactionId?: string;
  data?: any;
  error?: any;
}
