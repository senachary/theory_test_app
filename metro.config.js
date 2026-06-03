const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// NativeWind v4: CSS processing is handled via the Babel plugin.
// The withNativeWind/withCssInterop metro wrappers are incompatible with
// Expo 56 / Metro 0.84 due to async transformer init timing.
// CSS-in-JS className props are transformed at compile time by the Babel plugin.
config.resolver.sourceExts = [...config.resolver.sourceExts, 'css'];

module.exports = config;
