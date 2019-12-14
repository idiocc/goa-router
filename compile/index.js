const { _Router } = require('./router')

class Router extends _Router {
  /**
   * Create a new router.
   *
   * @example
   *
   * Basic usage:
   *
   * ```js
   * import Goa from '@goa/koa'
   * import Router from '@goa/router'
   *
   * const app = new Goa()
   * const router = new Router()
   *
   * router.get('/', (ctx, next) => {
   *   // ctx.router available
   * });
   *
   * app
   *   .use(router.routes())
   *   .use(router.allowedMethods())
   * ```
   *
   * @param {!_goa.RouterConfig} [opts] Config for the router.
   * @param {!Array<string>} [opts.methods] The methods to serve.
   * Default `HEAD`, `OPTIONS`, `GET`, `PUT`, `PATCH`, `POST`, `DELETE`.
   * @param {string} [opts.prefix] Prefix router paths.
   * @param {string} [opts.routerPath] Custom routing path.
   */
  constructor(opts) {
    super(opts)
  }
  /**
   * Returns separate middleware for responding to `OPTIONS` requests with
   * an `Allow` header containing the allowed methods, as well as responding
   * with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.
   *
   * @example
   *
   * ```js
   * import Goa from '＠goa/koa'
   * import Router from '＠goa/router'
   *
   * const app = new Goa()
   * const router = new Router()
   *
   * app.use(router.routes());
   * app.use(router.allowedMethods());
   * ```
   *
   * **Example with [Boom](https://github.com/hapijs/boom)**
   *
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
  allowedMethods() {

  }
  /**
   * Run middleware for named route parameters. Useful for auto-loading or
   * validation.
   *
   * @example
   *
   * ```js
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
    return super.param(param, middleware)
  }
}

module.exports = Router

/* typal types/index.xml namespace */
/**
 * @typedef {_goa.AllowedMethodsOptions} AllowedMethodsOptions
 * @typedef {Object} _goa.AllowedMethodsOptions
 * @prop {boolean} throw Throw error instead of setting status and header.
 * @prop {!Function} notImplemented Throw the returned value in place of the default `NotImplemented` error.
 * @prop {!Function} methodNotAllowed Throw the returned value in place of the default `MethodNotAllowed` error.
 * @typedef {_goa.Router} Router `＠interface`
 * @typedef {Object} _goa.Router `＠interface`
 * @prop {(opts?: !_goa.RouterConfig) => _goa.Router} constructor Constructor method.
 * @prop {(options: !_goa.AllowedMethodsOptions) => ?} allowedMethods Returns separate middleware for responding to `OPTIONS` requests with
 * an `Allow` header containing the allowed methods, as well as responding
 * with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.
 *
 * ```javascript
 * import Goa from '＠goa/koa'
 * import Router from '＠goa/router'
 *
 * const app = new Goa()
 * const router = new Router()
 *
 * app.use(router.routes());
 * app.use(router.allowedMethods());
 * ```
 *
 * **Example with [Boom](https://github.com/hapijs/boom)**
 *
 * ```javascript
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
 *   methodNotAllowed: () => new Boom.methodNotAllowed()
 * }))
 * ```
 * @prop {(param: string, middleware: !_goa.Middleware) => ?} param Run middleware for named route parameters. Useful for auto-loading or validation.
 *
 * ```js
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
 * @prop {(path: (string|!Array<string>|!_goa.Middleware), ...middleware: !_goa.Middleware[]) => ?} use Use given middleware.
 *
 * Middleware run in the order they are defined by `.use()`. They are invoked
 * sequentially, requests start at the first middleware and work their way
 * "down" the middleware stack.
 *
 * ```javascript
 * // session middleware will run before authorize
 * router
 *   .use(session())
 *   .use(authorize())
 *
 * // use middleware only with given path
 * router.use('/users', userAuth())
 *
 * // or with an array of paths
 * router.use(['/users', '/admin'], userAuth())
 *
 * app.use(router.routes())
 * ```
 * @typedef {_goa.LayerConfig} LayerConfig `＠record` Options for the layer.
 * @typedef {Object} _goa.LayerConfig `＠record` Options for the layer.
 * @prop {string|null} name Route name.
 * @prop {boolean} [sensitive=false] Whether it is case-sensitive. Default `false`.
 * @prop {boolean} [strict=false] Require the trailing slash. Default `false`.
 * @prop {boolean} [ignoreCaptures=false] Ignore captures. Default `false`.
 * @typedef {_goa.RouterConfig} RouterConfig `＠record` Config for the router.
 * @typedef {Object} _goa.RouterConfig `＠record` Config for the router.
 * @prop {!Array<string>} [methods] The methods to serve.
 * Default `HEAD`, `OPTIONS`, `GET`, `PUT`, `PATCH`, `POST`, `DELETE`.
 * @prop {string} [prefix] Prefix router paths.
 * @prop {string} [routerPath] Custom routing path.
 */
