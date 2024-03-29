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

const debug = Debug('@goa/router')

/**
 * @implements {_goa.Router}
 */
export default class Router {
  /**
   * Create a new router.
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
   * Returns the middleware with allowed methods.
   * @param {_goa.AllowedMethodsOptions} options
   */
  allowedMethods(options = {}) {
    const { throw: t = false, notImplemented, methodNotAllowed } = options

    /** @type {!_goa.Middleware} */
    const mw = async (ctx, next) => {
      await next()
      const allowed = {}
      const { status = 404 } = ctx

      if (status == 404) {
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
              notImplementedThrowable = new HttpError['NotImplemented']()
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
                notAllowedThrowable = new HttpError['MethodNotAllowed']()
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
   * Redirect `source` to `destination` URL with optional 30x status `code`.
   * Both `source` and `destination` can be route names.
   *
   * @param {string} source URL or route name.
   * @param {string} destination URL or route name.
   * @param {number} [code] HTTP status code (default: 301).
   */
  redirect(source, destination, code = 301) {
    // lookup source route by name
    if (source[0] != '/') {
      const s = this.url(source)
      if (s instanceof Error) throw s
      source = s
    }

    // lookup destination route by name
    if (destination[0] != '/') {
      const d = this.url(destination)
      if (d instanceof Error) throw d
      destination = d
    }

    return this['all'](source, ctx => {
      ctx.redirect(destination)
      ctx.status = /** @type {number} */ (code)
    })
  }

  /**
   * Create and register a route.
   *
   * @param {string|!Array<string>|RegExp} path The path string or an array of paths.
   * @param {!Array<string>} methods Array of HTTP verbs.
   * @param {!_goa.Middleware|!Array<!_goa.Middleware>} middleware Multiple middleware also accepted.
   * @param {!Object} [opts]
   * @private
   */
  register(path, methods, middleware, opts = {}) {
    const { ignoreCaptures, prefix = this.opts.prefix || '',
      strict = this.opts.strict || false, end = true, name,
      sensitive = this.opts.sensitive || false } = opts

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
      prefix,
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
   * @param {string} name
   */
  route(name) {
    const routes = this.stack

    for (let len = routes.length, i=0; i<len; i++) {
      if (routes[i].name && routes[i].name == name) {
        return routes[i]
      }
    }

    return null
  }

  /**
   * Generate URL for route. Takes a route name and map of named `params`.
   * @param {string} name route name
   * @param {...!Object} params url parameters and options
   */
  url(name, ...params) {
    const route = this.route(name)

    if (route)
      return route.url(...params)

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
   * @param {string} path Url pattern.
   * @param {!Array<!Object>} params Url parameters.
   */
  static url(path, ...params) {
    return Layer.prototype.url.apply(/** @type {!Layer} */ ({ path }), params)
  }
  /**
   * Set the path prefix for a Router instance that was already initialized.
   * @param {string} prefix The prefix to set.
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
   * @param {string|Array<string>|!_goa.Middleware} path
   * @param {...!_goa.Middleware} middleware
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
      middleware.unshift(path)
      path = null
    }

    middleware.forEach((m) => {
      const router = /** @type {Router} */ (m.router)
      if (router) {
        router.stack.forEach((nestedLayer) => {
          if (path) nestedLayer.setPrefix(/** @type {string} */ (path))
          if (this.opts.prefix) nestedLayer.setPrefix(this.opts.prefix)
          this.stack.push(nestedLayer)
        })

        if (this.params) {
          Object.keys(this.params).forEach((key) => {
            router.param(key, this.params[key])
          })
        }
      } else {
        this.register(/** @type {string} */ (path || '(.*)'), [], m, { end: false, ignoreCaptures: !hasPath })
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
     * @type {!_idio.Middleware}
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
         * @type {!_idio.Middleware}
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
}

Router['url'] = Router.url // eslint-disable-line

export const methods = METHODS.map((m) => m.toLowerCase())

;[...methods, 'all'].forEach((method) => {
  /**
   * A verb.
   * @this {_goa.Router}
   */
  function m(name, path, ...middleware) {
    let mw

    if (typeof path == 'string' || path instanceof RegExp) {
      mw = middleware
    } else {
      mw = [path, ...middleware]
      path = name
      name = null
    }

    this.register(path, method == 'all' ? methods : [method], mw, {
      name,
    })

    return this
  }
  Router.prototype[method] = m
  if (method == 'delete') {
    Router.prototype['del'] = m
  }
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
 * @typedef {import('../types').Router} _goa.Router
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('@typedefs/idio').Middleware} _idio.Middleware
 */