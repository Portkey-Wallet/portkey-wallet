const gqlg = require('gql-generator');
import { schemaPath } from './schemaPath.config.js';

schemaPath.forEach(({ name, path }) => {
  gqlg({ schemaFilePath: path, destDirPath: `./${name}/__generated__/operation`, fileExtension: 'gql' });
});
