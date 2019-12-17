## Stdlib

To flatten the dependency trees, a standard library is created from the main dependencies of this package. The `.alamoderc.json` file contains the following configuration:

```json
{
  "import": {
    "stdlib": {
      "path": "stdlib",
      "packages": ["erte"]
    }
  }
}
```

This means that the transpiler will rename all imports from packages specified in the `packages` field to point to the `stdlib` path.

```js
import { c } from 'erte' // becomes
const { c } = require('../stdlib');
```

The stdlib itself is compiled using _Depack_ by importing all required modules and assigning them to the `module.exports`:

```js
import { c } from 'erte'

module.exports = {
  'c': c,
}
```

Therefore, dependencies that were placed in the `stdlib` don't have to be specified in the package's dependencies list and can be moved into `devDependencies`.