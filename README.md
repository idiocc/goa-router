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

__<a name="type-router">`Router`</a>__: Create a new router.
<table>
 <thead><tr>
  <th>Name</th>
  <th>Type &amp; Description</th>
 </tr></thead>
 <tr>
  <td rowSpan="3" align="center"><ins>constructor</ins></td>
  <td><em>new (opts?: <a href="#type-routerconfig" title="Config for the router.">!RouterConfig</a>) => <a href="#type-router" title="Create a new router.">Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Constructor method.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><kbd>static</kbd> <ins>url</ins></td>
  <td><em>(path: string, ...params: !Array&lt;!Object&gt;[]) => string</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Generate URL from url pattern and given <code>params</code>.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>allowedMethods</ins></td>
  <td><em>(options: <a href="#type-allowedmethodsoptions">!AllowedMethodsOptions</a>) => !Middleware</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Returns separate middleware for responding to <code>OPTIONS</code> requests with
   an <code>Allow</code> header containing the allowed methods, as well as responding
   with <code>405 Method Not Allowed</code> and <code>501 Not Implemented</code> as appropriate.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>param</ins></td>
  <td><em>(param: string, middleware: !Middleware) => <a href="#type-router" title="Create a new router.">!Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Run middleware for named route parameters. Useful for auto-loading or validation.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>redirect</ins></td>
  <td><em>(source: string, destination: string, code?: number) => <a href="#type-router" title="Create a new router.">!Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Redirect <code>source</code> to <code>destination</code> URL with optional 30x status <code>code</code>.
   Both <code>source</code> and <code>destination</code> can be route names.
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
  <td><em>(name: string, params: !Object, options?: { query: (string | !Object) }) => (string | !Error)</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Generate URL for route. Takes a route name and map of named <code>params</code>. If the route is not found, returns an error.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>use</ins></td>
  <td><em>(path: (string | !Array&lt;string&gt; | !Middleware), ...middleware: !Array&lt;!Middleware&gt;[]) => <a href="#type-router" title="Create a new router.">!Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Use given middleware.
   
   Middleware run in the order they are defined by <code>.use()</code>. They are invoked
   sequentially, requests start at the first middleware and work their way
   "down" the middleware stack.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>prefix</ins></td>
  <td><em>(prefix: string) => <a href="#type-router" title="Create a new router.">!Router</a></em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Set the path prefix for a Router instance that was already initialized.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><ins>middleware</ins><br><ins>routes*</ins></td>
  <td><em>() => !Middleware</em></td>
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
  <td rowSpan="3" align="center"><strong>throw*</strong></td>
  <td><em>boolean</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Throw error instead of setting status and header.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><strong>notImplemented*</strong></td>
  <td><em>!Function</em></td>
 </tr>
 <tr></tr>
 <tr>
  <td>
   Throw the returned value in place of the default <code>NotImplemented</code> error.
  </td>
 </tr>
 <tr>
  <td rowSpan="3" align="center"><strong>methodNotAllowed*</strong></td>
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