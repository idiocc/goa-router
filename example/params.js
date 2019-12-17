import Router from '../src'
import Goa from '@goa/koa'
import rqt from 'rqt'

const goa = new Goa()
goa.use(async (ctx, next) => {
  console.log('// Request %s', ctx.path)
  await next()
})

/* start example */
const router = new Router()

router.get('/:category/:title', (ctx) => {
  // the params are exposed to the context.
  ctx.body = ctx.params
})

goa.use(router.routes())
/* end example */

goa.listen(async function() {
  const url = `http://localhost:${this.address().port}`
  let res = await rqt(`${url}/programming/how-to-node`)
  console.log(res)
  this.close()
})