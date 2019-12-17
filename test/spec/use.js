import { equal } from '@zoroaster/assert'
import Context from '../context'
import Router from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async'uses router middleware without path'({ startApp }) {
    const router = new Router()

    router.use(async (ctx, next) => {
      ctx.foo = 'baz'
      await next()
    })

    router.use(async (ctx, next) => {
      ctx.foo = 'foo'
      await next()
    })

    router.get('/foo/bar', (ctx) => {
      ctx.body = {
        foobar: ctx.foo + 'bar',
      }
    })

    await startApp(router)
      .get('/foo/bar')
      .assert(200, { foobar: 'foobar' })
  },
  async'uses router middleware at given path'({ startApp }) {
    const router = new Router()

    router.use('/foo/bar', (ctx, next) => {
      ctx.foo = 'foo'
      return next()
    })

    router.get('/foo/bar', function (ctx) {
      ctx.body = {
        foobar: ctx.foo + 'bar',
      }
    })

    await startApp(router)
      .get('/foo/bar')
      .assert(200, { foobar: 'foobar' })
  },

  async'runs router middleware before subrouter middleware'({ startApp }) {
    const router = new Router()
    const subrouter = new Router()

    router.use((ctx, next) => {
      ctx.foo = 'boo'
      return next()
    })

    subrouter
      .use((ctx, next) => {
        ctx.foo = 'foo'
        return next()
      })
      .get('/bar', function (ctx) {
        ctx.body = {
          foobar: ctx.foo + 'bar',
        }
      })

    router.use('/foo', subrouter.routes())
    await startApp(router)
      .get('/foo/bar')
      .assert(200, { foobar: 'foobar' })
  },
  async'assigns middleware to array of paths'({ startApp }) {
    const router = new Router()

    router.use(['/foo', '/bar'], (ctx, next) => {
      ctx.foo = 'foo'
      ctx.bar = 'bar'
      return next()
    })

    router.get('/foo', (ctx) => {
      ctx.body = {
        foobar: ctx.foo + 'bar',
      }
    })

    router.get('/bar', function (ctx) {
      ctx.body = {
        foobar: 'foo' + ctx.bar,
      }
    })

    await startApp(router)
      .get('/foo')
      .assert(200, { foobar: 'foobar' })
      .get('/bar')
      .assert(200, { foobar: 'foobar' })
  },
  async'without path, does not set params.0 to the matched path - gh-247'({ startApp }) {
    const router = new Router()

    router.use(function(ctx, next) {
      return next()
    })

    router.get('/foo/:id', function(ctx) {
      ctx.body = ctx.params
    })

    await startApp(router)
      .get('/foo/815')
      .assert(200, { id: '815' })
  },
  async'does not add an erroneous (.*) to unprefiexed nested routers - gh-369 gh-410'({ startApp }) {
    const router = new Router()
    const nested = new Router()
    let called = 0

    nested
      .get('/', (ctx, next) => {
        ctx.body = 'root'
        called += 1
        return next()
      })
      .get('/test', (ctx, next) => {
        ctx.body = 'test'
        called += 1
        return next()
      })

    router.use(nested.routes())

    await startApp(router)
      .get('/test')
      .assert(200, 'test')
    equal(called, 1, 'too many routes matched')
  },
}

export default T