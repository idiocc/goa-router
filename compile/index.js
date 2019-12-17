const { _Router } = require('./router')

/**
 * Router For Goa Apps.
 */
class Router extends _Router {
  /**
   * Create a new router.
   * @param {!_goa.RouterConfig} [opts] Config for the router.
   * @param {!Array<string>} [opts.methods] The methods to serve.
   * Default `HEAD`, `OPTIONS`, `GET`, `PUT`, `PATCH`, `POST`, `DELETE`.
   * @param {string} [opts.prefix] Prefix router paths.
   * @param {string} [opts.routerPath] Custom routing path.
   * @example
   * ```js
   * import Goa from '＠goa/koa'
   * import Router from '＠goa/router'
   *
   * const app = new Goa()
   * const router = new Router()
   *
   * router.get('/', (ctx, next) => {
   *   // ctx.router available
   * })
   *
   * app
   *   .use(router.routes())
   *   .use(router.allowedMethods())
   * ```
   */
  constructor(opts) {
    super(opts)
  }
  /**
   * Generate URL from url pattern and given `params`.
   * @param {string} path The URL pattern.
   * @param {...!Object} args
   * @return {string}
   * @example
   * ```js
   * const url = Router.url('/users/:id', { id: 1 })
   * // => "/users/1"
   * ```
   */
  static url(path, ...params) {
    return _Router.url(path, ...params)
  }
  /**
   * Returns separate middleware for responding to `OPTIONS` requests with
   * an `Allow` header containing the allowed methods, as well as responding
   * with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.
   * @param {!_goa.AllowedMethodsOptions} options
   * @param {boolean} [options.throw] Throw error instead of setting status and header.
   * @param {!Function} [options.notImplemented] Throw the returned value in place of the default `NotImplemented` error.
   * @param {!Function} [options.methodNotAllowed] Throw the returned value in place of the default `MethodNotAllowed` error.
   * @return {!_goa.Middleware}
   * @example
   * ```js
   * import Goa from '＠goa/koa'
   * import Router from '＠goa/router'
   *
   * const app = new Goa()
   * const router = new Router()
   *
   * app.use(router.routes())
   * app.use(router.allowedMethods())
   * ```
   * **Example with [Boom](https://github.com/hapijs/boom)**
   * ```js
   * import Goa from '＠goa/koa'
   * import Router from '＠goa/router'
   * import Boom from 'boom'
   *
   * const app = new Goa()
   * const router = new Router()
   *
   * app.use(router.routes())
   * app.use(router.allowedMethods({
   *   throw: true,
   *   notImplemented: () => new Boom.notImplemented(),
   *   methodNotAllowed: () => new Boom.methodNotAllowed(),
   * }))
   * ```
   */
  allowedMethods(options) {
    return super.allowedMethods(options)
  }
  /**
   * Run middleware for named route parameters. Useful for auto-loading or validation.
   * @param {string} param The name of the param.
   * @param {!_goa.Middleware} middleware The middleware.
   * @example
   * ```js
   * router
   *   .param('user', (id, ctx, next) => {
   *     ctx.user = users[id]
   *     if (!ctx.user) return ctx.status = 404
   *     return next()
   *   })
   *   .get('/users/:user', ctx => {
   *     ctx.body = ctx.user
   *   })
   *   .get('/users/:user/friends', async ctx => {
   *     ctx.body = await ctx.user.getFriends()
   *   })
   * ```
   */
  param(param, middleware) {
    return super.param(param, middleware)
  }
  /**
   * Redirect `source` to `destination` URL with optional 30x status `code`.
   * Both `source` and `destination` can be route names.
   * @param {string} source URL or route name.
   * @param {string} destination URL or route name.
   * @param {number=} [code] The HTTP status code. Default `301`.
   */
  redirect(source, destination, code) {
    return super.redirect(source, destination, code)
  }
  /**
   * Lookup route with given `name`.
   * @param {string} name The route name.
   * @return {!_goa.Layer}
   */
  route(name) {
    return super.route(name)
  }
  /**
   * Generate URL for route. Takes a route name and map of named `params`. If the route is not found, returns an error.
   * @param {string} name The route name.
   * @param {!Object} params The URL parameters.
   * @param {{ query: (string|!Object) }=} [options] The options.
   * @return {(string|!Error)}
   * @example
   * ```js
   * router.get('user', '/users/:id', (ctx, next) => {
   *   // ...
   * })
   *
   * router.url('user', 3)
   * // => "/users/3"
   *
   * router.url('user', { id: 3 })
   * // => "/users/3"
   *
   * router.use((ctx, next) => {
   *   // redirect to named route
   *   ctx.redirect(ctx.router.url('sign-in'))
   * })
   *
   * router.url('user', { id: 3 }, { query: { limit: 1 } })
   * // => "/users/3?limit=1"
   *
   * router.url('user', { id: 3 }, { query: 'limit=1' })
   * // => "/users/3?limit=1"
   * ```
   */
  url(name, params, options) {
    return super.url(name, params, options)
  }
  /**
   * Use given middleware.
   * Middleware run in the order they are defined by `.use()`. They are invoked
   * sequentially, requests start at the first middleware and work their way
   * "down" the middleware stack.
   * @param {(string|!Array<string>|!_goa.Middleware)} path The path or an array of paths. Pass middleware without path to apply to `*`.
   * @param {...!_goa.Middleware} args
   * @example
   * ```js
   * // session middleware will run before authorize
   * router
   *   .use(session())
   *   .use(authorize())
   * // use middleware only with given path
   * router.use('/users', userAuth())
   * // or with an array of paths
   * router.use(['/users', '/admin'], userAuth())
   * app.use(router.routes())
   * ```
   */
  use(path, ...middleware) {
    return super.use(path, ...middleware)
  }
  /**
   * Set the path prefix for a Router instance that was already initialized.
   * @param {string} prefix The prefix to set.
   * @example
   * ```js
   * router.prefix('/things/:thing_id')
   * ```
   */
  prefix(prefix) {
    return super.prefix(prefix)
  }
  /**
   * Returns router middleware which dispatches a route matching the request.
   * @return {!_goa.Middleware}
   */
  middleware() {
    return super.middleware()
  }
  /**
   * Returns router middleware which dispatches a route matching the request.
   * @return {!_goa.Middleware}
   * @alias middleware An alias for **middleware**.
   */
  routes() {
    return super.middleware()
  }
}

