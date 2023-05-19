enum CentralEthereumEvents {
  CONNECTED = 'connected',
  MESSAGE = 'message',
  DISCONNECTED = 'disconnected',
  ACCOUNT_CHANGED = 'accountChanged',
  CHAIN_CHANGED = 'chainChanged',
  ERROR = 'error',
}

type DappEvents = CentralEthereumEvents;

type EventId = string;

type EventResponse = any;

export { DappEvents, EventId, EventResponse };
