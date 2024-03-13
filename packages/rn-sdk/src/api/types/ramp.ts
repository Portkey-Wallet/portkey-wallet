export interface IRampService {
  openRampHome(toTab?: RampTabType): Promise<void>;
}
export enum RampTabType {
  'BUY',
  'SELL',
}