module.exports = Router

/* typal types/index.xml namespace */
/**
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 * @typedef {_goa.LayerConfig} LayerConfig `＠record` Options for the layer.
 * @typedef {Object} _goa.LayerConfig `＠record` Options for the layer.
 * @prop {string|null} [name] Route name.
 * @prop {boolean} [sensitive=false] Whether it is case-sensitive. Default `false`.
 * @prop {boolean} [strict=false] Require the trailing slash. Default `false`.
 * @prop {boolean} [ignoreCaptures=false] Ignore captures. Default `false`.
 * @typedef {_goa.Layer} Layer `＠interface`
 * @typedef {Object} _goa.Layer `＠interface`
 */

/* typal types/router.xml namespace */
/**
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 * @typedef {_goa.Router} Router `＠interface` Router For Goa Apps.
 * @typedef {Object} _goa.Router `＠interface` Router For Goa Apps.
 * @prop {(opts?: !_goa.RouterConfig) => _goa.Router} constructor Create a new router.
 * @prop {(options: !_goa.AllowedMethodsOptions) => !_goa.Middleware} allowedMethods Returns separate middleware for responding to `OPTIONS` requests with
 * an `Allow` header containing the allowed methods, as well as responding
 * with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.
 * @prop {(param: string, middleware: !_goa.Middleware) => !_goa.Router} param Run middleware for named route parameters. Useful for auto-loading or validation.
 * @prop {(source: string, destination: string, code?: number) => !_goa.Router} redirect Redirect `source` to `destination` URL with optional 30x status `code`.
 * Both `source` and `destination` can be route names.
 * @prop {(name: string) => !_goa.Layer} route Lookup route with given `name`.
 * @prop {(name: string, params: !Object, options?: { query: (string|!Object) }) => (string|!Error)} url Generate URL for route. Takes a route name and map of named `params`. If the route is not found, returns an error.
 * @prop {(path: (string|!Array<string>|!_goa.Middleware), ...middleware: !_goa.Middleware[]) => !_goa.Router} use Use given middleware.
 * Middleware run in the order they are defined by `.use()`. They are invoked
 * sequentially, requests start at the first middleware and work their way
 * "down" the middleware stack.
 * @prop {(prefix: string) => !_goa.Router} prefix Set the path prefix for a Router instance that was already initialized.
 * @prop {() => !_goa.Middleware} middleware Returns router middleware which dispatches a route matching the request.
 * @prop {() => !_goa.Middleware} routes An alias for `middleware`.
 * @typedef {_goa.AllowedMethodsOptions} AllowedMethodsOptions `＠record`
 * @typedef {Object} _goa.AllowedMethodsOptions `＠record`
 * @prop {boolean} [throw] Throw error instead of setting status and header.
 * @prop {!Function} [notImplemented] Throw the returned value in place of the default `NotImplemented` error.
 * @prop {!Function} [methodNotAllowed] Throw the returned value in place of the default `MethodNotAllowed` error.
 * @typedef {_goa.RouterConfig} RouterConfig `＠record` Config for the router.
 * @typedef {Object} _goa.RouterConfig `＠record` Config for the router.
 * @prop {!Array<string>} [methods] The methods to serve.
 * Default `HEAD`, `OPTIONS`, `GET`, `PUT`, `PATCH`, `POST`, `DELETE`.
 * @prop {string} [prefix] Prefix router paths.
 * @prop {string} [routerPath] Custom routing path.
 */
