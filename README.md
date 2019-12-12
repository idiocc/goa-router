# my-new-package

[![npm version](https://badge.fury.io/js/my-new-package.svg)](https://www.npmjs.com/package/my-new-package)

`my-new-package` is {{ description }}

```sh
yarn add my-new-package
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [API](#api)
- [`async myNewPackage(config: !Config): string`](#async-mynewpackageconfig-config-string)
  * [`Config`](#type-config)
- [CLI](#cli)
- [Copyright & License](#copyright--license)

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/0.svg?sanitize=true">
</a></p>

## API

The package is available by importing its default function:

```js
import myNewPackage from 'my-new-package'
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/1.svg?sanitize=true">
</a></p>

## <code>async <ins>myNewPackage</ins>(</code><sub><br/>&nbsp;&nbsp;`config: !Config,`<br/></sub><code>): <i>string</i></code>
{{ description }}

 - <kbd><strong>config*</strong></kbd> <em><code><a href="#type-config" title="Options for the program.">!Config</a></code></em>: The config.

__<a name="type-config">`Config`</a>__: Options for the program.


|   Name    |       Type       |    Description    | Default |
| --------- | ---------------- | ----------------- | ------- |
| shouldRun | <em>boolean</em> | A boolean option. | `true`  |
| text      | <em>string</em>  | A text to return. | -       |

```js
import myNewPackage from 'my-new-package'

(async () => {
  const res = await myNewPackage({
    text: 'example',
  })
  console.log(res)
})()
```
```
my-new-package called with example
example
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/2.svg?sanitize=true">
</a></p>

## CLI

The package can also be used from the CLI.

<table>
 <thead>
  <tr>
   <th>Argument</th> 
   <th>Short</th>
   <th>Description</th>
  </tr>
 </thead>
  <tr>
   <td>input</td>
   <td></td>
   <td>The path to the input file.</td>
  </tr>
  <tr>
   <td>--output</td>
   <td>-o</td>
   <td>Where to save the output. By default prints to stdout. Default <code>-</code>.</td>
  </tr>
  <tr>
   <td>--init</td>
   <td>-i</td>
   <td>Initialise in the current folder.</td>
  </tr>
  <tr>
   <td>--help</td>
   <td>-h</td>
   <td>Print the help information and exit.</td>
  </tr>
  <tr>
   <td>--version</td>
   <td>-v</td>
   <td>Show the version's number and exit.</td>
  </tr>
</table>

```
{{ description }}

  mnp input [-o output] [-ihv]

	input        	The path to the input file.
	--output, -o 	Where to save the output. By default prints to stdout.
	             	Default: -.
	--init, -i   	Initialise in the current folder.
	--help, -h   	Print the help information and exit.
	--version, -v	Show the version's number and exit.

  Example:

    mnp example.txt -o out.txt
```

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/3.svg?sanitize=true">
</a></p>

## Copyright & License

{{ license_name }}

<table>
  <tr>
    <td><img src="https://avatars3.githubusercontent.com/u/38815725?v=4&amp;s=100" alt="{{ org }}"></td>
    <td>© <a href="{{ website }}">{{ trademark }}</a> 2019</td>
  </tr>
</table>

<p align="center"><a href="#table-of-contents">
  <img src="/.documentary/section-breaks/-1.svg?sanitize=true">
</a></p>