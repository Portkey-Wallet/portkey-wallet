import {
  SUPPORTED_EC,
  CHAIN_APIS,
  MOCK_ACCOUNT_RES1,
  // MOCK_ACCOUNT_RES2,
  // MOCK_WALLET2,
  MOCK_WALLET1,
} from '../../constants/webview';
import * as elliptic from 'elliptic';
import AElf from 'aelf-sdk';
import { WebViewRequestTypes, BridgeActionTypes, ParamsOfRequestTypes, RnResponseTypes } from './types/types';
import { randomId, serializeMessage, sign, verify, checkTimestamp } from '../../utils/bridgeUtils';
import { Buffer } from 'buffer';
import { decode } from 'base-64';
// import { app2dAppPublicKey } from '../../constants/webview';

// formatResponseData
export const responseFormat = (id: string, result = {}, errors = { code: 500, message: 'err happened' }) => {
  if (errors && (errors instanceof Error || (Array.isArray(errors) && errors.length > 0))) {
    return {
      id,
      result: {
        error: Array.isArray(errors) ? errors : [errors],
        code: errors.code || 500,
        msg: errors.message || 'err happened',
        data: result,
      },
    };
  }
  return {
    id,
    result: {
      code: 0,
      msg: 'success',
      error: [],
      data: result,
    },
  };
};

const handleRequestVerify = (
  action: BridgeActionTypes,
  params: ParamsOfRequestTypes,
  dappKeyPair: elliptic.ec.KeyPair,
) => {
  const { signature } = params;
  if (action === BridgeActionTypes.CONNECT) {
    return verify(Buffer.from(String(params.timestamp)), signature, dappKeyPair);
  }
  return verify(Buffer.from(params.originalParams as string, 'base64'), signature, dappKeyPair);
};

// generateConnectResponse
const generateConnectResponse = (keyPair: any) => {
  const random = randomId();
  const signature = sign(random, keyPair);
  const publicKey = keyPair.getPublic().encode('hex');

  return {
    publicKey,
    signature,
    random,
  };
};

const deserializeRequestParams = (action: BridgeActionTypes, params: ParamsOfRequestTypes) => {
  if (action === BridgeActionTypes.CONNECT) {
    return {
      timestamp: params.timestamp,
      publicKey: params.publicKey,
    };
  }
  let result;
  const deCodeResult = decodeURIComponent(decode(params.originalParams as string));
  try {
    result = JSON.parse(deCodeResult);
  } catch (e) {
    result = {};
  }
  if (!checkTimestamp(result.timestamp)) {
    throw new Error('Timestamp is not valid');
  }
  return {
    ...result,
  };
};

export const serializeResult = (response: RnResponseTypes, keyPair: elliptic.ec.KeyPair) => {
  const originalResult = serializeMessage(response.result);
  const signature = sign(Buffer.from(originalResult, 'base64'), keyPair);
  return {
    id: response.id,
    result: {
      originalResult,
      signature,
    },
  };
};

enum ApiPath {
  '/api/blockChain/chainStatus' = '/api/blockChain/chainStatus',
  '/api/blockChain/blockState' = '/api/blockChain/blockState',
  '/api/blockChain/contractFileDescriptorSet' = '/api/blockChain/contractFileDescriptorSet',
  '/api/blockChain/blockHeight' = '/api/blockChain/blockHeight',
  '/api/blockChain/block' = '/api/blockChain/block',
  '/api/blockChain/blockByHeight' = '/api/blockChain/blockByHeight',
  '/api/blockChain/transactionResult' = '/api/blockChain/transactionResult',
  '/api/blockChain/transactionResults' = '/api/blockChain/transactionResults',
  '/api/blockChain/merklePathByTransactionId' = '/api/blockChain/merklePathByTransactionId',
}
const handleApi = async (params: any, aelfInstance: any) => {
  const { apiPath, endpoint, arguments: apiArgs, methodName } = params;
  if (!CHAIN_APIS[apiPath as ApiPath]) {
    throw new Error(`Not support api ${apiPath}`);
  }
  if (endpoint) {
    aelfInstance.setProvider(new AElf.providers.HttpProvider(endpoint));
  }
  const result = await aelfInstance.chain[methodName](...apiArgs.map((v: { value: string }) => v.value));
  return result;
};

