const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName === 'tslib') {
        return context.resolveRequest(
            context,
            path.resolve(__dirname, 'shims/tslib.js'),
            platform,
        );
    }

    if (moduleName === 'react-native-executorch' && platform === 'web') {
        return context.resolveRequest(
            context,
            path.resolve(__dirname, 'shims/react-native-executorch.web.js'),
            platform,
        );
    }

    if (moduleName === 'expo-secure-store' && platform === 'web') {
        return context.resolveRequest(
            context,
            path.resolve(__dirname, 'shims/expo-secure-store.web.js'),
            platform,
        );
    }

    return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });