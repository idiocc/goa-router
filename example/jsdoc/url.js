import Router from '../../src'

const router = new Router()

/* start example */
// To use urls, a named route should be created:
router.get('user', '/users/:id', (ctx, next) => {
  // ...
})
/// Get the URL by passing a **simple** parameter
router.url('user', 3)
// => "/users/3"
/// Get the URL by passing parameters in an **object**
router.url('user', { id: 3 })
// => "/users/3"
/// Use the url method for **redirects** to named routes:
router.use((ctx) => {
  ctx.redirect(ctx.router.url('sign-in'))
})
/// Pass an **object query**:
router.url('user', { id: 3 }, { query: { limit: 1 } })
// => "/users/3?limit=1"
/// Pass an already **serialised query**:
router.url('user', { id: 3 }, { query: 'limit=1' })
// => "/users/3?limit=1"
/* end example */