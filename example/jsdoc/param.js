import Goa from '@goa/koa'
import rqt from 'rqt'
import Router from '../../src'

const goa = new Goa()
const router = new Router()

const users = {
  3: {
    id: 3,
    name: 'Alex',
    async getFriends() {
      return [{ id: 4, name: 'TJ' }]
    },
  },
}

/* start example */
router
  .param('user', (id, ctx, next) => {
    ctx.user = users[id]
    if (!ctx.user) return ctx.status = 404
    return next()
  })
  .get('/users/:user', ctx => {
    ctx.body = ctx.user
  })
  .get('/users/:user/friends', async ctx => {
    ctx.body = await ctx.user.getFriends()
  })
/* end example */

goa.use(router.routes())
goa.listen(async function() {
  const url = `http://localhost:${this.address().port}`
  const res = await rqt(`${url}/users/3`)
  console.log(res)
  const friends = await rqt(`${url}/users/3/friends`)
  console.log(friends)
  this.close()
})