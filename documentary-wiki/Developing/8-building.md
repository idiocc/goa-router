## Building

The package is built with a 0-dependency regex-based _ÀLaMode_ transpiler that only updates imports and export statements into require calls and `module.exports` assignments keeping the rest of code as it is.

The transpilation happens with the following settings in `.alamoderc`:

```json
"build": {
  "import": {
    "stdlib": {
      "path": "stdlib",
      "packages": ["erte"]
    },
    "alamodeModules": ["argufy"]
  }
}
```

For `imports` directive, see the [**stdlib**](#stdlib) section. `alamodeModules` contains the list of packages that were also transpiled using ÀLaMode, or use standard `module.exports` syntax without `__esModule` setting, which allows to simply import them as:

```js
let argufy = require('argufy');
// otherwise, the __esModule check is added
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
```

%~%