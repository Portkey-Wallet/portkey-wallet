type ContractAddress = string;
type Account = string;

export interface ContractsAccountItem {
  account: string;
  contractName: string;
  contractAddress: string;
}

export interface ContractsItem {
  [x: ContractAddress]: {
    [x: Account]: ContractsAccountItem;
  };
}

type origin = string;

export interface ConnectTabItem {
  id?: number;
  url?: string;
  title?: string;
}

export interface ConnectionsItem {
  id?: string;
  origin?: string;
  tabs: number[];
}

export interface ConnectionsType {
  [x: origin]: ConnectionsItem;
}
