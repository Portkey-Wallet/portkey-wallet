import { CaHolderManagerDto, GetCaHolderManagerInfoDto, LoginGuardianDto } from './__generated__/types';

type GenerateType<T> = {
  [K in keyof T]: T[K];
};

type PartialOption<T, K extends keyof T> = GenerateType<Partial<Pick<T, K>> & Omit<T, K>>;

interface GraphqlRequestCommonType {
  skipCount: any;
  maxResultCount: any;
}

type GraphqlCommonOption<T> = T extends GraphqlRequestCommonType ? PartialOption<T, 'skipCount' | 'maxResultCount'> : T;

//getCAHolderByManager
export type GetCAHolderByManagerParamsType = Pick<GetCaHolderManagerInfoDto, 'manager' | 'caHash' | 'chainId'>;

export type CaHolderWithGuardian = CaHolderManagerDto & {
  loginGuardianInfo: Array<LoginGuardianDto | null>;
};
