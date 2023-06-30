type TaskItem = {
  eventName: string;
  method: string;
  [x: string]: any;
};
type ITaskType = {
  [x: string]: TaskItem; // {[eventId]: request payload}
};

class PendingController {
  protected pendingTask: ITaskType;
  constructor() {
    this.pendingTask = {};
  }
  addTask(task: TaskItem) {
    this.pendingTask[task.eventName] = task;
  }

  removeTask(taskEventName: string) {
    if (this.pendingTask[taskEventName]) {
      delete this.pendingTask[taskEventName];
    }
  }
}

export default new PendingController();
