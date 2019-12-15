import Goa from '@goa/koa'
import Router from '../../src'

const app = new Goa()
const router = new Router()

router.get('/', (ctx, next) => {
  // ctx.router available
})

app
  .use(router.routes())
  .use(router.allowedMethods())