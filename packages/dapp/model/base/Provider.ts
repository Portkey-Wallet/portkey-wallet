import { DappEvents, EventId, EventResponse } from './Event';
import { DappRequestArguments, DappRequestResponse } from './Request';
import DappInteractionStream from './DappStream';

export default interface ProviderInterface extends StreamBehaviour {
  on: (event: DappEvents, listener: (...args: any[]) => void) => this;
  once: (event: DappEvents, listener: (...args: any[]) => void) => this;
  emit: (event: DappEvents | EventId, response: DappRequestResponse | EventResponse) => boolean;
  addListener: (event: DappEvents, listener: (...args: any[]) => void) => this;
  removeListener: (event: DappEvents, listener: (...args: any[]) => void) => this;
  request: (params: DappRequestArguments) => Promise<DappRequestResponse>;
}

interface StreamBehaviour {
  setupStream: (companionStream: DappInteractionStream) => void;
  onConnectionDisconnect: (error: Error) => void;
}
