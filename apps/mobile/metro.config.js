const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot, ...(config.watchFolders || [])];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  'react':            path.resolve(projectRoot, 'node_modules/react'),
  'react-dom':        path.resolve(projectRoot, 'node_modules/react-dom'),
  'react-native':     path.resolve(projectRoot, 'node_modules/react-native'),
  'react-native-web': path.resolve(projectRoot, 'node_modules/react-native-web'),
  '@mathgraph/core':  path.resolve(monorepoRoot, 'packages/core'),
};

// Block root-level react and react-native from ever being bundled
config.resolver.blockList = [
  new RegExp(
    `${monorepoRoot.replace(/\\/g, '\\\\')}\\\\node_modules\\\\react\\\\.*`
  ),
  new RegExp(
    `${monorepoRoot.replace(/\\/g, '\\\\')}\\\\node_modules\\\\react-native\\\\.*`
  ),
];

module.exports = config;