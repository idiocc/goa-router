# @goa/router

[![npm version](https://badge.fury.io/js/%40goa%2Frouter.svg)](https://www.npmjs.com/package/@goa/router)

`@goa/router` is The Router For Creating Middleware For Goa Apps.

```sh
yarn add @goa/router
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
  * [`_goa.Router`](#type-_goarouter)
- [Copyright & License](#copyright--license)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import router from '@goa/router'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

<strong><a name="type-_goarouter">`_goa.Router`</a></strong>
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new (opts?: !_goa.RouterConfig) => <a href="#type-_goarouter">_goa.Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.<br/>
   <kbd>opts</kbd> <em><code>!_goa.RouterConfig</code></em> (optional): The options for the router.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><kbd>static</kbd> <ins>url</ins></td>
  <td><em>(path: string, args: !Array&lt;!Object&gt;) => ?</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Generate URL from url pattern and given `params`.

```javascript
const url = Router.url('/users/:id', {id: 1});
// => "/users/1"
```
<br/>
<kbd><strong>path*</strong></kbd> <em>`string`</em>: The URL pattern.<br/>
<kbd><strong>args*</strong></kbd> <em><code>!Array&lt;!Object&gt;</code></em>: The URL parameters.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>allowedMethods</ins></td>
  <td><em>(options: !_goa.AllowedMethodsOptions) => ?</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Returns separate middleware for responding to `OPTIONS` requests with
an `Allow` header containing the allowed methods, as well as responding
with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.

```javascript
import Goa from '＠goa/koa'
import Router from '＠goa/router'

const app = new Goa()
const router = new Router()

app.use(router.routes());
app.use(router.allowedMethods());
```

**Example with [Boom](https://github.com/hapijs/boom)**

```javascript
import Goa from '＠goa/koa'
import Router from '＠goa/router'
import Boom from 'boom'

const app = new Goa()
const router = new Router()

app.use(router.routes())
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => new Boom.notImplemented(),
  methodNotAllowed: () => new Boom.methodNotAllowed()
}))
```
<br/>
<kbd><strong>options*</strong></kbd> <em>`!_goa.AllowedMethodsOptions`</em>: The options.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>param</ins></td>
  <td><em>(param: string, middleware: !_goa.Middleware) => ?</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Run middleware for named route parameters. Useful for auto-loading or validation.

```js
router
  .param('user', (id, ctx, next) => {
    ctx.user = users[id];
    if (!ctx.user) return ctx.status = 404;
    return next();
  })
  .get('/users/:user', ctx => {
    ctx.body = ctx.user;
  })
  .get('/users/:user/friends', ctx => {
    return ctx.user.getFriends().then(function(friends) {
      ctx.body = friends;
    });
  })
  // /users/3 => {"id": 3, "name": "Alex"}
  // /users/3/friends => [{"id": 4, "name": "TJ"}]
```
<br/>
<kbd><strong>param*</strong></kbd> <em>`string`</em>: The name of the param.<br/>
<kbd><strong>middleware*</strong></kbd> <em>`!_goa.Middleware`</em>: The middleware.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>use</ins></td>
  <td><em>(path: (string | !Array&lt;string&gt; | !_goa.Middleware), ...middleware: !_goa.Middleware[]) => ?</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>

Use given middleware.

Middleware run in the order they are defined by `.use()`. They are invoked
sequentially, requests start at the first middleware and work their way
"down" the middleware stack.

```javascript
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
<br/>
<kbd><strong>path*</strong></kbd> <em><code>(string \| !Array&lt;string&gt; \| !_goa.Middleware)</code></em>: The path or an array of paths. Pass middleware without path to apply to `*`.<br/>
<kbd>...middleware</kbd> <em>`!_goa.Middleware`</em> (optional): The middleware to use.
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

## Copyright & License

GNU Affero General Public License v3.0

<table>
  <tr>
    <td><img src="https://avatars3.githubusercontent.com/u/38815725?v=4&amp;s=100" alt="idiocc"></td>
    <td>© <a href="https://www.artd.eco">Art Deco™</a> 2019</td>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>