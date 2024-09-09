import AElf from 'aelf-sdk';
import { getContractMethods } from '@portkey/contracts';
// new AElf(AElf.providers.HttpProvider())
export async function getRawParams(instance: any, raw: string) {
  const txParams = decodeParams(AElf.pbUtils.Transaction, Buffer.from(raw, 'hex'));
  const data = { ...txParams };

  const _params = txParams.params || txParams.args;

  if (txParams.methodName && _params) {
    try {
      // get ca proto
      const methodParams = await getParams(instance, txParams.methodName, Buffer.from(_params, 'base64'), txParams.to);
      data.params = methodParams;
    } catch (error) {
      return txParams;
    }
  }

  if (data.params.methodName) {
    const transferTokenParams = await getParams(
      instance,
      data.params.methodName,
      Buffer.from(data.params.params || data.params.args, 'base64'),
      data.params.contractAddress,
    );
    if (data.params.args) data.params.args = transferTokenParams;
    if (data.params.params) data.params.params = transferTokenParams;
  }
  return data;
}

async function getParams(instance: any, methodName: string, args: any, contractAddress: string) {
  // console.log(methodName, args, contractAddress, "====contractAddress");
  const methods = await getContractMethods(instance, contractAddress);
  const inputType = methods[methodName];
  return decodeParams(inputType, args);
}

export const unpackSpecifiedTypeData = ({ data, dataType, encoding = 'hex' }: any) => {
  const buffer = Buffer.from(data, encoding);
  const decoded = dataType.decode(buffer);
  const result = dataType.toObject(decoded, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true, // includes virtual oneof fields set to the present field's name
  });
  return result;
};
export const decodeParams = (inputType: any, bufferData: any) => {
  let result = unpackSpecifiedTypeData({
    data: bufferData.toString('hex'),
    dataType: inputType,
  });
  result = AElf.utils.transform.transform(inputType, result, AElf.utils.transform.OUTPUT_TRANSFORMERS);
  return AElf.utils.transform.transformArrayToMap(inputType, result);
};
