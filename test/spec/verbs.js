import { equal } from '@zoroaster/assert'
import Context from '../context'
import Router, { methods } from '../../src'
import { strictEqual } from 'assert'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'registers route specific to HTTP verb'({ app }) {
    const router = new Router()
    app.use(router.routes())
    methods.forEach((method) => {
      method in router
      equal(typeof router[method], 'function')
      router[method]('/', function () {})
    })
    equal(router.stack.length, methods.length)
  },
  async 'registers route with a regexp path'() {
    const router = new Router()
    methods.forEach((method) => {
      const res = router[method](/^\/\w$/i, function () {})
      strictEqual(res, router)
    })
  },
  async 'registers route with a given name'() {
    const router = new Router()
    methods.forEach(function (method) {
      const res = router[method](method, '/', function () {})
      strictEqual(res, router)
    })
  },
  async 'registers route with with a given name and regexp path'() {
    const router = new Router()
    methods.forEach((method) => {
      const res = router[method](method, /^\/$/i, function () {})
      strictEqual(res, router)
    })
  },
  async 'enables route chaining'() {
    const router = new Router()
    methods.forEach((method) => {
      const res = router[method]('/', function () {})
      strictEqual(res, router)
    })
  },
  async 'registers array of paths (gh-203)'() {
    const router = new Router()
    router.get(['/one', '/two'], async (ctx, next) => {
      await next()
    })
    equal(router.stack.length, 2)
    equal(router.stack[0].path, '/one')
    equal(router.stack[1].path, '/two')
  },
  async 'resolves non-parameterized routes without attached parameters'({ startApp }) {
    const router = new Router()

    router.get('/notparameter', (ctx) => {
      ctx.body = {
        param: ctx.params.parameter || 'undefined',
      }
    })

    router.get('/:parameter', (ctx) => {
      ctx.body = {
        param: ctx.params.parameter || 'undefined',
      }
    })

    await startApp(router)
      .get('/notparameter')
      .assert(200, {
        param: 'undefined',
      })
  },
}

export default T