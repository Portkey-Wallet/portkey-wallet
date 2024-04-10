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
  return this.config == null ? { environment: 'APP' } : this.config;
};
Inject.prototype.isAPP = function () {
  const isAPP = this.config == null || this.config.environment === 'APP';
  return isAPP;
};
Inject.prototype.isSDK = function () {
  return !this.isAPP();
};
export default new Inject();
