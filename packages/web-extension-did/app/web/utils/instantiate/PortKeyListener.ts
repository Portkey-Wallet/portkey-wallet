import SafeEventEmitter from '@metamask/safe-event-emitter';
export default class PortKeyListener extends SafeEventEmitter {
  constructor(props?: any) {
    super(props);
  }
  on(eventName: string, listener: (...args: any[]) => void) {
    return super.on(eventName, listener);
  }
  emit(type: string, ...args: any[]): boolean {
    return super.emit(type, ...args);
  }
}
