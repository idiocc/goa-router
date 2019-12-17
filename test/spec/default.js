import { equal, ok } from '@zoroaster/assert'
import Context from '../context'
import Router from '../../src'

/** @type {TestSuite} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof Router, 'function')
  },
  async'shares context between routers'({ startApp, app }) {
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
  async'does not register middleware more than once'({ startApp }) {
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
  async'router can be accecced with ctx'({ startApp }) {
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
  async'registers multiple middleware for one route'({ startApp }) {
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
  async'does not break when nested-routes use regexp paths'({ startApp }) {
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
  async'supports promises for async/await'({ startApp, app }) {
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
  async'matches middleware only if route was matched (gh-182)'({ startApp, app }) {
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
  async'matches first to last'({ startApp, app }) {
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
  async'does not run subsequent middleware without calling next'({ startApp }) {
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
  async'nests routers with prefixes at root'({ startApp }) {
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
  async'nests routers with prefixes at path'({ startApp }) {
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
  async'runs subrouter middleware after parent'({ startApp }) {
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
  async'runs parent middleware for subrouter routes'({ startApp }) {
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
  async'matches corresponding requests'({ startApp }) {
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
  async'executes route middleware using `app.context`'({ startApp }) {
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
  async'does not match after ctx.throw()'({ startApp }) {
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
  async'supports promises for route middleware'({ startApp }) {
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
  async'supports custom routing detect path: ctx.routerPath'({ startApp, app }) {
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
  register: {
    async'registers new routes'({ app }) {
      const router = new Router()
      const { register } = router
      equal(typeof register, 'function')
      router.register('/', ['GET', 'POST'], function () {})
      app.use(router.routes())
      equal(router.stack.length, 1)
      equal(router.stack[0].path, '/')
    },
  },
  redirect: {
    async'registers redirect routes'({ app }) {
      const router = new Router()
      const { redirect } = router
      equal(typeof redirect, 'function')
      router.redirect('/source', '/destination', 302)
      app.use(router.routes())
      equal(router.stack.length, 1)
      equal(router.stack[0].path, '/source')
    },
    async'redirects using route names'({ startApp }) {
      const router = new Router()
      router.get('home', '/', function () {})
      router.get('sign-up-form', '/sign-up-form', function () {})
      router.redirect('home', 'sign-up-form')
      await startApp(router)
        .post('/', 'data')
        .assert(301)
        .assert('location', '/sign-up-form')
    },
  },
  route: {
    async'inherits routes from nested router'() {
      const subrouter = new Router().get('child', '/hello', function (ctx) {
        ctx.body = { hello: 'world' }
      })
      const router = new Router().use(subrouter.routes())
      equal(router.route('child').name, 'child')
    },
  },
  url: {
    async'generates URL for given route name'() {
      const router = new Router()
      router.get('books', '/:category/:title', (ctx) => {
        ctx.status = 204
      })
      let url = router.url('books', { category: 'programming', title: 'how to node' })
      equal(url, '/programming/how%20to%20node')
      url = router.url('books', 'programming', 'how to node')
      equal(url, '/programming/how%20to%20node')
    },

    async'generates URL for given route name within embedded routers'() {
      const router = new Router({
        prefix: "/books",
      })

      const embeddedRouter = new Router({
        prefix: "/chapters",
      })
      embeddedRouter.get('chapters', '/:chapterName/:pageNumber', function (ctx) {
        ctx.status = 204
      })
      router.use(embeddedRouter.routes())
      let url = router.url('chapters', { chapterName: 'Learning ECMA6', pageNumber: 123 })
      equal(url, '/books/chapters/Learning%20ECMA6/123')
      url = router.url('chapters', 'Learning ECMA6', 123)
      equal(url, '/books/chapters/Learning%20ECMA6/123')
    },

    async'generates URL for given route name within two embedded routers'() {
      const router = new Router({
        prefix: "/books",
      })
      const embeddedRouter = new Router({
        prefix: "/chapters",
      })
      const embeddedRouter2 = new Router({
        prefix: "/:chapterName/pages",
      })
      embeddedRouter2.get('chapters', '/:pageNumber', (ctx) => {
        ctx.status = 204
      })
      embeddedRouter.use(embeddedRouter2.routes())
      router.use(embeddedRouter.routes())
      const url = router.url('chapters', { chapterName: 'Learning ECMA6', pageNumber: 123 })
      equal(url, '/books/chapters/Learning%20ECMA6/pages/123')
    },

    async'generates URL for given route name with params and query params'() {
      const router = new Router()
      router.get('books', '/books/:category/:id', function (ctx) {
        ctx.status = 204
      })
      let url = router.url('books', 'programming', 4, {
        query: { page: 3, limit: 10 },
      })
      equal(url, '/books/programming/4?page=3&limit=10')
      url = router.url('books',
        { category: 'programming', id: 4 },
        { query: { page: 3, limit: 10 } }
      )
      equal(url, '/books/programming/4?page=3&limit=10')
      url = router.url('books',
        { category: 'programming', id: 4 },
        { query: 'page=3&limit=10' }
      )
      equal(url, '/books/programming/4?page=3&limit=10')
    },
    async'generates URL for given route name without params and query params'() {
      const router = new Router()
      router.get('category', '/category', function (ctx) {
        ctx.status = 204
      })
      const url = router.url('category', {
        query: { page: 3, limit: 10 },
      })
      equal(url, '/category?page=3&limit=10')
    },
  },
  param: {
    async'runs parameter middleware'({ startApp }) {
      const router = new Router()
      router
        .param('user', function (id, ctx, next) {
          ctx.user = { name: 'alex' }
          if (!id) return ctx.status = 404
          return next()
        })
        .get('/users/:user', (ctx) => {
          ctx.body = ctx.user
        })
      await startApp(router)
        .get('/users/3')
        .assert(200, { name: 'alex' })
    },
    async'runs parameter middleware in order of URL appearance'({ startApp }) {
      const router = new Router()
      router
        .param('user', function (id, ctx, next) {
          ctx.user = { name: 'alex' }
          if (ctx.ranFirst) {
            ctx.user.ordered = 'parameters'
          }
          if (!id) return ctx.status = 404
          return next()
        })
        .param('first', function (id, ctx, next) {
          ctx.ranFirst = true
          if (ctx.user) {
            ctx.ranFirst = false
          }
          if (!id) return ctx.status = 404
          return next()
        })
        .get('/:first/users/:user', function (ctx) {
          ctx.body = ctx.user
        })

      await startApp(router)
        .get('/first/users/3')
        .assert(200, { name: 'alex', ordered: 'parameters' })
    },
    async'runs parameter middleware in order of URL appearance even when added in random order'({ startApp }) {
      const router = new Router()
      router
        // intentional random order
        .param('a', function (id, ctx, next) {
          ctx.state.loaded = [ id ]
          return next()
        })
        .param('d', function (id, ctx, next) {
          ctx.state.loaded.push(id)
          return next()
        })
        .param('c', function (id, ctx, next) {
          ctx.state.loaded.push(id)
          return next()
        })
        .param('b', function (id, ctx, next) {
          ctx.state.loaded.push(id)
          return next()
        })
        .get('/:a/:b/:c/:d', (ctx) => {
          ctx.body = ctx.state.loaded
        })

      await startApp(router)
        .get('/1/2/3/4')
        .assert(200, ['1', '2', '3', '4'])
    },
    async'runs parent parameter middleware for subrouter'({ startApp }) {
      const router = new Router()
      const subrouter = new Router()
      subrouter.get('/:cid', function (ctx) {
        ctx.body = {
          id: ctx.params.id,
          cid: ctx.params.cid,
        }
      })
      router
        .param('id', function (id, ctx, next) {
          ctx.params.id = 'ran'
          if (!id) return ctx.status = 404
          return next()
        })
        .use('/:id/children', subrouter.routes())

      await startApp(router)
        .get('/did-not-run/children/2')
        .assert(200, { id: 'ran', cid: '2' })
    },
  },
  opts: {
    async'responds with 200'({ startApp }) {
      const router = new Router({
        strict: true,
      })
      router.get('/info', function (ctx) {
        ctx.body = 'hello'
      })
      await startApp(router)
        .get('/info')
        .assert(200, 'hello')
    },
    async'should allow setting a prefix'({ startApp }) {
      const router = new Router({ prefix: '/things/:thing_id' })

      router.get('/list', function (ctx) {
        ctx.body = ctx.params
      })

      await startApp(router)
        .get('/things/1/list')
        .assert(200, { thing_id: '1' })
    },
    async'responds with 404 when has a trailing slash'({ startApp }) {
      const router = new Router({
        strict: true,
      })
      router.get('/info', function (ctx) {
        ctx.body = 'hello'
      })
      await startApp(router)
        .get('/info/')
        .assert(404)
    },
  },
  'use middleware with opts': {
    async'responds with 200'({ startApp }) {
      const router = new Router({
        strict: true,
      })
      router.get('/info', function (ctx) {
        ctx.body = 'hello'
      })
      await startApp(router)
        .get('/info')
        .assert(200, 'hello')
    },
    async'responds with 404 when has a trailing slash'({ startApp }) {
      const router = new Router({
        strict: true,
      })
      router.get('/info', function (ctx) {
        ctx.body = 'hello'
      })
      await startApp(router)
        .get('/info/')
        .assert(404)
    },
  },
  routes: {
    async'should return composed middleware'({ startApp }) {
      const router = new Router()
      let middlewareCount = 0
      const middlewareA = (ctx, next) => {
        middlewareCount++
        return next()
      }
      const middlewareB = (ctx, next) => {
        middlewareCount++
        return next()
      }

      router.use(middlewareA, middlewareB)
      router.get('/users/:id', function (ctx) {
        ok(ctx.params.id)
        ctx.body = { hello: 'world' }
      })

      await startApp(router)
        .get('/users/1')
        .assert(200, { hello: 'world' })
      equal(middlewareCount, 2)
    },
    async'places a `_matchedRoute` value on context'({ startApp }) {
      const router = new Router()
      const middleware = (ctx, next) => {
        equal(ctx._matchedRoute, '/users/:id')
        return next()
      }
      router.use(middleware)

      router.get('/users/:id', (ctx) => {
        equal(ctx._matchedRoute, '/users/:id')
        ok(ctx.params.id)
        ctx.body = { hello: 'world' }
      })


      await startApp(router)
        .get('/users/1')
        .assert(200)
    },
    async'places a `_matchedRouteName` value on the context for a named route'({ startApp }) {
      const router = new Router()

      router.get('users#show', '/users/:id', (ctx) => {
        equal(ctx._matchedRouteName, 'users#show')
        ctx.status = 200
      })

      await startApp(router)
        .get('/users/1')
        .assert(200)
    },
    async'does not place a `_matchedRouteName` value on the context for unnamed routes'({ startApp }) {
      const router = new Router()

      router.get('/users/:id', (ctx) => {
        equal(ctx._matchedRouteName, undefined)
        ctx.status = 200
      })

      await startApp(router)
        .get('/users/1')
        .assert(200)
    },
  },
  'If no HEAD method, default to GET': {
    async'should default to GET'({ startApp }) {
      const router = new Router()
      router.get('/users/:id', function (ctx) {
        ok(ctx.params.id)
        ctx.body = 'hello'
      })
      await startApp(router)
        .head('/users/1')
        .assert(200, '')
    },
    async'should work with middleware'({ startApp }) {
      const router = new Router()
      router.get('/users/:id', function (ctx) {
        ok(ctx.params.id)
        ctx.body = 'hello'
      })
      await startApp(router)
        .head('/users/1')
        .assert(200, '')
    },
  },
  prefix: {
    async'should set opts.prefix'() {
      const router = new Router()
      ok(!('prefix' in router.opts))
      router.prefix('/things/:thing_id')
      equal(router.opts.prefix, '/things/:thing_id')
    },
    async'should prefix existing routes'() {
      const router = new Router()
      router.get('/users/:id', function (ctx) {
        ctx.body = 'test'
      })
      router.prefix('/things/:thing_id')
      const route = router.stack[0]
      equal(route.path, '/things/:thing_id/users/:id')
      equal(route.paramNames.length, 2)
      equal(route.paramNames[0].name, 'thing_id')
      equal(route.paramNames[1].name, 'id')
    },
  },
  'when used with .use(fn) - gh-247': {
    async'does not set params.0 to the matched path'({ startApp }) {
      const router = new Router()

      router.use((ctx, next) => {
        return next()
      })

      router.get('/foo/:id', (ctx) => {
        ctx.body = ctx.params
      })

      router.prefix('/things')

      await startApp(router)
        .get('/things/foo/108')
        .assert(200, { id: '108' })
    },
  },
  'Static Router#url()': {
    async'generates route URL'() {
      const url = Router.url('/:category/:title', { category: 'programming', title: 'how-to-node' })
      equal(url, '/programming/how-to-node')
    },
    async'escapes using encodeURIComponent()'() {
      const url = Router.url('/:category/:title', { category: 'programming', title: 'how to node' })
      equal(url, '/programming/how%20to%20node')
    },
    async'generates route URL with params and query params'() {
      let url = Router.url('/books/:category/:id', 'programming', 4, {
        query: { page: 3, limit: 10 },
      })
      equal(url, '/books/programming/4?page=3&limit=10')
      url = Router.url('/books/:category/:id',
        { category: 'programming', id: 4 },
        { query: { page: 3, limit: 10 } }
      )
      equal(url, '/books/programming/4?page=3&limit=10')
      url = Router.url('/books/:category/:id',
        { category: 'programming', id: 4 },
        { query: 'page=3&limit=10' }
      )
      equal(url, '/books/programming/4?page=3&limit=10')
    },
    async'generates router URL without params and with with query params'() {
      const url = Router.url('/category', {
        query: { page: 3, limit: 10 },
      })
      equal(url, '/category?page=3&limit=10')
    },
  },
  'with trailing slash': {
    context: class extends Context {
      get prefix() {
        return '/admin/'
      }
    },
    async'should support root level router middleware'({ startApp, makeRouter, prefix, assertCount }) {
      await startApp(makeRouter(prefix))
        .get(prefix)
        .assert(200, { name: 'worked' })
      assertCount(2)
    },
    async'should support requests with a trailing path slash'({ startApp, makeRouter, prefix, assertCount }) {
      await startApp(makeRouter(prefix))
        .get('/admin/')
        .assert(200, { name: 'worked' })
      assertCount(2)
    },
    async'should support requests without a trailing path slash'({ startApp, makeRouter, prefix, assertCount }) {
      await startApp(makeRouter(prefix))
        .get('/admin')
        .assert(200, { name: 'worked' })
      assertCount(2)
    },
  },
  'without trailing slash': {
    context: class extends Context {
      get prefix() {
        return '/admin'
      }
    },
    async'should support root level router middleware'({ startApp, makeRouter, prefix, assertCount }) {
      await startApp(makeRouter(prefix))
        .get(prefix)
        .assert(200, { name: 'worked' })
      assertCount(2)
    },
    async'should support requests with a trailing path slash'({ startApp, makeRouter, prefix, assertCount }) {
      await startApp(makeRouter(prefix))
        .get('/admin/')
        .assert(200, { name: 'worked' })
      assertCount(2)
    },
    async'should support requests without a trailing path slash'({ startApp, makeRouter, prefix, assertCount }) {
      await startApp(makeRouter(prefix))
        .get('/admin')
        .assert(200, { name: 'worked' })
      assertCount(2)
    },
  },
}

export default T


/** @typedef {Object<string, Test & TestSuite4>} TestSuite */
/** @typedef {Object<string, Test & TestSuite3>} TestSuite4 */
/** @typedef {Object<string, Test & TestSuite2>} TestSuite3 */
/** @typedef {Object<string, Test & TestSuite1>} TestSuite2 */
/** @typedef {Object<string, Test & TestSuite0>} TestSuite1 */
/** @typedef {Object<string, Test>} TestSuite0 */
/** @typedef {(c: Context)} Test */