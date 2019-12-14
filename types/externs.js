/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml externs */
/** @const */
var _goa = {}
/**
 * @typedef {{ throw: boolean, notImplemented: !Function, methodNotAllowed: !Function }}
 */
_goa.AllowedMethodsOptions
/**
 * @param {!_goa.RouterConfig} opts The options for the router.
 * @interface
 */
_goa.Router = function(opts) {}
/**
 * Returns separate middleware for responding to `OPTIONS` requests with
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
 * @param {!_goa.AllowedMethodsOptions} options The options.
 */
_goa.Router.prototype.allowedMethods = function(options) {}
/**
 * Options for the layer.
 * @record
 */
_goa.LayerConfig
/**
 * Route name.
 * @type {string}
 */
_goa.LayerConfig.prototype.name
/**
 * Whether it is case-sensitive. Default `false`.
 * @type {boolean|undefined}
 */
_goa.LayerConfig.prototype.sensitive
/**
 * Require the trailing slash. Default `false`.
 * @type {boolean|undefined}
 */
_goa.LayerConfig.prototype.strict
/**
 * Config for the router.
 * @record
 */
_goa.RouterConfig
/**
 * The methods to serve.
 * Default `HEAD`, `OPTIONS`, `GET`, `PUT`, `PATCH`, `POST`, `DELETE`.
 * @type {!Array<string>}
 */
_goa.RouterConfig.prototype.methods
/**
 * Prefix router paths.
 * @type {string|undefined}
 */
_goa.RouterConfig.prototype.prefix
