/*!
 * RESTful resource routing middleware for koa.
 *
 * @author Alex Mingoia <talk@alexmingoia.com>
 * @link https://github.com/alexmingoia/koa-router
 */

import Debug from '@idio/debug'
import compose from '@goa/compose'
import HttpError from '@goa/http-errors'
import { METHODS } from 'http'
import Layer from './layer'

const debug = Debug('koa-router')

export default class Router {
  /**
   * Create a new router.
   *
   * @example
   *
   * Basic usage:
   *
   * ```javascript
   * var Koa = require('koa');
   * var Router = require('koa-router');
   *
   * var app = new Koa();
   * var router = new Router();
   *
   * router.get('/', (ctx, next) => {
   *   // ctx.router available
   * });
   *
   * app
   *   .use(router.routes())
   *   .use(router.allowedMethods());
   * ```
   *
   * @param {!_goa.RouterConfig} [opts]
   */
  constructor(opts = {}) {
    const { methods = [
      'HEAD',
      'OPTIONS',
      'GET',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
    ] } = opts
    this.opts = opts
    /** @type {!Array<string>} */
    this.methods = methods

    this.params = {}
    /**
     * @type {!Array<!Layer>}
     */
    this.stack = []
  }
  /**
   * @param {_goa.AllowedMethodsOptions} options
   */
  allowedMethods(options = {}) {
    const { throw: t, notImplemented, methodNotAllowed } = options

    /** @type {!_goa.Middleware} */
    const mw = async (ctx, next) => {
      await next()
      var allowed = {}

      if (!ctx.status || ctx.status == 404) {
        ctx.matched.forEach((route) => {
          route.methods.forEach((method) => {
            allowed[method] = method
          })
        })

        const allowedArr = Object.keys(allowed)

        if (!this.methods.includes(ctx.method)) {
          if (t) {
            let notImplementedThrowable
            if (typeof notImplemented == 'function') {
              notImplementedThrowable = notImplemented() // set whatever the user returns from their function
            } else {
              notImplementedThrowable = new HttpError.NotImplemented()
            }
            throw notImplementedThrowable
          } else {
            ctx.status = 501
            ctx.set('Allow', allowedArr.join(', '))
          }
        } else if (allowedArr.length) {
          if (ctx.method == 'OPTIONS') {
            ctx.status = 200
            ctx.body = ''
            ctx.set('Allow', allowedArr.join(', '))
          } else if (!allowed[ctx.method]) {
            if (t) {
              let notAllowedThrowable
              if (typeof methodNotAllowed == 'function') {
                notAllowedThrowable = methodNotAllowed() // set whatever the user returns from their function
              } else {
                notAllowedThrowable = new HttpError.MethodNotAllowed()
              }
              throw notAllowedThrowable
            } else {
              ctx.status = 405
              ctx.set('Allow', allowedArr.join(', '))
            }
          }
        }
      }
    }
    return mw
  }

  /**
   * Register route with all methods.
   *
   * @param {String} name Optional.
   * @param {String} path
   * @param {Function=} middleware You may also pass multiple middleware.
   * @param {Function} callback
   * @private
   */
  all(name, path, middleware) {
    let mw

    if (typeof path == 'string' || path instanceof RegExp) {
      mw = middleware
    } else {
      mw = [path, ...middleware]
      path = name
      name = null
    }

    this.register(path, methods, mw, {
      name: name,
    })

    return this
  }

  /**
   * Redirect `source` to `destination` URL with optional 30x status `code`.
   *
   * Both `source` and `destination` can be route names.
   *
   * ```javascript
   * router.redirect('/login', 'sign-in');
   * ```
   *
   * This is equivalent to:
   *
   * ```javascript
   * router.all('/login', ctx => {
   *   ctx.redirect('/sign-in');
   *   ctx.status = 301;
   * });
   * ```
   *
   * @param {String} source URL or route name.
   * @param {String} destination URL or route name.
   * @param {Number=} code HTTP status code (default: 301).
   * @returns {Router}
   */

