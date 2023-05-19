import BaseProvider from '../base/BaseProvider';
import Contract from './Contract';

/**
 * Factory for Contracts
 */
export default abstract class IChain {
  protected mProvider: BaseProvider = null;
  constructor(props: IChainInitialProps) {
    const { provider } = props;
    this.mProvider = provider;
  }

  public setProvider = (provider: BaseProvider) => {
    this.mProvider = provider;
  };

  abstract getContract: (params: any) => Contract;
}

export interface IChainInitialProps {
  provider: BaseProvider;
}
