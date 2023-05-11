const isFunction = (object: any) => typeof object === 'function';
const isBoolean = (object: any) => typeof object === 'boolean';
export default function extractArgumentsIntoObject(args: any): {
  callback: (...arg: any[]) => void;
  isSync: boolean;
} {
  const result = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    callback: () => {},
    isSync: false, // isSync is forbidden in plugins
  };
  if (args.length === 0) {
    // has no callback, default to be async mode
    return result;
  }
  if (isFunction(args[args.length - 1])) {
    result.callback = args[args.length - 1];
  }
  args.forEach((arg: any) => {
    if (isBoolean(arg.sync)) {
      result.isSync = arg.sync;
    }
  });
  return result;
}
