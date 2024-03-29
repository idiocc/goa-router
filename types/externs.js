/**
 * @fileoverview
 * @externs
 */

/* typal types/index.xml */
/** @const */
var _goa = {}
/**
 * Options for the layer.
 * @record
 */
_goa.LayerConfig
/**
 * Route name.
 * @type {(string|null)|undefined}
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
 * A single piece of middleware that can be matched for all possible routes.
 * Constructor method.
 * @interface
 */
_goa.Layer = function() {}
/**
 * Parameter names stored in this layer. Default `[]`.
 * @type {!Array<{ name: string }>}
 */
_goa.Layer.prototype.paramNames

/* typal types/router.xml */
/**
 * Router For Goa Apps.
 * Create a new router.
 * @param {!_goa.RouterConfig=} [opts] The options for the router.
 * @interface
 */
_goa.Router = function(opts) {}
/**
 * Generate URL from url pattern and given `params`.
 * @param {string} path The URL pattern.
 * @param {...!Object} params The URL parameters.
 * @return {string}
 */
_goa.Router.url = function(path, ...params) {}
/**
 * Stored options passed to the _Router_ constructor.
 * @type {!_goa.RouterConfig}
 */
_goa.Router.prototype.opts
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
 * @return {!_goa.Router}
 */
_goa.Router.prototype.param = function(param, middleware) {}
/**
 * Redirect `source` to `destination` URL with optional 30x status `code`.
 * Both `source` and `destination` can be route names.
 * @param {string} source URL or route name.
 * @param {string} destination URL or route name.
 * @param {number=} [code] The HTTP status code. Default `301`.
 * @return {!_goa.Router}
 */
_goa.Router.prototype.redirect = function(source, destination, code) {}
/**
 * Lookup route with given `name`. If the route is not found, returns `null`.
 * @param {string} name The route name.
 * @return {_goa.Layer}
 */
_goa.Router.prototype.route = function(name) {}
/**
 * Generate URL for route. Takes a route name and map of named `params`. If the route is not found, returns an error. The last argument can be an object with the `query` property.
 * @param {string} name The route name.
 * @param {...!Object} params The URL parameters and options.
 * @return {(string|!Error)}
 */
_goa.Router.prototype.url = function(name, ...params) {}
/**
 * Use given middleware.
 * Middleware run in the order they are defined by `.use()`. They are invoked
 * sequentially, requests start at the first middleware and work their way
 * "down" the middleware stack.
 * @param {(string|!Array<string>|!_goa.Middleware)} path The path or an array of paths. Pass middleware without path to apply to `*`.
 * @param {...!_goa.Middleware} middleware The middleware to use.
 * @return {!_goa.Router}
 */
_goa.Router.prototype.use = function(path, ...middleware) {}
/**
 * Set the path prefix for a Router instance that was already initialized.
 * @param {string} prefix The prefix to set.
 * @return {!_goa.Router}
 */
_goa.Router.prototype.prefix = function(prefix) {}
/**
 * Returns router middleware which dispatches a route matching the request.
 * @return {!_goa.Middleware}
 */
_goa.Router.prototype.middleware = function() {}
/**
 * An alias for `middleware`.
 * @return {!_goa.Middleware}
 */
_goa.Router.prototype.routes = function() {}
/**
 * The options for the `allowedMethods` middleware generation.
 * @record
 */
_goa.AllowedMethodsOptions
/**
 * Throw error instead of setting status and header.
 * @type {boolean|undefined}
 */
_goa.AllowedMethodsOptions.prototype.throw
/**
 * Throw the returned value in place of the default `NotImplemented` error.
 * @type {(function(): !Error)|undefined}
 */
_goa.AllowedMethodsOptions.prototype.notImplemented = function() {}
/**
 * Throw the returned value in place of the default `MethodNotAllowed` error.
 * @type {(function(): !Error)|undefined}
 */
_goa.AllowedMethodsOptions.prototype.methodNotAllowed = function() {}
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
