import Router from '../src'
import Goa from '@goa/koa'
import rqt from 'rqt'

const goa = new Goa()
goa.use(async (ctx, next) => {
  console.log('// Request %s', ctx.path)
  await next()
})

/* start example */
const router = new Router({
  prefix: '/users',
})

router.get('/', (ctx) => {
  // responds to "/users"
  ctx.body = ctx.params
})
router.get('/:id', (ctx) => {
  // responds to "/users/:id"
  ctx.body = ctx.params
})

goa.use(router.routes())
/* end example */

goa.listen(async function() {
  const url = `http://localhost:${this.address().port}`
  let res = await rqt(`${url}/users`)
  console.log(res)
  res = await rqt(`${url}/users/123`)
  console.log(res)
  this.close()
})