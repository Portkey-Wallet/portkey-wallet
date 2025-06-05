/***
 * Un-encrypted stream used to communicate between an extensions popup script and background script.
 */
export class LocalStream {
  /***
   * Sends a message to the background script
   * @param msg - The message to send
   * @returns {Promise<T>} - Responds with the message from the `watch` method's sendResponse parameter.
   */
  static send(msg: any) {
    return new Promise((resolve: any) => {
      chrome.runtime.sendMessage(msg, (response) => resolve(response));
    });
  }

  /***
   * Watches for messages from the background script
   * @param callback - A message parsing function
   */
  static watch(callback: any) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (sender.id !== chrome.runtime.id) return;
      callback(request, sendResponse);
      return true;
    });
  }
}

export default LocalStream;
