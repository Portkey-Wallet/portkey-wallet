const npmCommand = process.env.npm_config_argv;
const commandOriginal = npmCommand && JSON.parse(process.env.npm_config_argv).original;
console.log('npmCommand', npmCommand);
console.log('commandOriginal', commandOriginal);
console.log('commandOriginal length', commandOriginal ? commandOriginal.length : 0);
if (!commandOriginal || commandOriginal.length === 0) {
  console.log('no install');
  return;
} else {
  console.log('install config file');
  //eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require('path');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require('fs');
  // native-dependencies.js path
  const nativeDependenciesPath = path.resolve(__dirname, '../native-dependencies.js');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageName = require(path.resolve(__dirname, '../package.json')).name;
  console.log('process.cwd()process.cwd()', process.cwd());
  let projectRoot;
  try {
    const reactNativePath = require.resolve('react');
    projectRoot = path.resolve(reactNativePath, '../../..');
  } catch (e) {
    console.warn('no react!');
  }
  if (!projectRoot) {
    let currentDir = __dirname;
    while (currentDir !== '/') {
      if (fs.existsSync(path.join(currentDir, 'node_modules'))) {
        break;
      }
      currentDir = path.dirname(currentDir);
    }
    projectRoot = currentDir;
  }
  // check projectRoot is valid
  const rootPackage = path.resolve(projectRoot, 'package.json');
  if (fs.existsSync(rootPackage)) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { dependencies } = require(`${projectRoot}/package.json`);
    if (!dependencies[packageName]) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nativeDependencies = require(nativeDependenciesPath);
      let chalk;
      import('chalk')
        .then(module => {
          chalk = module.default;
          console.warn(chalk.red.bold('Auto configuration dependencies fail! '));
          console.warn(
            chalk.red.bold(`The manual configuration steps are as follows:\n1. Create a ${chalk.yellow.bold(
              'react-native.config.js',
            )} file in the project root directory\n2. Copy the content of ${chalk.green.bold(
              `module.exports = ${JSON.stringify(nativeDependencies)}`,
            )} to the ${chalk.yellow.bold('react-native.config.js')} file
        `),
          );
        })
        .catch(() => {
          console.warn('Auto configuration dependencies fail! ');
          console.warn(`The manual configuration steps are as follows:\n1. Create a react-native.config.js file in the project root directory\n2. Copy the content of
            module.exports = ${JSON.stringify(nativeDependencies)} to the react-native.config.js file`);
        });
      return;
    }
  }

  console.log(`Project root: ${projectRoot}`);

  // react-native.config.js path
  const configPath = path.resolve(projectRoot, 'react-native.config.js');
  // require native-dependencies.js
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nativeDependencies = require(nativeDependenciesPath);
  // check react-native.config.js exist
  if (!fs.existsSync(configPath)) {
    console.log('react-native.config.js absent');
    fs.mkdirSync(path.dirname(configPath), { recursive: true });
    // create react-native.config.js file，and load the dependencies value of native-dependencies.js  file  to the new file()
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(nativeDependencies, null, 2)};`);
  } else {
    console.log('react-native.config.js exist');
    // merge the dependencies value of native-dependencies.js  file to the new file!
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require(configPath);
    // no dependencies value, add firstly
    if (!Object.prototype.hasOwnProperty.call(config, 'dependencies')) {
      config.dependencies = {};
    }
    // append the dependencies value
    for (const [key, value] of Object.entries(nativeDependencies.dependencies)) {
      if (!Object.prototype.hasOwnProperty.call(config.dependencies, key)) {
        config.dependencies[key] = value;
      }
    }

    // save react-native.config.js
    fs.writeFileSync(configPath, `module.exports = ${JSON.stringify(config, null, 2)};`);
  }
}