  redirect(source, destination, code) {
    // lookup source route by name
    if (source[0] !== '/') {
      source = this.url(source)
    }

    // lookup destination route by name
    if (destination[0] !== '/') {
      destination = this.url(destination)
    }

    return this.all(source, ctx => {
      ctx.redirect(destination)
      ctx.status = code || 301
    })
  }

  /**
   * Create and register a route.
   *
   * @param {string|!Array<string>} path The path string or an array of paths.
   * @param {!Array<string>} methods Array of HTTP verbs.
   * @param {!_goa.Middleware} middleware Multiple middleware also accepted.
   * @private
   */
  register(path, methods, middleware, opts = {}) {
    const { ignoreCaptures, prefix = this.opts.prefix,
      strict = this.opts.strict, end, name,
      sensitive = this.opts.sensitive } = opts

    // support array of paths
    if (Array.isArray(path)) {
      path.forEach((p) => {
        this.register(p, methods, middleware, opts)
      })

      return this
    }

    // create route
    const route = new Layer(path, methods, middleware, {
      end,
      name,
      sensitive,
      strict,
      prefix: prefix || '',
      ignoreCaptures,
    })

    if (this.opts.prefix) {
      route.setPrefix(this.opts.prefix)
    }

    // add parameter middleware
    Object.keys(this.params).forEach((param) => {
      route.param(param, this.params[param])
    })

    this.stack.push(route)

    return route
  }

  /**
   * Lookup route with given `name`.
   *
   * @param {String} name
   * @returns {Layer|false}
   */

  route(name) {
    const routes = this.stack

    for (let len = routes.length, i=0; i<len; i++) {
      if (routes[i].name && routes[i].name === name) {
        return routes[i]
      }
    }

    return false
  }

  /**
   * Generate URL for route. Takes a route name and map of named `params`.
   *
   * @example
   *
   * ```javascript
   * router.get('user', '/users/:id', (ctx, next) => {
   *   // ...
   * });
   *
   * router.url('user', 3);
   * // => "/users/3"
   *
   * router.url('user', { id: 3 });
   * // => "/users/3"
   *
   * router.use((ctx, next) => {
   *   // redirect to named route
   *   ctx.redirect(ctx.router.url('sign-in'));
   * })
   *
   * router.url('user', { id: 3 }, { query: { limit: 1 } });
   * // => "/users/3?limit=1"
   *
   * router.url('user', { id: 3 }, { query: "limit=1" });
   * // => "/users/3?limit=1"
   * ```
   *
   * @param {String} name route name
   * @param {Object} params url parameters
   * @param {Object} [options] options parameter
   * @param {Object|String} [options.query] query options
   */
  url(name, ...params) {
    const route = this.route(name)

    if (route) {
      return route.url.apply(route, ...params)
    }

    return new Error(`No route found for name: ${name}`)
  }

  /**
   * Match given `path` and return corresponding routes.
   *
   * @param {string} path
   * @param {string} method
   * path and method.
   * @private
   */
  match(path, method) {
    const layers = this.stack
    let layer
    const matched = {
      /** @type {!Array<!Layer>} */
      path: [],
      /** @type {!Array<!Layer>} */
      pathAndMethod: [],
      route: false,
    }

    for (let len = layers.length, i = 0; i < len; i++) {
      layer = layers[i]

      debug('test %s %s', layer.path, layer.regexp)

      if (layer.match(path)) {
        matched.path.push(layer)

        if (layer.methods.length == 0 || layer.methods.includes(method)) {
          matched.pathAndMethod.push(layer)
          if (layer.methods.length) matched.route = true
        }
      }
    }

    return matched
  }

  /**
   * Run middleware for named route parameters. Useful for auto-loading or
   * validation.
   *
   * @example
   *
   * ```javascript
   * router
   *   .param('user', (id, ctx, next) => {
   *     ctx.user = users[id];
   *     if (!ctx.user) return ctx.status = 404;
   *     return next();
   *   })
   *   .get('/users/:user', ctx => {
   *     ctx.body = ctx.user;
   *   })
   *   .get('/users/:user/friends', ctx => {
   *     return ctx.user.getFriends().then(function(friends) {
   *       ctx.body = friends;
   *     });
   *   })
   *   // /users/3 => {"id": 3, "name": "Alex"}
   *   // /users/3/friends => [{"id": 4, "name": "TJ"}]
   * ```
   *
   * @param {string} param
   * @param {!_goa.Middleware} middleware
   */
  param(param, middleware) {
    this.params[param] = middleware
    this.stack.forEach((route) => {
      route.param(param, middleware)
    })
    return this
  }

