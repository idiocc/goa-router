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

__<a name="type-router">`Router`</a>__
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new (opts?: <a href="#type-routerconfig" title="Config for the router.">!RouterConfig</a>) => <a href="#type-router">Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><kbd>static</kbd> <ins>url</ins></td>
  <td><em>(path: string, args: !Array&lt;!Object&gt;) => string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Generate URL from url pattern and given <code>params</code>.
   
   ```javascript
const url = Router.url('/users/:id', {id: 1});
// => "/users/1"
```
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>allowedMethods</ins></td>
  <td><em>(options: !AllowedMethodsOptions) => <a href="https://github.com/idiocc/goa/wiki/Application#middlewarectx-_goacontextnext-function-promisevoid">!Middleware</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Returns separate middleware for responding to <code>OPTIONS</code> requests with
   an <code>Allow</code> header containing the allowed methods, as well as responding
   with <code>405 Method Not Allowed</code> and <code>501 Not Implemented</code> as appropriate.
   
   ```javascript
import Goa from '＠goa/koa'
import Router from '＠goa/router'

const app = new Goa()
const router = new Router()

app.use(router.routes());
app.use(router.allowedMethods());
```
   
   <strong>Example with <a href="https://github.com/hapijs/boom">Boom</a></strong>
   
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
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>param</ins></td>
  <td><em>(param: string, middleware: <a href="https://github.com/idiocc/goa/wiki/Application#middlewarectx-_goacontextnext-function-promisevoid">!Middleware</a>) => ?</em></td>
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
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>use</ins></td>
  <td><em>(path: (string | !Array&lt;string&gt; | <a href="https://github.com/idiocc/goa/wiki/Application#middlewarectx-_goacontextnext-function-promisevoid">!Middleware</a>), ...middleware: <a href="https://github.com/idiocc/goa/wiki/Application#middlewarectx-_goacontextnext-function-promisevoid">!Middleware</a>[]) => ?</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Use given middleware.
   
   Middleware run in the order they are defined by <code>.use()</code>. They are invoked
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