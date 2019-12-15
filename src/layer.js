import Debug from '@idio/debug'
import pathToRegExp, { compile, parse } from './path-to-regexp'
import uri from 'urijs'

const debug = Debug('koa-router')

/**
 * @private
 */
export default class Layer {
  /**
   * Initialize a new routing Layer with given `method`, `path`, and `middleware`.
   *
   * @param {string|!RegExp} path Path string or regular expression.
   * @param {!Array<string>} methods Array of HTTP verbs.
   * @param {!_goa.Middleware|!Array<!_goa.Middleware>} middleware Layer callback/middleware or series of.
   * @param {!_goa.LayerConfig} [opts] The options.
   */
  constructor(path, methods, middleware, opts = {}) {
    const { name = null } = opts
    this.opts = opts
    /**
     * @type {string|null}
     */
    this.name = name
    /**
     * @type {!Array<string>}
     */
    this.methods = []
    this.paramNames = []
    this.stack = Array.isArray(middleware) ? middleware : [middleware]

    methods.forEach((method) => {
      const l = this.methods.push(method.toUpperCase())
      if (this.methods[l-1] == 'GET') {
        this.methods.unshift('HEAD')
      }
    })

    // ensure middleware is a function
    this.stack.forEach((fn) => {
      const type = typeof fn
      if (type != 'function') {
        throw new Error(
          methods.toString() + " `" + (name || path) +"`: `middleware` "
          + "must be a function, not `" + type + "`"
        )
      }
    })

    this.path = path
    this.regexp = pathToRegExp(path, this.paramNames, this.opts)

    debug('defined route %s %s', this.methods, this.opts.prefix + this.path)
  }
  /**
   * Returns whether request `path` matches route.
   * @param {string} path
   */
  match(path) {
    return this.regexp.test(path)
  }

  /**
   * Returns map of URL parameters for given `path` and `paramNames`.
   * @param {string} path
   * @param {!Array<string>} captures
   * @param {!Object} [params]
   */
  params(path, captures, params = {}) {
    for (let len = captures.length, i=0; i<len; i++) {
      if (this.paramNames[i]) {
        const c = captures[i]
        params[this.paramNames[i].name] = c ? safeDecodeURIComponent(c) : c
      }
    }

    return params
  }
  /**
   * Returns array of regexp url path captures.
   * @param {string} path
   */
  captures(path) {
    if (this.opts.ignoreCaptures) return []
    return path.match(this.regexp).slice(1)
  }
  /**
   * Generate URL for route using given `params`.
   *
   * @example
   *
   * ```javascript
   * var route = new Layer(['GET'], '/users/:id', fn);
   *
   * route.url({ id: 123 }); // => "/users/123"
   * ```
   *
   * @param {Object} params url parameters
   * @param {Object} options
   */
  url(params, options) {
    let args = params
    const url = this.path.replace(/\(\.\*\)/g, '')
    const toPath = compile(url)
    let replaced

    if (typeof params != 'object') {
      args = Array.prototype.slice.call(arguments)
      if (typeof args[args.length - 1] == 'object') {
        options = args[args.length - 1]
        args = args.slice(0, args.length - 1)
      }
    }

    const tokens = parse(url)
    let replace = {}

    if (Array.isArray(args)) {
      for (let len = tokens.length, i=0, j=0; i<len; i++) {
        if (tokens[i].name) replace[tokens[i].name] = args[j++]
      }
    } else if (tokens.some(token => token.name)) {
      replace = params
    } else {
      options = params
    }

    replaced = toPath(replace)

    if (options && options.query) {
      const r = new uri(replaced)
      r.search(options.query)
      return r.toString()
    }

    return replaced
  }
  /**
   * Run validations on route named parameters.
   *
   * @example
   *
   * ```javascript
   * router
   *   .param('user', function (id, ctx, next) {
   *     ctx.user = users[id];
   *     if (!user) return ctx.status = 404;
   *     next();
   *   })
   *   .get('/users/:user', function (ctx, next) {
   *     ctx.body = ctx.user;
   *   });
   * ```
   *
   * @param {string} param
   * @param {!Function} middleware
   */
  param(param, middleware) {
    function mw (ctx, next) {
      return middleware.call(this, ctx.params[param], ctx, next)
    }
    mw.param = param

    const names = this.paramNames.map(({ name }) => name)

    const x = names.indexOf(param)
    if (x > -1) {
      // iterate through the stack, to figure out where to place the handler fn
      this.stack.some((fn, i) => {
        // param handlers are always first, so when we find an fn w/o a param property, stop here
        // if the param handler at this part of the stack comes after the one we are adding, stop here
        if (!fn.param || names.indexOf(fn.param) > x) {
          // inject this param handler right before the current item
          this.stack.splice(i, 0, mw)
          return true // then break the loop
        }
      })
    }

    return this
  }

  /**
   * Prefix route path.
   * @param {string} prefix
   */
  setPrefix(prefix) {
    if (this.path) {
      this.path = prefix + this.path
      this.paramNames = []
      this.regexp = pathToRegExp(this.path, this.paramNames, this.opts)
    }

    return this
  }
}


/**
 * Safe decodeURIComponent, won't throw any error.
 * If `decodeURIComponent` error happen, just return the original value.
 *
 * @param {string} text
 */
function safeDecodeURIComponent(text) {
  try {
    return decodeURIComponent(text)
  } catch (e) {
    return text
  }
}

/**
 * @suppress {nonStandardJSDocs}
 * @typedef {import('../').LayerConfig} _goa.LayerConfig
 */
/**
 * @suppress {nonStandardJSDocs}
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 */