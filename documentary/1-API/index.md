## API

The package is available by importing its default class:

```js
import Router from '@goa/router'
```

The example below creates a really simple router that responds to the `GET /` and `POST /users/:uid` requests. Because of `allowedMethods`, it will also send a response to the `OPTIONS` request with the `allow` header.

<table>
<tr><th><a href="example/index.js">Example</a></th><th>Output</th></tr>
<!-- block-start -->
<tr><td>

%EXAMPLE: example, ../src => @goa/router%
</td>
<td>

%FORK-sh example%
</td></tr>
</table>

%~%

<typedef narrow slimFunctions name="Router">types/router.xml</typedef>

<typedef details="RouterConfig" name="RouterConfig">types/router.xml</typedef>

%~%

## Verbs

Routes are assigned to the router by calling HTTP method verbs on the instance:

%EXAMPLE: example/verbs%

Additionally, `router.all()` can be used to match against all methods. `router.del()` is an alias for `router.delete()`.

When a route is matched, its path is available at `ctx._matchedRoute` and if named, the name is available at `ctx._matchedRouteName`.

Route paths will be translated to regular expressions using [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

Query strings will not be considered when matching requests.

%~%

## Allowed Methods

The router can respond to the `OPTIONS` request with the `allow` header.

**Example with [Boom](https://github.com/hapijs/boom)**

%EXAMPLE: example/allowed-methods-boom%

<typedef name="AllowedMethodsOptions">types/router.xml</typedef>

%~%

## Named Routes

Routes can optionally have names. This allows generation of URLs and easy renaming of URLs during development.

%EXAMPLE: example/named%

%~%

## Multiple Middleware

Multiple middleware may be passed to the router.

%EXAMPLE: example/multiple%

%~%
