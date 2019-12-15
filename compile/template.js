const { _Router } = require('./router')

class Router extends _Router {
  /**
   * @fnType {_goa.Router.constructor}
   */
  constructor(opts) {
    super(opts)
  }
  /**
   * @fnType {_goa.Router.allowedMethods}
   */
  allowedMethods(options) {
    return super.allowedMethods(options)
  }
  /**
   * @fnType {_goa.Router.param}
   */
  param(param, middleware) {
    return super.param(param, middleware)
  }
}

module.exports = Router

/* typal types/index.xml namespace */

/**
 * @typedef {import('@typedefs/goa').Middleware} _goa.Middleware
 */