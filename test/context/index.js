import { equal } from '@zoroaster/assert'
import Goa from '@goa/koa'
import HttpContext from '@contexts/http'
import Router from '../../src'

/**
 * A testing context for the package.
 */
export default class Context extends HttpContext {
  constructor() {
    super()
  }
  get app() {
    if (this._app) return this._app
    const app = new Goa()
    this._app = app
    return app
  }
  /**
   * Starts the app for testing.
   * @param {import('../../src').default} [router] The router.
   * @param {boolean|AllowedMethodsOptions} [allowedMethods] Install the allowed methods middleware.
   */
  startApp(router, allowedMethods) {
    if (router) this.app.use(router.routes())
    if (allowedMethods) this.app.use(
      router.allowedMethods(typeof allowedMethods == 'boolean' ? {} : allowedMethods)
    )
    return this.startPlain(this.app.callback())
  }
  /**
   * @param {string} prefix
   */
  makeRouter(prefix) {
    const router = new Router()
    this.middlewareCount = 0

    router.use((ctx, next) => {
      this.middlewareCount++
      ctx.thing = 'worked'
      return next()
    })

    router.get('/', (ctx) => {
      this.middlewareCount++
      ctx.body = { name: ctx.thing }
    })

    if (prefix) router.prefix(prefix)
    return router
  }
  assertCount(count) {
    equal(this.middlewareCount, count)
  }
}

/**
 * @typedef {import('../..').AllowedMethodsOptions} AllowedMethodsOptions
 */