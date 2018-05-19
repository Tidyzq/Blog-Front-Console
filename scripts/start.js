process.env.NODE_ENV = 'production'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err
})

// Ensure environment variables are read.
require('../config/env')

const fs = require('fs')
const Koa = require('koa')
const proxy = require('koa-proxies')
const koaMount = require('koa-mount')
const serve = require('koa-static')
const historyFallback = require('koa2-history-api-fallback')

const paths = require('../config/paths')

// const useYarn = fs.existsSync(paths.yarnLockFile)

// Warn and crash if required files are missing
if (!fs.existsSync(paths.appAssetsIndex)) {
  process.exit(1)
}

const parseJSON = json => {
  try {
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

const PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || '0.0.0.0'
const PUBLIC_PATH = process.env.PUBLIC_PATH || '/'
const PROXY = parseJSON(process.env.PROXY) || {}

const app = new Koa()

Object.keys(PROXY).forEach(proxyPath => {
  app.use(proxy(proxyPath, {
    target: PROXY[proxyPath].target,
    changeOrigin: true,
  }))
})

const mount = middleware => koaMount(PUBLIC_PATH, middleware)

const serveAssets = serve(paths.appBuild)

app
  .use(historyFallback({
    index: PUBLIC_PATH + 'index.html',
  }))
  .use(mount(serveAssets))

app.listen(PORT, HOST, err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`> Listening at ${HOST}:${PORT}`)
})
