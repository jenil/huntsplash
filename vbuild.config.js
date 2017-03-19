const path = require('path')
const OfflinePlugin = require('offline-plugin')

// this will copy ./static/** to ./dist/**
module.exports = options => ({
  entry: 'src/index.js',
  filename: {
    js: 'main.js'
  },
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
})
