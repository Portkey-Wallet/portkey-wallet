import { DEFAULT_FETCH_TIMEOUT } from '@portkey-wallet/constants/misc';
import { timeoutPromise } from '@portkey-wallet/im/request';
import { stringify } from 'query-string';
export interface StringifyOptions {
  /**
	Strictly encode URI components with [`strict-uri-encode`](https://github.com/kevva/strict-uri-encode). It uses [`encodeURIComponent`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) if set to `false`. You probably [don't care](https://github.com/sindresorhus/query-string/issues/42) about this option.

	@default true
	*/
  readonly strict?: boolean;

  /**
	[URL encode](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) the keys and values.

	@default true
	*/
  readonly encode?: boolean;

  /**
	@default 'none'

	- `bracket`: Serialize arrays using bracket representation:

		```
		import queryString = require('query-string');

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'bracket'});
		//=> 'foo[]=1&foo[]=2&foo[]=3'
		```

	- `index`: Serialize arrays using index representation:

		```
		import queryString = require('query-string');

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'index'});
		//=> 'foo[0]=1&foo[1]=2&foo[2]=3'
		```

	- `comma`: Serialize arrays by separating elements with comma:

		```
		import queryString = require('query-string');

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'comma'});
		//=> 'foo=1,2,3'

		queryString.stringify({foo: [1, null, '']}, {arrayFormat: 'comma'});
		//=> 'foo=1,,'
		// Note that typing information for null values is lost
		// and `.parse('foo=1,,')` would return `{foo: [1, '', '']}`.
		```

	- `separator`: Serialize arrays by separating elements with character:

		```
		import queryString = require('query-string');

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'separator', arrayFormatSeparator: '|'});
		//=> 'foo=1|2|3'
		```

	- `bracket-separator`: Serialize arrays by explicitly post-fixing array names with brackets and separating elements with a custom character:

		```
		import queryString = require('query-string');

		queryString.stringify({foo: []}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]'

		queryString.stringify({foo: ['']}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]='

		queryString.stringify({foo: [1]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]=1'

		queryString.stringify({foo: [1, 2, 3]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]=1|2|3'

		queryString.stringify({foo: [1, '', 3, null, null, 6]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]=1||3|||6'

		queryString.stringify({foo: [1, '', 3, null, null, 6]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|', skipNull: true});
		//=> 'foo[]=1||3|6'

		queryString.stringify({foo: [1, 2, 3], bar: 'fluffy', baz: [4]}, {arrayFormat: 'bracket-separator', arrayFormatSeparator: '|'});
		//=> 'foo[]=1|2|3&bar=fluffy&baz[]=4'
		```

	- `colon-list-separator`: Serialize arrays with parameter names that are explicitly marked with `:list`:

		```js
		import queryString = require('query-string');

		queryString.stringify({foo: ['one', 'two']}, {arrayFormat: 'colon-list-separator'});
		//=> 'foo:list=one&foo:list=two'
		```

	- `none`: Serialize arrays by using duplicate keys:

		```
		import queryString = require('query-string');

		queryString.stringify({foo: [1, 2, 3]});
		//=> 'foo=1&foo=2&foo=3'
		```
	*/
  readonly arrayFormat?:
    | 'bracket'
    | 'index'
    | 'comma'
    | 'separator'
    | 'bracket-separator'
    | 'colon-list-separator'
    | 'none';

  /**
	The character used to separate array elements when using `{arrayFormat: 'separator'}`.

	@default ,
	*/
  readonly arrayFormatSeparator?: string;

  /**
	Supports both `Function` as a custom sorting function or `false` to disable sorting.

	If omitted, keys are sorted using `Array#sort`, which means, converting them to strings and comparing strings in Unicode code point order.

	@default true

	@example
	```
	import queryString = require('query-string');

	const order = ['c', 'a', 'b'];

	queryString.stringify({a: 1, b: 2, c: 3}, {
		sort: (itemLeft, itemRight) => order.indexOf(itemLeft) - order.indexOf(itemRight)
	});
	//=> 'c=3&a=1&b=2'
	```

	@example
	```
	import queryString = require('query-string');

	queryString.stringify({b: 1, c: 2, a: 3}, {sort: false});
	//=> 'b=1&c=2&a=3'
	```
	*/
  readonly sort?: ((itemLeft: string, itemRight: string) => number) | false;

