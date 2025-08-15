// Metro configuration for React Native
// Adds support for bundling .onnx model files as static assets

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push('onnx');

module.exports = config;