const handleContractMethods = async (params: { endpoint: string; address: string }, aelfInstance: any) => {
  const { endpoint, address } = params;

  if (endpoint) {
    aelfInstance.setProvider(new AElf.providers.HttpProvider(endpoint));
  }

  const contract = await aelfInstance.chain.contractAt(address, MOCK_WALLET1);
  return Object.keys(contract)
    .filter(v => /^[A-Z]/.test(v))
    .sort();
};

const handleInvoke = async (params: any, isReadOnly = false, aelfInstance: any) => {
  const { endpoint, contractAddress, contractMethod, arguments: contractArgs } = params;

  if (endpoint) {
    aelfInstance.setProvider(new AElf.providers.HttpProvider(endpoint));
  }
  const contract = await aelfInstance.chain.contractAt(contractAddress, MOCK_WALLET1);
  if (!contract[contractMethod]) {
    throw new Error(`No such method ${contractMethod}`);
  }
  let result;
  if (isReadOnly) {
    result = await contract[contractMethod].call(...contractArgs.map((v: { value: string }) => v.value));
  } else {
    result = await contract[contractMethod](...contractArgs.map((v: { value: string }) => v.value));
  }
  return result;
};

export const handleMessage = async (
  request: WebViewRequestTypes,
  keyPair: elliptic.ec.KeyPair,
  dappKeyPair: elliptic.ec.KeyPair,
  aelfInstance: any,
) => {
  const { id, action, params } = request;

  if (!handleRequestVerify(action, params, dappKeyPair)) {
    throw new Error('Received an invalid signature');
  }
  const realParams = deserializeRequestParams(action, params);

  let data = {};
  let result = {};
  try {
    switch (action) {
      case BridgeActionTypes.CONNECT:
        result = responseFormat(id, generateConnectResponse(keyPair));
        break;
      case BridgeActionTypes.INVOKE:
        data = await handleInvoke(realParams, false, aelfInstance);
        result = responseFormat(id, data);
        break;
      case BridgeActionTypes.INVOKEREAD:
        data = await handleInvoke(realParams, action === BridgeActionTypes.INVOKEREAD, aelfInstance);
        result = responseFormat(id, data);
        break;
      case BridgeActionTypes.GETCONTRACTMETHODS:
        data = await handleContractMethods(realParams, aelfInstance);
        result = await responseFormat(id, data);
        break;
      case BridgeActionTypes.ACCOUNT:
        result = responseFormat(id, MOCK_ACCOUNT_RES1);
        break;
      case BridgeActionTypes.API:
        data = await handleApi(realParams, aelfInstance);
        result = responseFormat(id, data);
        break;
      case BridgeActionTypes.DISCONNECT:
        result = responseFormat(id);
        break;
      default:
        throw new Error(`Not implement this action ${action}`);
    }
    return result;
  } catch (e) {
    console.log(e);
    return responseFormat(id, {}, e as { code: number; message: string });
  }
};

export const handleConnection = (request: any, keyPairs: elliptic.ec.KeyPair | undefined) => {
  const { timestamp, encryptAlgorithm, signature, publicKey } = request.params;
  if (!checkTimestamp(timestamp)) {
    throw new Error('Timestamp is not valid');
  }
  if (!SUPPORTED_EC.includes(encryptAlgorithm)) {
    throw new Error(`Not support ${encryptAlgorithm}`);
  }

  // const dappArray = keyPairs.map(ele => {
  //   const ec = new elliptic.ec(encryptAlgorithm);
  //   return ec.keyFromPublic(publicKey, 'hex');
  // });

  const ec = new elliptic.ec(encryptAlgorithm);
  const dappKeyPair = ec.keyFromPublic(publicKey, 'hex');

  let keyPair: elliptic.ec.KeyPair | undefined = keyPairs;
  if (!keyPair) keyPair = ec.genKeyPair();
  // const ec1 = new elliptic.ec(encryptAlgorithm);

  // const keyPair = ec1.keyFromPublic(app2dAppPublicKey, 'hex');

  if (!verify(Buffer.from(String(timestamp)), signature, dappKeyPair)) {
    throw new Error('Received an invalid signature');
  }

  return {
    keyPair,
    dappKeyPair,
    encryptAlgorithm,
  };
};
