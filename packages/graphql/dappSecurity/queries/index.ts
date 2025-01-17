import { gql } from '@apollo/client';

export const CONTRACT_UPGRADE_TIME_QUERY = gql`
  query contractList($input: GetContractInfoDto) {
    contractList(input: $input) {
      totalCount
      items {
        metadata {
          block {
            blockTime
          }
        }
      }
    }
  }
`;
