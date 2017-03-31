module.exports = options => ({
  entry: {
    options: 'src/options.js',
    client: 'src/index.js'
  },
  filename: {
    js: '[name].js'
  },
  html: [{
    chunks: ['client'],
    filename: 'index.html'
  }, {
    chunks: ['options'],
    filename: 'options.html'
  }],
  hmrEntry: ['client', 'options'],
  vendor: false,
  sourceMap: false,
  port: 3000,
  host: '0.0.0.0',
  env: Object.assign({}, {
    VERSION: require('./static/manifest.json').version,
    UNSPLASH_APP_ID: '',
    PH_KEY: '',
    PH_SECRET: '',
    PH_TOKEN: ''
  }, require('./keys.js'))
});
