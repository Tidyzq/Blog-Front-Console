module.exports = {
  presets: [
    'react-app',
  ],
  plugins: [
    [
      'import',
      [
        {
          libraryName: 'antd',
        },
        {
          libraryName: 'lodash',
          libraryDirectory: '',
          camel2DashComponentName: false,
          camel2UnderlineComponentName: false,
        },
        {
          libraryName: 'lodash-decorators',
          libraryDirectory: '',
        },
      ],
    ],
  ],
}
