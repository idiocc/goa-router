import Router from '../src'
import Goa from '@goa/koa'
import rqt from 'rqt'

const goa = new Goa()
goa.use(async (ctx, next) => {
  console.log('// %s %s', ctx.method, ctx.path)
  await next()
})

/* start example */
const forums = new Router()
const posts = new Router()

posts.get('/', (ctx) => {
  ctx.body = ctx.params
})
posts.get('/:pid', (ctx) => {
  ctx.body = ctx.params
})
forums.use('/forums/:fid/posts',
  posts.routes(),
  posts.allowedMethods())

goa.use(forums.routes())
/* end example */

goa.listen(async function() {
  console.log('\u200B\n\n')
  const url = `http://localhost:${this.address().port}`
  let res = await rqt(`${url}/forums/123/posts`)
  console.log(res)
  console.log()
  res = await rqt(`${url}/forums/123/posts/123`)
  console.log(res)
  console.log('\n\n\n\n\n\u200B')
  this.close()
})