  /**
	Skip keys with `null` as the value.

	Note that keys with `undefined` as the value are always skipped.

	@default false

	@example
	```
	import queryString = require('query-string');

	queryString.stringify({a: 1, b: undefined, c: null, d: 4}, {
		skipNull: true
	});
	//=> 'a=1&d=4'

	queryString.stringify({a: undefined, b: null}, {
		skipNull: true
	});
	//=> ''
	```
	*/
  readonly skipNull?: boolean;

  /**
	Skip keys with an empty string as the value.

	@default false

	@example
	```
	import queryString = require('query-string');

	queryString.stringify({a: 1, b: '', c: '', d: 4}, {
		skipEmptyString: true
	});
	//=> 'a=1&d=4'
	```

	@example
	```
	import queryString = require('query-string');

	queryString.stringify({a: '', b: ''}, {
		skipEmptyString: true
	});
	//=> ''
	```
	*/
  readonly skipEmptyString?: boolean;
}
export interface CustomFetchConfig extends RequestInit {
  timeout?: number;
  params?: Record<string, any>;
  resourceUrl?: string;
  stringifyOptions?: StringifyOptions;
}

export type CustomFetchFun = (
  url: string, // baseURL
  _config?: CustomFetchConfig,
) => Promise<{ type: 'timeout' } | any>;

const defaultHeaders = {
  Accept: 'text/plain;v=1.0',
  'Content-Type': 'application/json',
};

function formatResponse(response: string) {
  let result;
  try {
    result = JSON.parse(response);
  } catch (e) {
    result = response;
  }
  return result;
}

const fetchFormat = (
  requestConfig: RequestInit & {
    url: string;
    params?: any;
    resourceUrl?: CustomFetchConfig['resourceUrl'];
    stringifyOptions?: StringifyOptions;
  },
) => {
  const { url, signal, params = {}, method = 'GET', headers, resourceUrl, stringifyOptions } = requestConfig;
  let body: RequestInit['body'] = JSON.stringify(params);
  let uri = url;
  const _method = method.toUpperCase();
  if (_method === 'GET' || _method === 'DELETE') {
    uri = Object.keys(params).length > 0 ? `${uri}?${stringify(params, stringifyOptions)}` : uri;
    body = undefined;
  } else {
    if (requestConfig.body) body = requestConfig.body;
  }
  if (resourceUrl !== undefined) {
    uri += `/${resourceUrl}`;
  }
  delete requestConfig.params;

  const myHeaders = new Headers();
  Object.entries({ ...defaultHeaders, ...headers }).forEach(([headerItem, value]) => {
    myHeaders.append(headerItem, value);
  });
  return fetch(uri, {
    ...requestConfig,
    method: _method,
    headers: myHeaders,
    signal,
    body,
  });
};

export const customFetch: CustomFetchFun = (url, _config) => {
  const control = new AbortController();
  const timeout = _config?.timeout ?? DEFAULT_FETCH_TIMEOUT;
  delete _config?.timeout;
  const config: RequestInit & { url: string; params?: any; resourceUrl?: CustomFetchConfig['resourceUrl'] } = {
    ..._config,
    url,
    signal: control.signal,
    credentials: 'omit',
  };

  return Promise.race([fetchFormat(config), timeoutPromise(timeout)]).then(
    (result: any) =>
      new Promise((resolve, reject) => {
        try {
          if (result.type === 'timeout') {
            // Cancel timeout request
            if (control.abort) control.abort();
            reject('Unstable network. Please try again later.');
          } else {
            const _result = result as Response;
            if (_result.status === 401) {
              resolve({ message: 'unauthorized', status: 401 });
            } else {
              _result
                .text()
                .then((text: string) => {
                  const res = formatResponse(text || `${result.url} ${result.status}`);
                  if ((result.status as number).toString()[0] !== '2' || !result.ok) {
                    reject(res ? res : _result.statusText);
                    return;
                  }
                  resolve(res);
                })
                .catch((err: any) => reject(err));
            }
          }
        } catch (e) {
          reject(e);
        }
      }),
  );
};