  /**
   * Generate URL from url pattern and given `params`.
   *
   * @example
   *
   * ```javascript
   * const url = Router.url('/users/:id', {id: 1});
   * // => "/users/1"
   * ```
   *
   * @param {string} path url pattern
   * @param {Array<!Object>} args url parameters
   */
  static url(path, ...args) {
    return Layer.prototype.url.apply({ path }, ...args)
  }
  /**
   * Set the path prefix for a Router instance that was already initialized.
   *
   * @example
   *
   * ```javascript
   * router.prefix('/things/:thing_id')
   * ```
   *
   * @param {string} prefix
   */
  prefix(prefix) {
    prefix = prefix.replace(/\/$/, '')

    this.opts.prefix = prefix

    this.stack.forEach((route) => {
      route.setPrefix(prefix)
    })

    return this
  }
  /**
   * Use given middleware.
   *
   * Middleware run in the order they are defined by `.use()`. They are invoked
   * sequentially, requests start at the first middleware and work their way
   * "down" the middleware stack.
   *
   * @example
   *
   * ```javascript
   * // session middleware will run before authorize
   * router
   *   .use(session())
   *   .use(authorize());
   *
   * // use middleware only with given path
   * router.use('/users', userAuth());
   *
   * // or with an array of paths
   * router.use(['/users', '/admin'], userAuth());
   *
   * app.use(router.routes());
   * ```
   *
   * @param {string|!Array<string>|!_goa.Middleware} path
   * @param {!Array<!_goa.Middleware>} middleware
   */
  use(path, ...middleware) {
    // support array of paths
    if (Array.isArray(path) && typeof path[0] == 'string') {
      path.forEach((p) => {
        this.use(p, ...middleware)
      })
      return this
    }

    const hasPath = typeof path == 'string'
    if (!hasPath) {
      path = undefined
      middleware.unshift(path)
    }

    middleware.forEach((m) => {
      const router = /** @type {Router} */ (m.router)
      if (router) {
        router.stack.forEach((nestedLayer) => {
          if (path) nestedLayer.setPrefix(path)
          if (this.opts.prefix) nestedLayer.setPrefix(this.opts.prefix)
          this.stack.push(nestedLayer)
        })

        if (this.params) {
          Object.keys(this.params).forEach((key) => {
            router.param(key, this.params[key])
          })
        }
      } else {
        this.register(path || '(.*)', [], m, { end: false, ignoreCaptures: !hasPath })
      }
    })

    return this
  }
  get routes() {
    return this.middleware
  }
  /**
   * Returns router middleware which dispatches a route matching the request.
   */
  middleware() {
    /**
     * @type {!_goa.Middleware}
     */
    const dispatch = (ctx, next) => {
      debug('%s %s', ctx.method, ctx.path)

      const path = this.opts.routerPath || ctx.routerPath || ctx.path
      const matched = this.match(path, ctx.method)
      let layerChain

      if (ctx.matched) {
        ctx.matched.push(matched.path)
      } else {
        ctx.matched = matched.path
      }

      ctx.router = this

      if (!matched.route) return next()

      const matchedLayers = matched.pathAndMethod
      const mostSpecificLayer = matchedLayers[matchedLayers.length - 1]
      ctx._matchedRoute = mostSpecificLayer.path
      if (mostSpecificLayer.name) {
        ctx._matchedRouteName = mostSpecificLayer.name
      }

      layerChain = matchedLayers.reduce((acc, layer) => {
        /**
         * @type {!_goa.Middleware}
         */
        const link = (c, n) => {
          c.captures = layer.captures(path)
          c.params = layer.params(path, c.captures, c.params)
          c.routerName = layer.name
          return n()
        }
        acc.push(link)
        return acc.concat(layer.stack)
      }, [])

      return compose(layerChain)(ctx, next)
    }

    dispatch.router = this

    return dispatch
  }
  /**
   * @suppress {checkTypes}
   */
  get 'del'() {
    /**
     * @suppress {checkTypes}
     */
    return this['delete']
  }
}

