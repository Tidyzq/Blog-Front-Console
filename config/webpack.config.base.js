const path = require('path')
const webpack = require('webpack')
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const getClientEnvironment = require('./env')
const paths = require('./paths')

const env = getClientEnvironment()

const publicPath = process.env.PUBLIC_PATH

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

const shouldGenerateSourceMap = process.env.GENERATE_SOURCEMAP === 'true'

// In production, we use a plugin to extract that CSS to a file, but
// in development "style" loader enables hot editing of CSS.
const styleLoaderResolver = isProduction ?
  (styleLoader, loaders) => require('extract-text-webpack-plugin').extract({
    use: loaders.filter(Boolean),
    fallback: styleLoader,
  }) :
  (styleLoader, loaders) => [
    styleLoader,
    ...loaders.filter(Boolean),
  ]

// "postcss" loader applies autoprefixer to our CSS.
// "css" loader resolves paths in CSS and adds assets as dependencies.
// "style" loader turns CSS into JS modules that inject <style> tags.
const generateStyleLoader = (loaders = []) => styleLoaderResolver(
  {
    loader: require.resolve('style-loader'),
    options: {
      hmr: isDevelopment,
    },
  },
  ([
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        minimize: isProduction,
        sourcemap: shouldGenerateSourceMap,
        // enable css module
        modules: true,
        localIdentName: '[local]-[hash:base64:5]',
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebookincubator/create-react-app/issues/2677
        ident: 'postcss',
        config: {
          path: paths.appPostCss,
        },
      },
    },
    ...loaders,
  ]).filter(Boolean)
)

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = {
  mode: 'none',
  entry: [ require.resolve('./polyfills'), ...paths.appEntries ],
  output: {
    // The build folder.
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath,
    // Point sourcemap entries to original disk location (format as URL on Windows)
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: [ 'node_modules', paths.appNodeModules ].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    // `web` extension prefixes have been added for better support
    // for React Native Web.
    extensions: [ '.js', '.jsx', '.ts', '.tsx', '.json' ],
    alias: {
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc, [ paths.appPackageJson ]),
      new TsconfigPathsPlugin({ configFile: paths.appTsConfig }),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      // TODO: Disable require.ensure as it's not a standard language feature.
      // We are waiting for https://github.com/facebookincubator/create-react-app/issues/2176.
      // { parser: { requireEnsure: false } },
      {
        // "oneOf" will traverse all following loaders until one will
        // match the requirements. When no loader matches it will fall
        // back to the "file" loader at the end of the loader list.
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
          // Process JS with Babel.
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve('babel-loader'),
            options: {

              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: isDevelopment,
              compact: isProduction,
              babelrc: paths.appBabelConfig,
            },
          },
          // Compile .tsx?
          {
            test: /\.tsx?$/,
            include: paths.appSrc,
            use: {
              loader: require.resolve('ts-loader'),
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
                configFile: paths.appTsConfig,
              },
            },
          },
          // Compile .css to CSS Module
          {
            test: /\.css$/,
            include: paths.appSrc, // only use CSS Module in /src
            use: generateStyleLoader(),
          },
          // Include .css in other directories
          // no need to use Postcss and CSS Module
          {
            test: /\.css$/,
            use: styleLoaderResolver(
              {
                loader: require.resolve('style-loader'),
                options: {
                  hmr: isDevelopment,
                },
              },
              [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: isProduction,
                    sourcemap: shouldGenerateSourceMap,
                  },
                },
              ]
            ),
          },
          // Compile .sass & .scss
          {
            test: /\.s(c|a)ss$/,
            include: paths.appSrc,
            use: generateStyleLoader([
              // loader to resolve relative url import
              {
                loader: require.resolve('resolve-url-loader'),
                options: {
                  sourceMap: shouldGenerateSourceMap,
                },
              },
              {
                loader: require.resolve('sass-loader'),
                options: {
                  // always generate sourcemap  for sass due to resolve-url-loader
                  sourceMap: true,
                },
              },
            ]),
          },
          // compile pug template files for html-webpack-plugin
          {
            test: /\.(jade|pug)$/,
            loader: require.resolve('pug-loader'),
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [ /\.js$/, /\.html$/, /\.json$/ ],
            loader: require.resolve('file-loader'),
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      // ** STOP ** Are you adding a new loader?
      // Make sure to add the new loader(s) before the "file" loader.
    ],
  },
  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In development, this will be an empty string.
    // new InterpolateHtmlPlugin(env.raw),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin(env.stringified),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Perform type checking and linting in a separate process to speed up compilation
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: isDevelopment ? paths.appSrc : undefined,
      tsconfig: paths.appTsConfig,
      tslint: paths.appTsLint,
    }),
    // monaco-editor
    new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs\/language\/typescript\/lib/),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
}
