router.get('user', '/users/:id', (ctx, next) => {
  // ...
})

router.url('user', 3)
// => "/users/3"