const methods = METHODS.map((m) => m.toLowerCase())

/**
 * Create `router.verb()` methods, where *verb* is one of the HTTP verbs such
 * as `router.get()` or `router.post()`.
 *
 * Match URL patterns to callback functions or controller actions using `router.verb()`,
 * where **verb** is one of the HTTP verbs such as `router.get()` or `router.post()`.
 *
 * Additionaly, `router.all()` can be used to match against all methods.
 *
 * ```javascript
 * router
 *   .get('/', (ctx, next) => {
 *     ctx.body = 'Hello World!';
 *   })
 *   .post('/users', (ctx, next) => {
 *     // ...
 *   })
 *   .put('/users/:id', (ctx, next) => {
 *     // ...
 *   })
 *   .del('/users/:id', (ctx, next) => {
 *     // ...
 *   })
 *   .all('/users/:id', (ctx, next) => {
 *     // ...
 *   });
 * ```
 *
 * When a route is matched, its path is available at `ctx._matchedRoute` and if named,
 * the name is available at `ctx._matchedRouteName`
 *
 * Route paths will be translated to regular expressions using
 * [path-to-regexp](https://github.com/pillarjs/path-to-regexp).
 *
 * Query strings will not be considered when matching requests.
 *
 * #### Named routes
 *
 * Routes can optionally have names. This allows generation of URLs and easy
 * renaming of URLs during development.
 *
 * ```javascript
 * router.get('user', '/users/:id', (ctx, next) => {
 *  // ...
 * });
 *
 * router.url('user', 3);
 * // => "/users/3"
 * ```
 *
 * #### Multiple middleware
 *
 * Multiple middleware may be given:
 *
 * ```javascript
 * router.get(
 *   '/users/:id',
 *   (ctx, next) => {
 *     return User.findOne(ctx.params.id).then(function(user) {
 *       ctx.user = user;
 *       next();
 *     });
 *   },
 *   ctx => {
 *     console.log(ctx.user);
 *     // => { id: 17, name: "Alex" }
 *   }
 * );
 * ```
 *
 * ### Nested routers
 *
 * Nesting routers is supported:
 *
 * ```javascript
 * var forums = new Router();
 * var posts = new Router();
 *
 * posts.get('/', (ctx, next) => {...});
 * posts.get('/:pid', (ctx, next) => {...});
 * forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());
 *
 * // responds to "/forums/123/posts" and "/forums/123/posts/123"
 * app.use(forums.routes());
 * ```
 *
 * #### Router prefixes
 *
 * Route paths can be prefixed at the router level:
 *
 * ```javascript
 * var router = new Router({
 *   prefix: '/users'
 * });
 *
 * router.get('/', ...); // responds to "/users"
 * router.get('/:id', ...); // responds to "/users/:id"
 * ```
 *
 * #### URL parameters
 *
 * Named route parameters are captured and added to `ctx.params`.
 *
 * ```javascript
 * router.get('/:category/:title', (ctx, next) => {
 *   console.log(ctx.params);
 *   // => { category: 'programming', title: 'how-to-node' }
 * });
 * ```
 *
 * The [path-to-regexp](https://github.com/pillarjs/path-to-regexp) module is
 * used to convert paths to regular expressions.
 *
 */
methods.forEach((method) => {
  function m(name, path, ...middleware) {
    let mw

    if (typeof path == 'string' || path instanceof RegExp) {
      mw = middleware
    } else {
      mw = [path, ...middleware]
      path = name
      name = null
    }

    this.register(path, [method], mw, {
      name,
    })

    return this
  }
  Router.prototype[method] = m
})

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').RouterConfig} _goa.RouterConfig
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('..').AllowedMethodsOptions} _goa.AllowedMethodsOptions
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 */