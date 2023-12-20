interface ITimeRecorder {
  start(): void;
  end(): number;
  endBySecond(): number;
}

class TimeRecorder implements ITimeRecorder {
  public startTime: number;
  constructor(startTime: number) {
    this.startTime = startTime;
  }
  public start() {
    this.startTime = Date.now();
  }
  public end() {
    return Date.now() - this.startTime;
  }
  public endBySecond() {
    return Number(((Date.now() - this.startTime) / 1000).toFixed(2));
  }
}

export function createTimeRecorder() {
  return new TimeRecorder(Date.now());
}
