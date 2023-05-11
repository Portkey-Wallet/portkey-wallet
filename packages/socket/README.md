# How to use

1、

```js
const  listenList = [] as const;

const socket = new Signalr({
    listenList
})

// connect service
const serviceUrl = '';
socket.doOpen({url:serviceUrl})

// listen
socket.on(methodName: string, callback);
    // If you configured listenList
socket.listen(methodName: typeof listenList, callback);

// request

socket.invoke(methodName, ...args)

// Others you can refer to @microsoft/signalr

```
