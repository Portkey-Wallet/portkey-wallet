import IChain from '../model/chain/Chain';
import Contract from '../model/chain/Contract';

export default class BaseChain extends IChain {
  getContract = (params: any): Contract => {
    return {
      provider: this.mProvider,
    } as Contract;
  };
}
