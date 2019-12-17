import Goa from '@goa/koa'
import Router from '../../src'
import Boom from 'boom'

/* start example */
const app = new Goa()
const router = new Router()

app.use(router.routes())
app.use(router.allowedMethods({
  throw: true,
  notImplemented: () => new Boom.notImplemented(),
  methodNotAllowed: () => new Boom.methodNotAllowed(),
}))
/* end example */