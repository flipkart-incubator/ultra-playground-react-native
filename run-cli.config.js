const blacklist = require('metro-bundler').createBlacklist;

const config = {
    getBlacklistRE() {
        return blacklist([/overrides\/.*/]);
    },
    getTransformModulePath() {
        return require.resolve('react-native-typescript-transformer');
    },
    getSourceExts() {
        return ['ts', 'tsx', 'js', 'jsx'];
    }
};

module.exports = config;
