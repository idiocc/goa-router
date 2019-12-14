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
   * @param {!_goa.RouterConfig} [opts]
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
}

module.exports = Router

/* typal types/index.xml namespace */
