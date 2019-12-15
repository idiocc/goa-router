import Goa from '@goa/koa'
import Router from '../../src'

const app = new Goa()
const router = new Router()

app.use(router.routes())
app.use(router.allowedMethods())