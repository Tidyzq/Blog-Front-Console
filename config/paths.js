const path = require('path')
const fs = require('fs')

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

// config after eject: we're in ./config/
module.exports = {
  appDirectory,
  appEnvDefault: resolveApp('config/envDefault'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJestConfig: resolveApp('jest.config.js'),
  appBabelConfig: resolveApp('config/babelrc.js'),
  appTsLint: resolveApp('tslint.json'),
  appPostCss: resolveApp('config/postcss.config.js'),
  appProxy: resolveApp('config/proxy.js'),
  appBuild: resolveApp('dist'),
  appAssetsIndex: resolveApp('dist/index.html'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.pug'),
  appEntries: [ resolveApp('src/index.tsx') ],
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
}
