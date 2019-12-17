## API

The package is available by importing its default function:

```js
import router from '@goa/router'
```

%~%

<!-- <typedef method="router">types/api.xml</typedef> -->

<typedef narrow slimFunctions>types/router.xml</typedef>

%EXAMPLE: example, ../src => @goa/router%
%FORK example%

%~%

## Verbs

Routes are assigned to the router by calling HTTP method verbs on the instance:

%EXAMPLE example/verbs%

Additionally, `router.all()` can be used to match against all methods. `router.del()` is an alias for `router.delete()`.

When a route is matched, its path is available at `ctx._matchedRoute` and if named, the name is available at `ctx._matchedRouteName`.

Route paths will be translated to regular expressions using [path-to-regexp](https://github.com/pillarjs/path-to-regexp).

Query strings will not be considered when matching requests.

%~%

## Named Routes

Routes can optionally have names. This allows generation of URLs and easy renaming of URLs during development.

%EXAMPLE: example/named%

%~%

## Multiple Middleware

Multiple middleware may be passed to the router.

%EXAMPLE: example/multiple%

%~%
