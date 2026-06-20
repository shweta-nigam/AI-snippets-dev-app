const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Redirect outdated requires in react-native-syntax-highlighter to their actual locations in dist/cjs/
  if (moduleName === 'react-syntax-highlighter/prism') {
    return context.resolveRequest(
      context,
      'react-syntax-highlighter/dist/cjs/prism',
      platform
    );
  }
  if (moduleName === 'react-syntax-highlighter/create-element') {
    return context.resolveRequest(
      context,
      'react-syntax-highlighter/dist/cjs/create-element',
      platform
    );
  }
  if (moduleName === 'react-syntax-highlighter/styles/hljs') {
    return context.resolveRequest(
      context,
      'react-syntax-highlighter/dist/cjs/styles/hljs',
      platform
    );
  }
  if (moduleName === 'react-syntax-highlighter/styles/prism') {
    return context.resolveRequest(
      context,
      'react-syntax-highlighter/dist/cjs/styles/prism',
      platform
    );
  }
  if (moduleName.startsWith('react-syntax-highlighter/styles/hljs/')) {
    const styleName = moduleName.replace('react-syntax-highlighter/styles/hljs/', '');
    return context.resolveRequest(
      context,
      `react-syntax-highlighter/dist/cjs/styles/hljs/${styleName}`,
      platform
    );
  }
  if (moduleName.startsWith('react-syntax-highlighter/styles/prism/')) {
    const styleName = moduleName.replace('react-syntax-highlighter/styles/prism/', '');
    return context.resolveRequest(
      context,
      `react-syntax-highlighter/dist/cjs/styles/prism/${styleName}`,
      platform
    );
  }

  // Default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
