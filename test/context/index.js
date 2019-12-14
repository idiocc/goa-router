import Goa from '@goa/koa'
import HttpContext from '@contexts/http'

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
   */
  startApp() {
    return this.startPlain(this.app.callback())
  }
}
