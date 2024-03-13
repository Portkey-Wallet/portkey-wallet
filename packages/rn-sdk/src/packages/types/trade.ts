import { AddressBookItem } from './addressBook';
type RpcUrl = string;

export interface RecentContactItem extends AddressBookItem {
  timestamp: number;
}

export type RecentContactType = Record<RpcUrl, RecentContactItem[]>;

export interface TransferItemType {
  action: string; // 'Transferred';
  addressFrom: string; // '2R1rgEKkG84XGtbx6fvxExzChaXEyJrfSnvMpuKCGrUFoR5SKz';
  addressTo: string; //'XyRN9VNabpBiVUFeX2t7ZUR2b3tWV7U31exufJ2AUepVb5t56';
  amount: string; //'4600000.00000000';
  blockHeight: number; // 108110910;
  from: string; //'25CuX2FXDvhaj7etTpezDQDunk5xGhytxE68yTYJJfMkQwvj5p';
  id: number; //206381;
  isCrossChain: boolean;
  memo: any; //null
  method: string; //'Release';
  relatedChainId: string; //'AELF';
  symbol: string; //'ELF';
  time: string; //'2022-09-09T06:57:08.1718905Z';
  to: string; //'FXM24cEKUDqHoXFnAo9H1oza2wkELVFh7oH2eGCFoSbykAgwy';
  txFee: { ELF: number }; // { ELF: 0.24635 };
  txId: string; // '7b2fb47709dec122ec2c2e36a8032f6a2999919af6c1660f97ea0b6e97b18439';
}
