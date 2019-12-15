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
 * Create a new router.
 * @param {!_goa.RouterConfig=} [opts] The options for the router.
 * @interface
 */
_goa.Router = function(opts) {}
/**
 * Generate URL from url pattern and given `params`.
 *
 * ```javascript
 * const url = Router.url('/users/:id', {id: 1});
 * // => "/users/1"
 * ```
 * @param {string} path The URL pattern.
 * @param {!Array<!Object>} args The URL parameters.
 * @return {string}
 */
_goa.Router.url = function(path, args) {}
/**
 * Returns separate middleware for responding to `OPTIONS` requests with
 * an `Allow` header containing the allowed methods, as well as responding
 * with `405 Method Not Allowed` and `501 Not Implemented` as appropriate.
 * @param {!_goa.AllowedMethodsOptions} options The options.
 * @return {!_goa.Middleware}
 */
_goa.Router.prototype.allowedMethods = function(options) {}
/**
 * Run middleware for named route parameters. Useful for auto-loading or validation.
 * @param {string} param The name of the param.
 * @param {!_goa.Middleware} middleware The middleware.
 */
_goa.Router.prototype.param = function(param, middleware) {}
/**
 * Use given middleware.
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
 * @param {(string|!Array<string>|!_goa.Middleware)} path The path or an array of paths. Pass middleware without path to apply to `*`.
 * @param {...!_goa.Middleware} args
 */
_goa.Router.prototype.use = function(path, ...args) {}
/**
 * Options for the layer.
 * @record
 */
_goa.LayerConfig
/**
 * Route name.
 * @type {string|null}
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
 * Ignore captures. Default `false`.
 * @type {boolean|undefined}
 */
_goa.LayerConfig.prototype.ignoreCaptures
/**
 * Config for the router.
 * @record
 */
_goa.RouterConfig
/**
 * The methods to serve.
 * Default `HEAD`, `OPTIONS`, `GET`, `PUT`, `PATCH`, `POST`, `DELETE`.
 * @type {(!Array<string>)|undefined}
 */
_goa.RouterConfig.prototype.methods
/**
 * Prefix router paths.
 * @type {string|undefined}
 */
_goa.RouterConfig.prototype.prefix
/**
 * Custom routing path.
 * @type {string|undefined}
 */
_goa.RouterConfig.prototype.routerPath
