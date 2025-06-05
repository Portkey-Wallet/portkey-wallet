// TODO Compatible browsers
// const permissions = ['app', 'storage', 'extension', 'runtime', 'windows', 'tabs'];

class ApiGenerator {
  constructor() {
    this.init();
  }
  init() {
    if (typeof chrome !== 'undefined') return chrome;
    if (typeof (globalThis as any).browser !== 'undefined') return (globalThis as any).browser;
  }
}

const apis: typeof chrome = new ApiGenerator().init();

export { apis };
