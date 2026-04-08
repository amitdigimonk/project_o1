const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Metro config - public/ folder is handled by Expo natively
// No need for .txt asset extension workaround

module.exports = config;