import EventEmitter from 'events';

export default class RaceControl extends EventEmitter {
  public isStop?: boolean;
  public key: symbol;
  constructor(props) {
    super(props);
    this.key = Symbol();
  }
  public stop() {
    this.isStop = true;
    this.emit(this.key);
  }
  public onOnceStop(listener: (...args: any[]) => void) {
    this.once(this.key, listener);
  }
  public onStop(listener: (...args: any[]) => void) {
    this.addListener(this.key, listener);
  }
}
