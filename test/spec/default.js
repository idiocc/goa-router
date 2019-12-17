import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import Router from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof Router, 'function')
  },
  async 'shares context between routers'({ startApp, app }) {
    const router1 = new Router()
    const router2 = new Router()

    router1.get('/', (ctx, next) => {
      ctx.foo = 'bar'
      return next()
    })
    router2.get('/', (ctx, next) => {
      ctx.baz = 'qux'
      ctx.body = { foo: ctx.foo }
      return next()
    })

    const mw1 = router1.routes()
    const mw2 = router2.routes()
    app.use(mw1).use(mw2)

    await startApp()
      .get('/')
      .assert(200, { foo: 'bar' })
  },
  async 'does not register middleware more than once'({ startApp }) {
    const parentRouter = new Router()
    const nestedRouter = new Router()

    nestedRouter
      .get('/first-nested-route', (ctx) => {
        ctx.body = { n: ctx.n }
      })
      .get('/second-nested-route', async (ctx, next) => {
        await next()
      })
      .get('/third-nested-route', async (ctx, next) => {
        await next()
      })

    parentRouter.use('/parent-route', (ctx, next) => {
      ctx.n = ctx.n ? (ctx.n + 1) : 1
      return next()
    }, nestedRouter.routes())

    await startApp(parentRouter)
      .get('/parent-route/first-nested-route')
      .assert(200, { n: 1 })
  },
  async 'router can be accecced with ctx'({ startApp }) {
    const router = new Router()
    router.get('home', '/', (ctx) => {
      ctx.body = {
        url: ctx.router.url('home'),
      }
    })
    await startApp(router)
      .get('/')
      .assert(200, { url: '/' })
  },
  async 'registers multiple middleware for one route'({ startApp }) {
    const router = new Router()

    router.get('/double', async (ctx, next) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          ctx.body = { message: 'Hello' }
          resolve()
        }, 1)
      })
      await next()
    }, async (ctx, next) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          ctx.body.message += ' World'
          resolve()
        }, 1)
      })
      await next()
    }, (ctx) => {
      ctx.body.message += '!'
    })

    await startApp(router)
      .get('/double')
      .assert(200, { message: 'Hello World!' })
  },
  async 'does not break when nested-routes use regexp paths'({ startApp }) {
    const parentRouter = new Router()
    const nestedRouter = new Router()

    nestedRouter
      .get(/\w/, async (ctx, next) => {
        ctx.body = { regex: 1 }
        await next()
      })
      .get('/first-nested-route', async (ctx, next) => {
        await next()
      })
      .get('/second-nested-route', async (ctx, next) => {
        await next()
      })

    parentRouter.use('/parent-route', async (ctx, next) => {
      await next()
    }, nestedRouter.routes())

    // check nested routes with regexes after updating path-to-regexp to 6
    await startApp(parentRouter)
      .get('/parent-route/w/')
      .assert(200, { regex: 1 })
  },
  'exposes middleware factory'() {
    const router = new Router()
    ok(typeof router.routes == 'function')
    const middleware = router.routes()
    ok(typeof middleware == 'function')
  },
  async 'supports promises for async/await'({ startApp, app }) {
    const router = new Router()
    router.get('/async', async (ctx) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          ctx.body = {
            msg: 'promises!',
          }
          resolve()
        }, 1)
      })
    })
    app.use(router.routes()).use(router.allowedMethods())
    await startApp()
      .get('/async')
      .assert(200, { msg: 'promises!' })
  },
  async 'matches middleware only if route was matched (gh-182)'({ startApp, app }) {
    const router = new Router()
    const otherRouter = new Router()

    router.use((ctx, next) => {
      ctx.body = { bar: 'baz' }
      return next()
    })

    otherRouter.get('/bar', function (ctx) {
      ctx.body = ctx.body || { foo: 'bar' }
    })

    app.use(router.routes()).use(otherRouter.routes())

    await startApp()
      .get('/bar')
      .assert(200, { foo: 'bar' })
  },
  async 'matches first to last'({ startApp, app }) {
    const router = new Router()

    router
      .get('user_page', '/user/(.*).jsx', (ctx) => {
        ctx.body = { order: 1 }
      })
      .all('app', '/app/(.*).jsx', (ctx) => {
        ctx.body = { order: 2 }
      })
      .all('view', '(.*).jsx', (ctx) => {
        ctx.body = { order: 3 }
      })

    app.use(router.routes())
    await startApp()
      .get('/user/account.jsx')
      .assert(200, { order: 1 })
  },
  async 'does not run subsequent middleware without calling next'({ startApp }) {
    const router = new Router()

    router
      .get('user_page', '/user/(.*).jsx', () => {
        // no next()
      }, (ctx) => {
        ctx.body = { order: 1 }
      })

    await startApp(router)
      .get('/user/account.jsx')
      .assert(404)
  },
  async 'nests routers with prefixes at root'({ startApp }) {
    const forums = new Router({
      prefix: '/forums',
    })
    const posts = new Router({
      prefix: '/:fid/posts',
    })

    posts
      .get('/', async (ctx, next) => {
        ctx.status = 204
        await next()
      })
      .get('/:pid', async (ctx, next) => {
        ctx.body = ctx.params
        await next()
      })

    forums.use(posts.routes())

    await startApp(forums)
      .get('/forums/1/posts')
      .assert(204)
      .get('/forums/1')
      .assert(404)
      .get('/forums/1/posts/2')
      .assert(200, { fid: '1', pid: '2' })
  },
  async 'nests routers with prefixes at path'({ startApp }) {
    const forums = new Router({
      prefix: '/api',
    })
    const posts = new Router({
      prefix: '/posts',
    })

    posts
      .get('/', (ctx, next) => {
        ctx.status = 204
        return next()
      })
      .get('/:pid', (ctx, next) => {
        ctx.body = ctx.params
        return next()
      })

    forums.use('/forums/:fid', posts.routes())

    await startApp(forums)
      .get('/api/forums/1/posts')
      .assert(204)
      .get('/api/forums/1')
      .assert(404)
      .get('/api/forums/1/posts/2')
      .assert(200, { fid: '1', pid: '2' })
  },
  async 'runs subrouter middleware after parent'({ startApp }) {
    const subrouter = new Router()
      .use(async (ctx, next) => {
        ctx.msg = 'subrouter'
        await next()
      })
      .get('/', (ctx) => {
        ctx.body = { msg: ctx.msg }
      })
    const router = new Router()
      .use(async (ctx, next) => {
        ctx.msg = 'router'
        await next()
      })
      .use(subrouter.routes())
    await startApp(router)
      .get('/')
      .assert(200, { msg: 'subrouter' })
  },
  async 'runs parent middleware for subrouter routes'({ startApp }) {
    const subrouter = new Router()
      .get('/sub', (ctx) => {
        ctx.body = { msg: ctx.msg }
      })
    const router = new Router()
      .use(async (ctx, next) => {
        ctx.msg = 'router'
        await next()
      })
      .use('/parent', subrouter.routes())
    await startApp(router)
      .get('/parent/sub')
      .assert(200, { msg: 'router' })
  },
  async 'matches corresponding requests'({ startApp }) {
    const router = new Router()
    router.get('/:category/:title', (ctx) => {
      ctx.body = ctx.params
    })
      .post('/:category', (ctx) => {
        ctx.body = ctx.params
      })
      .put('/:category/not-a-title', (ctx) => {
        ctx.body = ctx.params
      })

    await startApp(router)
      .get('/programming/how-to-node')
      .assert(200, {
        category: 'programming',
        title: 'how-to-node',
      })
      .post('/programming', 'hello')
      .assert(200, {
        category: 'programming',
      })
      .put('/programming/not-a-title')
      .assert(200, {
        category: 'programming',
      })
  },
  async 'executes route middleware using `app.context`'({ startApp }) {
    const router = new Router()
    router.use(async (ctx, next) => {
      ctx.bar = 'baz'
      await next()
    })
    router.get('/:category/:title', async (ctx, next) => {
      ctx.foo = 'bar'
      await next()
    }, (ctx) => {
      ok(ctx.app)
      ok(ctx.req)
      ok(ctx.res)
      const { foo, bar } = ctx
      ctx.body = { foo, bar }
    })
    await startApp(router)
      .get('/match/this')
      .assert(200, { foo: 'bar', bar: 'baz' })
  },
  async 'does not match after ctx.throw()'({ startApp }) {
    let counter = 0
    const router = new Router()
    router.get('/', (ctx) => {
      counter++
      ctx.throw(403)
    })
    router.get('/', () => {
      counter++
    })
    await startApp(router)
      .get('/')
      .assert(403)
    equal(counter, 1)
  },
  async 'supports promises for route middleware'({ startApp }) {
    const router = new Router()
    router
      .get('/', async (ctx, next) => {
        await next()
      }, async (ctx) => {
        await new Promise(r => setTimeout(r, 5))
        ctx.status = 204
      })
    await startApp(router)
      .get('/')
      .assert(204)
  },
  async 'supports custom routing detect path: ctx.routerPath'({ startApp, app }) {
    const router = new Router()
    app.use(async (ctx, next) => {
      // bind helloworld.example.com/users => example.com/helloworld/users
      const [appname] = ctx.request.hostname.split('.', 1)
      ctx.routerPath = `/${appname}${ctx.path}`
      await next()
    })
    router.get('/helloworld/users', (ctx) => {
      ctx.body = ctx.method + ' ' + ctx.url
    })

    await startApp(router)
      .set('Host', 'helloworld.example.com')
      .get('/users')
      .assert(200, 'GET /users')
  },
}

export default T
