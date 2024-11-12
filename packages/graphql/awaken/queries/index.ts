import { gql } from '@apollo/client';

export const LIMIT_ORDER_REMAINING_UNFILLED_QUERY = gql`
  query limitOrderRemainingUnfilled($dto: GetLimitOrderRemainingUnfilledDto!) {
    limitOrderRemainingUnfilled(dto: $dto) {
      value
      orderCount
    }
  }
`;

export const PAIR_RESERVE_QUERY = gql`
  query pairReserve($dto: GetPairReserveDto!) {
    pairReserve(dto: $dto) {
      syncRecords {
        pairAddress
        symbolA
        symbolB
        reserveA
        reserveB
      }
    }
  }
`;
