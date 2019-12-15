import Router from '../../src'

const router = new Router()

/* start example */
router.get('user', '/users/:id', (ctx, next) => {
  // ...
})

router.url('user', 3)
// => "/users/3"

router.url('user', { id: 3 })
// => "/users/3"

router.use((ctx, next) => {
  // redirect to named route
  ctx.redirect(ctx.router.url('sign-in'))
})

router.url('user', { id: 3 }, { query: { limit: 1 } })
// => "/users/3?limit=1"

router.url('user', { id: 3 }, { query: 'limit=1' })
// => "/users/3?limit=1"
/* end example */