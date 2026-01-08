<p align="center">
    <img width="200" src= "./logo.png"/>
</p>

<h1 align="center">Portkey</h1>

## Prerequisites

- :gear: [NodeJS](https://nodejs.org/) (LTS/Fermium)
- :toolbox: [Yarn](https://yarnpkg.com/)/[Lerna](https://lerna.js.org/)

## Package.json Scripts

| Script   			| Description                                        |
| -------- 			| -------------------------------------------------- |
| app:aelf  		| Uses `mobile-aelf` package run script              |
| extension:did | Uses `web-extension-did` package run script 			 |
| lint     			| Uses `eslint` to lint package                      |

## Getting Started

### Installing
```bash
yarn
```

### Android 
```bash
yarn app:aelf android
```

### iOS
```bash
yarn app:aelf pod-install

yarn app:aelf ios
```

### WebExtension
```bash
yarn extension:did dev
```
