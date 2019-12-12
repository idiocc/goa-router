## Binary

A binary file is created to execute the package from command line.

There are two entries in the `bin` property of _package.json_:

- the standard executable `mnp`,
- and the `mnp-dev` executable which points to the source location. It is there so that it is possible to run the binary locally when developing, without having to build it first, from other directories. To be able to do it, the package needs to be linked first (`yarn link`).

Binary can be also executed in the project directory by running `yarn dev` command which will spawn the `src/bin/index.js` file, which contains the require hook needed to enable modules' syntax.

%~%