const { _Router } = require('./router')

class Router extends _Router {
  /**
   * Create a new router.
   *
   * @example
   *
   * Basic usage:
   *
   * ```javascript
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
   * @param {!Array<string>} opts.methods The methods to serve.
   * Default `HEAD`, `OPTIONS`, `GET`, `PUT`, `PATCH`, `POST`, `DELETE`.
   * @param {string} [opts.prefix] Prefix router paths.
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
   *   methodNotAllowed: () => new Boom.methodNotAllowed()
   * }))
   * ```
   */
  allowedMethods() {

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
 * @prop {(opts: !_goa.RouterConfig) => _goa.Router} constructor Constructor method.
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
 * @typedef {_goa.LayerConfig} LayerConfig `＠record` Options for the layer.
 * @typedef {Object} _goa.LayerConfig `＠record` Options for the layer.
 * @prop {string} name Route name.
 * @prop {boolean} [sensitive=false] Whether it is case-sensitive. Default `false`.
 * @prop {boolean} [strict=false] Require the trailing slash. Default `false`.
 * @typedef {_goa.RouterConfig} RouterConfig `＠record` Config for the router.
 * @typedef {Object} _goa.RouterConfig `＠record` Config for the router.
 * @prop {!Array<string>} methods The methods to serve.
 * Default `HEAD`, `OPTIONS`, `GET`, `PUT`, `PATCH`, `POST`, `DELETE`.
 * @prop {string} [prefix] Prefix router paths.
 */
