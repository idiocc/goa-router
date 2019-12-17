import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import Router from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof Router, 'function')
  },
  async 'responds to OPTIONS requests'({ startApp }) {
    const router = new Router()
    router.get('/users', () => {})
    router.put('/users', () => {})
    await startApp(router, true)
      .options('/users')
      .assert(200)
      .assert('allow', 'HEAD, GET, PUT')
      .assert('content-length', '0')
  },
  async 'responds with 405 Method Not Allowed'({ startApp }) {
    const router = new Router()
    router.get('/users', function () {})
    router.put('/users', function () {})
    router.post('/events', function () {})
    await startApp(router, true)
      .post('/users', 'hello')
      .assert(405)
      .assert('allow', 'HEAD, GET, PUT')
  },
  async 'responds with 405 Method Not Allowed using the "throw" option'({ startApp }) {
    const router = new Router()
    router.get('/users', function () {})
    router.put('/users', function () {})
    router.post('/events', function () {})
    await startApp(router, { throw: true })
      .post('/users', 'hello')
      .assert(405, 'Method Not Allowed')
      .assert('allow', null)
  },
  async 'responds with user-provided throwable using the "throw" and "methodNotAllowed" options'({ startApp, app }) {
    const router = new Router()
    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        ctx.body = err.body
        ctx.status = err.statusCode
      }
    })
    router.get('/users', function () {})
    router.put('/users', function () {})
    router.post('/events', function () {})

    await startApp(router, {
      throw: true,
      methodNotAllowed() {
        const notAllowedErr = new Error('Custom Not Allowed Error')
        notAllowedErr.type = 'custom'
        notAllowedErr.statusCode = 405
        notAllowedErr.body = {
          error: 'Custom Not Allowed Error',
          statusCode: 405,
          otherStuff: true,
        }
        return notAllowedErr
      },
    })
      .post('/users', 'hello')
      .assert(405, { error: 'Custom Not Allowed Error',
        statusCode: 405,
        otherStuff: true,
      })
      .assert('allow', null)
  },
  async 'responds with 501 Not Implemented'({ startApp }) {
    const router = new Router({
      methods: ['GET'],
    })
    router.get('/users', function () {})
    router.put('/users', function () {})
    await startApp(router, true)
      .post('/users', 'hello')
      .assert(501)
  },
  async 'responds with 501 Not Implemented using the "throw" option'({ startApp }) {
    const router = new Router({ methods: ['GET'] })
    router.get('/users', function () {})
    router.put('/users', function () {})
    await startApp(router, { throw: true })
      .post('/users', 'hello')
      .assert(501, 'Not Implemented')
      .assert('allow', null)
  },
  async 'responds with user-provided throwable using the "throw" and "notImplemented" options'({ startApp, app }) {
    const router = new Router({ methods: ['GET'] })
    app.use(async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        // translate the HTTPError to a normal response
        ctx.body = err.body
        ctx.status = err.statusCode
      }
    })
    router.get('/users', function () {})
    router.put('/users', function () {})
    await startApp(router, {
      throw: true,
      notImplemented() {
        const notImplementedErr = new Error('Custom Not Implemented Error')
        notImplementedErr.type = 'custom'
        notImplementedErr.statusCode = 501
        notImplementedErr.body = {
          error: 'Custom Not Implemented Error',
          statusCode: 501,
          otherStuff: true,
        }
        return notImplementedErr
      },
    })
      .post('/users', 'hello')
      .assert(501, { error: 'Custom Not Implemented Error',
        statusCode: 501,
        otherStuff: true,
      })
      .assert('allow', null)
  },
  async 'does not send 405 if route matched but status is 404'({ startApp }) {
    const router = new Router()
    router.get('/users', (ctx) => {
      ctx.status = 404
    })
    await startApp(router, true)
      .get('/users')
      .assert(404)
  },
  async 'sets the allowed methods to a single Allow header #273'({ startApp }) {
    // https://tools.ietf.org/html/rfc7231#section-7.4.1
    const router = new Router()

    router.get('/', function() {})

    await startApp(router, true)
      .options('/')
      .assert(200)
      .assert('allow', 'HEAD, GET') // ? can't fully test rawHeaders
      // let allowHeaders = res.res.rawHeaders.filter((item) => item == 'Allow')
  },
}

export default T