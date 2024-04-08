import { ChainId } from '@portkey-wallet/types';
import { AElfInterface } from '@portkey-wallet/types/aelf';
import { ContractBasic } from '@portkey-wallet/contracts/utils/ContractBasic';
import { AuthRequestPromptOptions, AuthSessionResult } from 'expo-auth-session';
export type State = {
  currentInterface?: AElfInterface;
  viewContracts?: { [key: string]: ContractBasic };
  caContracts?: { [key in ChainId]?: { [key: string]: ContractBasic } };

  googleRequest: any | null;
  response: AuthSessionResult | null;
  promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>;
};
