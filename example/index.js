import myNewPackage from '../src'

(async () => {
  const res = await myNewPackage({
    text: 'example',
  })
  console.log(res)
})()