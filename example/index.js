/* start example */
import rqt, { aqt } from 'rqt'
import Goa from '@goa/koa'
import Router from '../src'

const goa = new Goa()
const router = new Router()
router
  .get('/', (ctx) => {
    ctx.body = `Hello world`
  })
  .post('/users/:uid', (ctx) => {
    ctx.body = `You have edited the user ${ctx.params.uid}`
  })
goa.use(router.routes())

goa.use(router.allowedMethods())

/* end example */
// goa.use(async (ctx, next) => {
//   console.log('Request %s', ctx.path)
//   await next()
// })
goa.listen(async function() {
  const url = `http://localhost:${this.address().port}`
  let res = await rqt(`${url}/`)
  console.log('\u200B\n\n\n\n\n\n')
  console.log('# GET /')
  console.log(res)
  res = await rqt(`${url}/users/100`, {
    method: 'POST',
    data: { name: 'update' },
  })
  console.log('\n# POST /users/100')
  console.log(res)
  const { headers: { allow } } = await aqt(url, {
    method: 'OPTIONS',
  })
  console.log('\n\n# OPTIONS /')
  console.log(allow)
  this.close()
})