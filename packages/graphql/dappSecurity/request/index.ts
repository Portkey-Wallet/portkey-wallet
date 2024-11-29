import { CONTRACT_UPGRADE_TIME_QUERY } from '../queries';
import { TGetContractUpgradeTimeParams, TGetContractUpgradeTimeResult, TGraphQLFunc } from '../types';

export const getContractUpgradeTime: TGraphQLFunc<TGetContractUpgradeTimeParams, TGetContractUpgradeTimeResult> = (
  client,
  params,
) => {
  return client.query({
    query: CONTRACT_UPGRADE_TIME_QUERY,
    variables: params,
  });
};
