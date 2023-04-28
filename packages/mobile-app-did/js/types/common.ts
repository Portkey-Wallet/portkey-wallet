import { SCHEME_ACTION } from 'constants/scheme';
import type { ParsedQuery } from 'query-string';

export type ErrorType = {
  errorMsg: string;
  isError: boolean;
};

export type SchemeParsedUrl = {
  domain: string;
  action: SCHEME_ACTION;
  query: ParsedQuery<string>;
};
