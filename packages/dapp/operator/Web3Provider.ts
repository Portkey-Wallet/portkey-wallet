import BaseProvider from '../model/base/BaseProvider';
import DappInteractionStream from '../model/base/DappStream';
import IChain, { IChainInitialProps } from '../model/chain/Chain';

export default abstract class Web3Provider extends BaseProvider {
  public chain: IChain;
  constructor(props: Web3ProviderProps) {
    const { stream, chainFactory } = props;
    super(stream);
    this.chain = chainFactory({ provider: this });
  }
}

export interface Web3ProviderProps {
  stream: DappInteractionStream;
  chainFactory: (props: IChainInitialProps) => IChain;
}
