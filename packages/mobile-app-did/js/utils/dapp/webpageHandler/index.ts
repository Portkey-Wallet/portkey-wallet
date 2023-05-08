const handlerJS = `
const maxWaitTime = 5000;
const createHandler=()=>{
  return {
    isPortkey: true,
    on: (event, listener) => {
      window.addEventListener(event, listener);
    },
    once: (event, listener) => {
      window.addEventListener(event, listener, { once: true });
    },
    addListener: (event, listener) => {
      window.addEventListener(event, listener);
    },
    removeListener: (event, listener) => {
      window.removeEventListener(event, listener);
    },
    request: async (payload) => {
      const eventId=randomId();
      window.ReactNativeWebView.postMessage(JSON.stringify({payload,eventId}));
      return new Promise((resolve, reject) => {
        setTimeout(()=>{reject({code:-1,msg:'timeout'})},maxWaitTime);
        window.addEventListener(eventId,(e)=>{
          const {msg,code}=e.detail || {};
          if(code===0){
            resolve(e.detail);
            return;
          }
          reject(e.detail);
        },{once:true});
      });
    },
    emit: (event, data) => {
      window.dispatchEvent(new CustomEvent(event,{detail:data}));
    },
  };
}
const randomId = (max=999999) => new Date().getTime()+'_'+Math.floor(Math.random() * max);
window.ethereum = createHandler();
`;

export default handlerJS;
