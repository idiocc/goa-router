# @goa/router

[![npm version](https://badge.fury.io/js/%40goa%2Frouter.svg)](https://www.npmjs.com/package/@goa/router)

`@goa/router` is The Router For Creating Middleware For Goa Apps.

```sh
yarn add @goa/router
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`Router`](#type-router)
  * [`AllowedMethodsOptions`](#type-allowedmethodsoptions)
  * [`RouterConfig`](#type-routerconfig)
- [Verbs](#verbs)
- [Named Routes](#named-routes)
- [Multiple Middleware](#multiple-middleware)
- [Nested Routes](#nested-routes)
- [Router Prefixes](#router-prefixes)
- [URL Parameters](#url-parameters)
- [Copyright & License](#copyright--license)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default class:

```js
import Router from '@goa/router'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

__<a name="type-router">`Router`</a>__: Router For Goa Apps.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new (opts?: <a href="#type-routerconfig" title="Config for the router.">!RouterConfig</a>) => <a href="#type-router" title="Router For Goa Apps.">Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Create a new router.
```js
import Goa from '＠goa/koa'
import Router from '＠goa/router'

const app = new Goa()
const router = new Router()

router.get('/', (ctx, next) => {
  // ctx.router available
})

app
  .use(router.routes())
  .use(router.allowedMethods())
```
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>redirect</ins></td>
  <td><em>(source: string, destination: string, code?: number) => <a href="#type-router" title="Router For Goa Apps.">!Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Redirect <code>source</code> to <code>destination</code> URL with optional 30x status <code>code</code>.
   Both <code>source</code> and <code>destination</code> can be route names.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><kbd>static</kbd> <ins>url</ins></td>
  <td><em>(path: string, ...params: !Object[]) => string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Generate URL from url pattern and given `params`.
```js
const url = Router.url('/users/:id', { id: 1 })
// => "/users/1"
```
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>allowedMethods</ins></td>
  <td><em>(options: <a href="#type-allowedmethodsoptions">!AllowedMethodsOptions</a>) => <a href="https://github.com/idiocc/goa/wiki/Application#middlewarectx-_goacontextnext-function-promisevoid">!Middleware</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Returns separate middleware for responding to `OPTIONS` requests with
an `Allow` header containing the allowed methods, as well as responding
with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.
```js
import Goa from '＠goa/koa'
import Router from '＠goa/router'

const app = new Goa()
const router = new Router()

app.use(router.routes())
app.use(router.allowedMethods())
```
**Example with [Boom](https://github.com/hapijs/boom)**
```js
import Goa from '＠goa/koa'
import Router from '＠goa/router'
import Boom from 'boom'

const app = new Goa()
const router = new Router()

app.use(router.routes())
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => new Boom.notImplemented(),
  methodNotAllowed: () => new Boom.methodNotAllowed(),
}))
```
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>param</ins></td>
  <td><em>(param: string, middleware: <a href="https://github.com/idiocc/goa/wiki/Application#middlewarectx-_goacontextnext-function-promisevoid">!Middleware</a>) => <a href="#type-router" title="Router For Goa Apps.">!Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Run middleware for named route parameters. Useful for auto-loading or validation.
```js
router
  .param('user', (id, ctx, next) => {
    ctx.user = users[id]
    if (!ctx.user) return ctx.status = 404
    return next()
  })
  .get('/users/:user', ctx => {
    ctx.body = ctx.user
  })
  .get('/users/:user/friends', async ctx => {
    ctx.body = await ctx.user.getFriends()
  })
```
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>opts</ins></td>
  <td><em><a href="#type-routerconfig" title="Config for the router.">!RouterConfig</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Stored options passed to the <em>Router</em> constructor.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>route</ins></td>
  <td><em>(name: string) => !Layer</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Lookup route with given <code>name</code>.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>url</ins></td>
  <td><em>(name: string, ...params: !Object[]) => (string | !Error)</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Generate URL for route. Takes a route name and map of named `params`. If the route is not found, returns an error. The last argument can be an object with the `query` property.
```js
// To use urls, a named route should be created:
router.get('user', '/users/:id', (ctx, next) => {
  // ...
})
```
Get the URL by passing a **simple** parameter
```js
router.url('user', 3)
// => "/users/3"
```
Get the URL by passing parameters in an **object**
```js
router.url('user', { id: 3 })
// => "/users/3"
```
Use the url method for **redirects** to named routes:
```js
router.use((ctx) => {
  ctx.redirect(ctx.router.url('sign-in'))
})
```
Pass an **object query**:
```js
router.url('user', { id: 3 }, { query: { limit: 1 } })
// => "/users/3?limit=1"
```
Pass an already **serialised query**:
```js
router.url('user', { id: 3 }, { query: 'limit=1' })
// => "/users/3?limit=1"
```
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>use</ins></td>
  <td><em>(path: (string | !Array&lt;string&gt; | <a href="https://github.com/idiocc/goa/wiki/Application#middlewarectx-_goacontextnext-function-promisevoid">!Middleware</a>), ...middleware: <a href="https://github.com/idiocc/goa/wiki/Application#middlewarectx-_goacontextnext-function-promisevoid">!Middleware</a>[]) => <a href="#type-router" title="Router For Goa Apps.">!Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Use given middleware.
Middleware run in the order they are defined by `.use()`. They are invoked
sequentially, requests start at the first middleware and work their way
"down" the middleware stack.
```js
// session middleware will run before authorize
router
  .use(session())
  .use(authorize())
// use middleware only with given path
router.use('/users', userAuth())
// or with an array of paths
router.use(['/users', '/admin'], userAuth())
app.use(router.routes())
```
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>prefix</ins></td>
  <td><em>(prefix: string) => <a href="#type-router" title="Router For Goa Apps.">!Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Set the path prefix for a Router instance that was already initialized.
```js
router.prefix('/things/:thing_id')
```
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>middleware</ins><br><ins>routes</ins><sup><em>alias</em></sup></td>
  <td><em>() => <a href="https://github.com/idiocc/goa/wiki/Application#middlewarectx-_goacontextnext-function-promisevoid">!Middleware</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Returns router middleware which dispatches a route matching the request.
  </td>
 </tr>
</table>


__<a name="type-allowedmethodsoptions">`AllowedMethodsOptions`</a>__
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center">throw</td>
  <td><em>boolean</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Throw error instead of setting status and header.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">notImplemented</td>
  <td><em>!Function</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Throw the returned value in place of the default <code>NotImplemented</code> error.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">methodNotAllowed</td>
  <td><em>!Function</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Throw the returned value in place of the default <code>MethodNotAllowed</code> error.
  </td>
 </tr>
</table>


__<a name="type-routerconfig">`RouterConfig`</a>__: Config for the router.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center">methods</td>
  <td><em>!Array&lt;string&gt;</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   The methods to serve.
   Default <code>HEAD</code>, <code>OPTIONS</code>, <code>GET</code>, <code>PUT</code>, <code>PATCH</code>, <code>POST</code>, <code>DELETE</code>.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">prefix</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Prefix router paths.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center">routerPath</td>
  <td><em>string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Custom routing path.
  </td>
 </tr>
</table>

```js
import rqt from 'rqt'
import Goa from '@goa/koa'
import Router from '@goa/router'

const goa = new Goa()
const router = new Router()
router.get('/', (ctx, next) => {
  ctx.body = 'hello world'
})
goa.use(router.routes())

goa.listen(async function() {
  const url = `http://localhost:${this.address().port}`
  const res = await rqt(`${url}/`)
  console.log(res)
  this.close()
})
```
```
hello world
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## Verbs

Routes are assigned to the router by calling HTTP method verbs on the instance:

```js
router
  .get('/', (ctx, next) => {
    ctx.body = 'Hello World!'
  })
  .post('/users', (ctx, next) => {
    // ...
  })
  .put('/users/:id', (ctx, next) => {
    // ...
  })
  .del('/users/:id', (ctx, next) => {
    // ...
  })
  .all('/users/:id', (ctx, next) => {
    // ...
  })
```

Additionally, `router.all()` can be used to match against all methods. `router.del()` is an alias for `router.delete()`.

When a route is matched, its path is available at `ctx._matchedRoute` and if named, the name is available at `ctx._matchedRouteName`.

Route paths will be translated to regular expressions using [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

Query strings will not be considered when matching requests.

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## Named Routes

Routes can optionally have names. This allows generation of URLs and easy renaming of URLs during development.

```js
router.get('user', '/users/:id', (ctx, next) => {
  // ...
})

router.url('user', 3)
// => "/users/3"
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/4.svg?sanitize=true">
</a></p>

## Multiple Middleware

Multiple middleware may be passed to the router.

```js
router.get(
  '/users/:id',
  async (ctx, next) => {
    const user = await User.findOne(ctx.params.id)
    ctx.user = user
    await next()
  },
  ctx => {
    console.log(ctx.user)
    // => { id: 17, name: "Alex" }
  }
)
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/5.svg?sanitize=true">
</a></p>


## Nested Routes

It's possible to create a _Router_ instance, and then pass another _Router_ instance to its `.use` call to nest the two.

```js
const forums = new Router()
const posts = new Router()

posts.get('/', (ctx) => {
  ctx.body = ctx.params
})
posts.get('/:pid', (ctx) => {
  ctx.body = ctx.params
})
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods())

// responds to "/forums/123/posts" and "/forums/123/posts/123"
goa.use(forums.routes())
```
```js
// Request /forums/123/posts
{ fid: '123' }
// Request /forums/123/posts/123
{ fid: '123', pid: '123' }
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/6.svg?sanitize=true">
</a></p>

## Router Prefixes

Route paths can be prefixed at the router level.

```js
const router = new Router({
  prefix: '/users',
})

router.get('/', (ctx) => {
  // responds to "/users"
  ctx.body = ctx.params
})
router.get('/:id', (ctx) => {
  // responds to "/users/:id"
  ctx.body = ctx.params
})

goa.use(router.routes())
```
```js
// Request /users
{}
// Request /users/123
{ id: '123' }
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/7.svg?sanitize=true">
</a></p>

## URL Parameters

Named route parameters are captured and added to `ctx.params`.

```js
const router = new Router()

router.get('/:category/:title', (ctx) => {
  // the params are exposed to the context.
  ctx.body = ctx.params
})

goa.use(router.routes())
```
```js
// Request /programming/how-to-node
{ category: 'programming', title: 'how-to-node' }
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/8.svg?sanitize=true">
</a></p>

## Copyright & License

GNU Affero General Public License v3.0

[Original Work](https://github.com/ZijianHe/koa-router) by Alexander C. Mingoia under MIT License found in [COPYING](https://github.com/ZijianHe/koa-router/blob/master/LICENSE).

There's also a fork in the [Koa org](https://github.com/koajs/router).

<table>
  <tr>
    <td><img src="https://avatars2.githubusercontent.com/u/40834161?s=100&amp;v=4" alt="idiocc"></td>
    <td>© <a href="https://www.idio.cc">Idio</a> 2019</td>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>