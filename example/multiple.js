router.get(
  '/users/:id',
  async (ctx, next) => {
    const user = await User.findOne(ctx.params.id)
    ctx.user = user
    await next()
  },
  ctx => {
    console.log(ctx.user)
    // => { id: 17, name: "Alex" }
  }
)