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
const Router = require('koa-router')
const serve = require('koa-static')

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
const router = new Router()

Object.keys(PROXY).forEach(proxyPath => {
  app.use(proxy(proxyPath, {
    target: PROXY[proxyPath].target,
    changeOrigin: true,
  }))
})

const mount = middleware => koaMount(PUBLIC_PATH, middleware)

const serveAssets = serve(paths.appBuild)

router.get('*', ctx => {
  ctx.body = fs.createReadStream(paths.appAssetsIndex)
})

app
  .use(mount(serveAssets))
  .use(mount(router.routes()))
  .use(mount(router.allowedMethods()))

app.listen(PORT, HOST, err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`> Listening at ${HOST}:${PORT}`)
})
