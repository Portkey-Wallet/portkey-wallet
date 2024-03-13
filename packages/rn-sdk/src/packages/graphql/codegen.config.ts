import { CodegenConfig } from '@graphql-codegen/cli';
import { schemaPath } from './schemaPath.config.js';

const config: CodegenConfig = {
  generates: {},
  config: {
    scalars: {
      Long: 'number',
    },
  },
};

schemaPath.forEach(({ name, path, isCustomExist }) => {
  config.generates[`./${name}/__generated__/types.ts`] = {
    schema: path,
    plugins: ['typescript'],
  };
  config.generates[`${name}/`] = {
    documents: [`./${name}/__generated__/operation/**/*`],
    schema: path,
    preset: 'near-operation-file',
    presetConfig: {
      baseTypesPath: `../${name}/__generated__/types.ts`,
      extension: '.ts',
      folder: `../../hooks`,
    },
    plugins: ['typescript-operations', 'typescript-react-apollo'],
    config: {
      // defaultBaseOptions: {}
    },
  };

  if (isCustomExist) {
    config.generates[`${name}/custom`] = {
      documents: [`./${name}/custom/**/*`],
      schema: path,
      preset: 'near-operation-file',
      presetConfig: {
        baseTypesPath: `../__generated__/types.ts`,
        extension: '.ts',
        folder: `../__generated__/hooks`,
      },
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: {
        // defaultBaseOptions: {}
      },
    };
  }
});

export default config;
