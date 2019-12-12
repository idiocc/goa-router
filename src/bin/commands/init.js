import indicatrix from 'indicatrix'

export default async function Init() {
  const p = new Promise(r => setTimeout(r, 2000))
  await indicatrix('Initialising the package', p)
}