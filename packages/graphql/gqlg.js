const gqlg = require('gql-generator');
const schemaPath = require('./schemaPath.config');

schemaPath.forEach(({ name, path }) => {
  gqlg({ schemaFilePath: path, destDirPath: `./${name}/__generated__/operation`, fileExtension: 'gql' });
});
