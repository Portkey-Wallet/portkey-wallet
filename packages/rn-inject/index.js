function Inject() {
  this.isInit = false;
}
Inject.prototype.inject = function (config) {
  if (this.isInit) {
    console.error('The inject function can only be called once');
    return;
  }
  this.isInit = true;
  this.config = config;
};
Inject.prototype.getConfig = function () {
  return this.config == null ? 'SDK' : this.config;
};

export default new Inject();
